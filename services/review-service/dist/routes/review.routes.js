import express from "express";
import prisma from "../prisma.js";
import { createReviewSchema, updateReviewSchema } from "../schemas.js";
import { isAuthenticated } from "../middlewares/auth.js";
import axios from "axios";
import { publishAnalyticsEvents } from "../kafka/producer.js";
const router = express.Router();
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL?.trim() || "http://localhost:3004";
async function emitAnalyticsEvent(req, payload) {
    try {
        await publishAnalyticsEvents([{ userId: req.userId, ...payload }]);
    }
    catch (error) {
        console.warn("Failed to emit analytics event to Kafka:", error);
    }
}
/**
 * Fetch Book Meta.
 * @param bookId - book Id value.
 */
async function fetchBookMeta(bookId) {
    try {
        const response = await axios.get(`${BOOK_SERVICE_URL}/api/books/${bookId}`, {
            timeout: 5000,
        });
        const book = response.data;
        const author = Array.isArray(book?.authors) && book.authors.length > 0
            ? book.authors[0]?.name
            : undefined;
        return { title: book?.title, author };
    }
    catch {
        return {};
    }
}
// Create a new review
router.post("/", isAuthenticated, async (req, res) => {
    const parseResult = createReviewSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res
            .status(400)
            .json({ error: "Invalid input", details: parseResult.error.issues });
    }
    try {
        const review = await prisma.review.create({
            data: { ...parseResult.data, userId: req.userId },
        });
        res.status(201).json(review);
        const bookMeta = await fetchBookMeta(review.bookId);
        await emitAnalyticsEvent(req, {
            type: "BOOK_RATED",
            payload: {
                bookId: review.bookId,
                rating: review.rating,
                ...bookMeta,
            },
        });
    }
    catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get all reviews for a specific book
router.get("/book/:bookId", async (req, res) => {
    const { bookId } = req.params;
    const limitRaw = req.query.limit ? Number(req.query.limit) : undefined;
    const offsetRaw = req.query.offset ? Number(req.query.offset) : undefined;
    if ((limitRaw !== undefined && (!Number.isInteger(limitRaw) || limitRaw <= 0)) ||
        (offsetRaw !== undefined && (!Number.isInteger(offsetRaw) || offsetRaw < 0))) {
        return res.status(400).json({ error: "Invalid pagination parameters" });
    }
    const limit = Math.min(limitRaw ?? 10, 100);
    const offset = Math.min(offsetRaw ?? 0, 10_000);
    try {
        const reviews = await prisma.review.findMany({
            where: { bookId },
            skip: offset,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                rating: true,
                reviewText: true,
                tldr: true,
                userId: true,
                bookId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(reviews);
    }
    catch (error) {
        console.error("Error fetching reviews for book:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get all reviews from a specific user
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    const limitRaw = req.query.limit ? Number(req.query.limit) : undefined;
    const offsetRaw = req.query.offset ? Number(req.query.offset) : undefined;
    if ((limitRaw !== undefined && (!Number.isInteger(limitRaw) || limitRaw <= 0)) ||
        (offsetRaw !== undefined && (!Number.isInteger(offsetRaw) || offsetRaw < 0))) {
        return res.status(400).json({ error: "Invalid pagination parameters" });
    }
    const limit = Math.min(limitRaw ?? 10, 100);
    const offset = Math.min(offsetRaw ?? 0, 10_000);
    try {
        const reviews = await prisma.review.findMany({
            where: { userId },
            skip: offset,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                rating: true,
                reviewText: true,
                tldr: true,
                userId: true,
                bookId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(reviews);
    }
    catch (error) {
        console.error("Error fetching reviews for user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get a single review by its ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const review = await prisma.review.findUnique({
            where: { id },
            select: {
                id: true,
                rating: true,
                reviewText: true,
                tldr: true,
                userId: true,
                bookId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.json(review);
    }
    catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Update a review
router.put("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const parseResult = updateReviewSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res
            .status(400)
            .json({ error: "Invalid input", details: parseResult.error.issues });
    }
    if (Object.keys(parseResult.data).length === 0) {
        return res.status(400).json({ error: "At least one field must be provided" });
    }
    try {
        const review = await prisma.review.findUnique({
            where: { id },
            select: { id: true, userId: true },
        });
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        if (review.userId !== req.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }
        const updatedReview = await prisma.review.update({
            where: { id },
            data: parseResult.data,
            select: {
                id: true,
                rating: true,
                reviewText: true,
                tldr: true,
                userId: true,
                bookId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(updatedReview);
        if (parseResult.data.rating !== undefined) {
            const bookMeta = await fetchBookMeta(updatedReview.bookId);
            await emitAnalyticsEvent(req, {
                type: "BOOK_RATED",
                payload: {
                    bookId: updatedReview.bookId,
                    rating: updatedReview.rating,
                    ...bookMeta,
                },
            });
        }
    }
    catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Delete a review
router.delete("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const review = await prisma.review.findUnique({
            where: { id },
            select: { id: true, userId: true },
        });
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        if (review.userId !== req.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }
        await prisma.review.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
