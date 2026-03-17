import type { Request, Response } from "express";
import Book from "../models/book.js";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import { publishAnalyticsEvents } from "../kafka/producer.js";

async function emitAnalyticsEvent(req: Request, payload: Record<string, any>) {
  try {
    await publishAnalyticsEvents([{ userId: req.user?.id, ...payload }]);
  } catch {
    console.warn("Failed to emit analytics event to Kafka");
  }
}

/**
 * Escapes special regex characters to prevent ReDoS and injection attacks
 * @param text - User input string to escape
 * @returns Escaped string safe for use in regex
 */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

//
/**
 * Create Book.
 * @param req - req value.
 * @param res - res value.
 */
export const createBook = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body };
    if (!payload.book_id) {
      payload.book_id = randomUUID();
    }
    const book = await Book.create(payload);
    res.status(201).json(book);

    await emitAnalyticsEvent(req, {
      type: "BOOK_CREATED",
      payload: {
        bookId: book.book_id || book._id?.toString(),
        title: book.title,
        author: Array.isArray(book.authors) && book.authors.length > 0
          ? book.authors[0]?.name
          : undefined,
        pages: book.num_pages,
        genres: book.genres,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating book", error });
  }
};

/**
 * Get All Books.
 * @param req - req value.
 * @param res - res value.
 */
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    // --- 1. DESTRUCTURE QUERY PARAMETERS ---
    const { author, genre, sortBy, page = 1, limit, search } = req.query;

    const maxLimit = 100;
    const pageSizeRaw = typeof limit === "string" ? parseInt(limit, 10) : 30;
    const pageSize = Math.min(Math.max(pageSizeRaw || 30, 1), maxLimit);
    const pageNum = parseInt(typeof page === 'string' ? page : String(page), 10) || 1;

    // --- 2. BUILD THE AGGREGATION PIPELINE ---
    const pipeline: any[] = [];

    // --- STAGE 1: $match (Filter) ---
    const matchConditions: any = {};

    if (author && typeof author === 'string') {
      // Sanitize author input to prevent NoSQL injection
      const sanitizedAuthor = escapeRegex(author);
      matchConditions["authors.name"] = { $regex: sanitizedAuthor, $options: "i" };
    }

    if (genre && typeof genre === 'string') {
      matchConditions.genres = { $in: [genre] };
    }

    if (search && typeof search === 'string') {
      // Sanitize search input to prevent NoSQL injection and ReDoS attacks
      const sanitizedSearch = escapeRegex(search);
      matchConditions.$or = [
        { title: { $regex: sanitizedSearch, $options: "i" } },
        { "authors.name": { $regex: sanitizedSearch, $options: "i" } },
        { description: { $regex: sanitizedSearch, $options: "i" } },
      ];
    }
    
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // --- STAGE 2: $sort (Sort) ---
    // Determine sort order based on the 'sortBy' query param
    const sortDirection = sortBy === "desc" ? -1 : 1; // -1 for descending, 1 for ascending
    pipeline.push({
      $sort: {
        title: sortDirection,
      },
    });

    // --- STAGE 3: $facet (Pagination & Metadata) ---
    // $facet allows us to process the data in two parallel ways:
    // 1. Get metadata (like the total count of matched books)
    // 2. Get the paginated data itself
    pipeline.push({
      $facet: {
        // Sub-pipeline 1: for metadata
        metadata: [{ $count: "totalBooks" }],
        // Sub-pipeline 2: for the actual page of data
        data: [
          { $skip: (pageNum - 1) * pageSize },
          { $limit: pageSize },
          {
            $project: {
              series: 0,
              similar_books: 0,
              publisher: 0,
              url: 0,
              work_id: 0,
              title_without_series: 0,
            },
          },
        ],
      },
    });

    // --- 3. EXECUTE THE PIPELINE ---
    const result = await Book.collection
      .aggregate(pipeline, { allowDiskUse: true })
      .toArray();

    // --- 4. FORMAT THE RESPONSE ---
    // The result is an array with one element containing metadata and data
    const books = result[0].data;
    const totalBooks = result[0].metadata[0]
      ? result[0].metadata[0].totalBooks
      : 0;

    res.json({
      success: true,
      totalBooks: totalBooks,
      currentPage: pageNum,
      totalPages: Math.ceil(totalBooks / pageSize),
      books: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * Get Book By Id.
 * @param req - req value.
 * @param res - res value.
 */
export const getBookById = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    // Support both Mongo _id and external book_id lookups
    const orConditions: Array<Record<string, string>> = [{ book_id: bookId }];
    if (mongoose.isValidObjectId(bookId)) {
      orConditions.push({ _id: bookId });
    }
    const book = await Book.findOne({ $or: orConditions });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);

    await emitAnalyticsEvent(req, {
      type: "BOOK_VIEWED",
      payload: {
        bookId: book.book_id || book._id?.toString(),
        title: book.title,
        author: Array.isArray(book.authors) && book.authors.length > 0
          ? book.authors[0]?.name
          : undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting book", error });
  }
};

/**
 * Update Book.
 * @param req - req value.
 * @param res - res value.
 */
export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);

    await emitAnalyticsEvent(req, {
      type: "BOOK_UPDATED",
      payload: {
        bookId: book.book_id || book._id?.toString(),
        title: book.title,
        author: Array.isArray(book.authors) && book.authors.length > 0
          ? book.authors[0]?.name
          : undefined,
        pages: book.num_pages,
        genres: book.genres,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
};

/**
 * Delete Book.
 * @param req - req value.
 * @param res - res value.
 */
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(204).send();

    await emitAnalyticsEvent(req, {
      type: "BOOK_DELETED",
      payload: {
        bookId: book.book_id || book._id?.toString(),
        title: book.title,
        author: Array.isArray(book.authors) && book.authors.length > 0
          ? book.authors[0]?.name
          : undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
};

/**
 * Search Books.
 * @param req - req value.
 * @param res - res value.
 */
export const searchBooks = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const pageParam = req.query.page;
    const limitParam = req.query.limit;
    const maxLimit = 100;
    const pageSizeRaw = typeof limitParam === "string" ? parseInt(limitParam, 10) : 30;
    const pageSize = Math.min(Math.max(pageSizeRaw || 30, 1), maxLimit);
    const pageNum =
      parseInt(typeof pageParam === "string" ? pageParam : String(pageParam), 10) || 1;

    const pipeline: any[] = [
      { $match: { $text: { $search: query } } },
      { $sort: { score: { $meta: "textScore" } } },
      {
        $facet: {
          metadata: [{ $count: "totalBooks" }],
          data: [
            { $skip: (pageNum - 1) * pageSize },
            { $limit: pageSize },
            {
              $project: {
                series: 0,
                similar_books: 0,
                publisher: 0,
                url: 0,
                work_id: 0,
                title_without_series: 0,
              },
            },
          ],
        },
      },
    ];

    const result = await Book.collection
      .aggregate(pipeline, { allowDiskUse: true })
      .toArray();
    const books = result[0].data;
    const totalBooks = result[0].metadata[0]
      ? result[0].metadata[0].totalBooks
      : 0;

    res.status(200).json({
      success: true,
      totalBooks,
      currentPage: pageNum,
      totalPages: Math.ceil(totalBooks / pageSize),
      books,
    });

    await emitAnalyticsEvent(req, {
      type: "BOOK_SEARCHED",
      payload: { query },
    });
  } catch (error) {
    res.status(500).json({ message: "Error searching books", error });
  }
};

/**
 * Get Genres.
 * @param req - req value.
 * @param res - res value.
 */
export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Book.distinct("genres");
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ message: "Error getting genres", error });
  }
};

/**
 * Get Authors.
 * @param req - req value.
 * @param res - res value.
 */
export const getAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Book.distinct("authors.name");
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error getting authors", error });
  }
};

/**
 * Get Languages.
 * @param req - req value.
 * @param res - res value.
 */
export const getLanguages = async (req: Request, res: Response) => {
  try {
    const languages = await Book.distinct("language_code");
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ message: "Error getting languages", error });
  }
};
