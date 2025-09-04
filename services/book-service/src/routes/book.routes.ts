import express from "express";
import prisma from "../prisma.ts";
import type { CreateBookInput } from "../schemas.ts";
import { createBookSchema, getAllBooksQueryParamsSchema } from "../schemas.ts";
import z from "zod";
import axios from "axios";

const router = express.Router();

//GET /api/books -Get many books
router.get("/books", async (req, res) => {
  try {
    // Validate and parse query parameters using Zod
    const { page, limit, genre, authorId, search, sortBy, order } =
      getAllBooksQueryParamsSchema.parse(req.query);

    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {}; // Use 'any' for dynamic where clause construction
    if (genre) {
      where.genre = genre;
    }
    if (authorId) {
      where.authorId = authorId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { authorName: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = order;
    } else {
      orderBy.title = "asc"; // Default sort
    }

    const books = await prisma.book.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        title: true,
        authorId: true,
        authorName: true,
        genre: true,
        publicationDate: true,
        coverImageUrl: true,
        averageRating: true,
        reviewCount: true,
      },
    });

    const totalBooks = await prisma.book.count({ where });

    res.status(200).json({
      data: books,
      meta: {
        total: totalBooks,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalBooks / limit),
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: error.errors });
    }
    console.error("Error fetching books:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// GET /api/book/:id - Get book
router.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Zod for UUID validation (can be done directly or with a schema)
    const idValidation = z
      .string()
      .uuid("Invalid book ID format (must be a UUID).")
      .safeParse(id);
    if (!idValidation.success) {
      return res
        .status(400)
        .json({ message: idValidation.error.errors[0].message });
    }

    const book = await prisma.book.findUnique({
      where: { id: id },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    let reviewStats: any = {};
    try {
      // IMPORTANT: Replace 'review-service:300X' with your actual Docker service name and port
      const reviewServiceResponse = await axios.get(
        `http://review-service:3000/api/reviews/books/${book.id}/stats`
      );
      reviewStats = reviewServiceResponse.data;
    } catch (reviewError: any) {
      console.warn(
        `Could not fetch review stats for book ${book.id}:`,
        reviewError.message
      );
      // Log the error but continue, as review stats are optional for basic book display
    }

    const fullBookDetails = {
      ...book,
      averageRating: reviewStats.averageRating || book.averageRating || 0,
      reviewCount: reviewStats.reviewCount || book.reviewCount || 0,
      ratingsBreakdown: reviewStats.ratingsBreakdown || {},
    };

    res.status(200).json(fullBookDetails);
  } catch (error: any) {
    console.error("Error fetching book by ID:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// POST /api/books/create -Create a book (for admins)
router.post("/", async (req, res) => {
  // console.log(req.socket.remoteAddress);
  try {
    if (req.params.passkey !== process.env.passkey)
      throw new Error("Unauthorized access!");
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({
      message: "Unauthorized access",
    });
  }

  try {
    // Validate request body using Zod
    const bookData: CreateBookInput = createBookSchema.parse(req.body);

    const {
      title,
      authorId,
      genre,
      description,
      publicationDate,
      isbn,
      pageCount,
      publisher,
      language,
      coverImageUrl,
    } = bookData;

    let authorName: string = "Unknown Author";
    try {
      // IMPORTANT: Replace 'user-service:300Y' with your actual Docker service name and port
      const authorResponse = await axios.get(
        `http://user-service:3001/api/users/${authorId}`
      );
      if (authorResponse.data && authorResponse.data.name) {
        authorName = authorResponse.data.name;
      }
    } catch (authorError: any) {
      console.warn(
        `Author with ID ${authorId} not found in user-service or service unreachable:`,
        authorError.message
      );
      // Depending on your business logic, you might want to return a 400 here
      // return res.status(400).json({ message: `Author with ID ${authorId} not found.` });
    }

    const existingBook = await prisma.book.findUnique({
      where: { isbn: isbn },
    });

    if (existingBook) {
      return res
        .status(409)
        .json({ message: "A book with this ISBN already exists." });
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        authorId,
        authorName,
        genre,
        description,
        publicationDate: publicationDate ? new Date(publicationDate) : null,
        isbn,
        pageCount,
        publisher,
        language,
        coverImageUrl,
        averageRating: 0,
        reviewCount: 0,
      },
    });

    res.status(201).json(newBook);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: error.errors });
    }
    // Handle Prisma specific errors, e.g., unique constraint violation

    if (error.code === "P2002") {
      // Prisma unique constraint violation code
      return res
        .status(409)
        .json({ message: "A book with this ISBN already exists." });
    }
    console.error("Error adding new book:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
