import { z } from "zod";

// Schema for creating a new book
export const createBookSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  authorId: z.string().uuid("Invalid author ID format (must be a UUID)."),
  genre: z.string().trim().min(1, "Genre is required."),
  description: z.string().trim().optional().default(""),
  publicationDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Publication date must be in YYYY-MM-DD format."
    )
    .optional(),
  isbn: z
    .string()
    .trim()
    .regex(
      /^(?:ISBN(?:-13)?:?)(?=[0-9]{13}$)\d{3}-?\d{1}-?\d{3}-?\d{5}-?\d{1}$|^(?:ISBN(?:-10)?:?)(?=[0-9]{10}$)\d{1}-?\d{3}-?\d{5}-?[\dX]$/i,
      "Invalid ISBN format."
    )
    .min(1, "ISBN is required."),
  pageCount: z
    .number()
    .int()
    .min(1, "Page count must be at least 1.")
    .optional(),
  publisher: z.string().trim().optional().default(""),
  language: z.string().trim().optional().default(""),
  coverImageUrl: z
    .string()
    .url("Invalid cover image URL format.")
    .optional()
    .default(""),
});

// Define a type for the query parameters for getting all books
export const getAllBooksQueryParamsSchema = z
  .object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform(Number)
      .pipe(z.number().int().min(1)),
    limit: z
      .string()
      .optional()
      .default("10")
      .transform(Number)
      .pipe(z.number().int().min(1)),
    genre: z.string().optional(),
    authorId: z.string().uuid().optional(),
    search: z.string().optional(),
    sortBy: z
      .enum(["title", "publicationDate", "averageRating", "reviewCount"])
      .optional(),
    order: z.enum(["asc", "desc"]).optional().default("asc"),
  })
  .partial();

// Define a type for the book data received from the request body
export type CreateBookInput = z.infer<typeof createBookSchema>;

export interface UserPayload {
  id: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
}
