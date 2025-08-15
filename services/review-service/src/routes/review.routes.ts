import express, { Request, Response } from "express";
import prisma from "../prisma.js";
import { createReviewSchema, updateReviewSchema } from "../schemas.js";
import { isAuthenticated } from "../middlewares/auth.ts";
import { Review } from "../types/review.d.ts";
import { z } from "zod";

const router = express.Router();

// Create a new review
router.post("/", isAuthenticated, async (req: Request<{}, Review, z.infer<typeof createReviewSchema>>, res: Response<Review>) => {
  const parseResult = createReviewSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parseResult.error.errors });
  }

  try {
    const review = await prisma.review.create({
      data: { ...parseResult.data, userId: req.userId! },
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all reviews for a specific book
router.get("/book/:bookId", async (req: Request<{ bookId: string }, Review[], {}, { limit?: string; offset?: string }>, res: Response<Review[]>) => {
  const { bookId } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const reviews = await prisma.review.findMany({
      where: { bookId },
      skip: offset,
      take: limit,
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews for book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all reviews from a specific user
router.get("/user/:userId", async (req: Request<{ userId: string }, Review[], {}, { limit?: string; offset?: string }>, res: Response<Review[]>) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
      skip: offset,
      take: limit,
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews for user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single review by its ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response<Review>) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a review
router.put("/:id", isAuthenticated, async (req: Request<{ id: string }, Review, z.infer<typeof updateReviewSchema>>, res: Response<Review>) => {
  const { id } = req.params;
  const parseResult = updateReviewSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parseResult.error.errors });
  }

  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (review.userId !== req.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: parseResult.data,
    });
    res.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a review
router.delete("/:id", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.findUnique({ where: { id } });
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
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
