import type { Request, Response } from "express";
import Book from "../models/book.ts";

//
export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error creating book", error });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    // --- 1. DESTRUCTURE QUERY PARAMETERS ---
    const { author, sortBy, page = 1 } = req.query;

    console.log(author);

    const pageSize = 30; // As requested, 30 books per page

    // --- 2. BUILD THE AGGREGATION PIPELINE ---
    const pipeline: any[] = [];

    // --- STAGE 1: $match (Filter) ---
    // Conditionally add the $match stage if an author is provided
    if (author) {
      pipeline.push({
        $match: {
          // We use $regex for partial, case-insensitive matching
          // This will find an author even if the name is just part of the string
          "authors.name": { $regex: author, $options: "i" },
        },
      });
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
          { $skip: (parseInt(page) - 1) * pageSize },
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
    const result = await Book.aggregate(pipeline);

    // --- 4. FORMAT THE RESPONSE ---
    // The result is an array with one element containing metadata and data
    const books = result[0].data;
    const totalBooks = result[0].metadata[0]
      ? result[0].metadata[0].totalBooks
      : 0;

    res.json({
      success: true,
      totalBooks: totalBooks,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBooks / pageSize),
      books: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error getting book", error });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
};

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    const books = await Book.find({ $text: { $search: query as string } });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error searching books", error });
  }
};

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Book.distinct("genres");
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ message: "Error getting genres", error });
  }
};

export const getAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Book.distinct("authors.name");
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error getting authors", error });
  }
};

export const getLanguages = async (req: Request, res: Response) => {
  try {
    const languages = await Book.distinct("language_code");
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ message: "Error getting languages", error });
  }
};
