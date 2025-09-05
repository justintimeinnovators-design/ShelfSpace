import { z } from "zod";

export const bookSchema = z.object({
  series: z.array(z.string()).optional(),
  language_code: z.string().optional(),
  average_rating: z.number().optional(),
  similar_books: z.array(z.string()).optional(),
  description: z.string().optional(),
  authors: z
    .array(
      z.object({
        author_id: z.string(),
        name: z.string(),
        role: z.string(),
      })
    )
    .optional(),
  publisher: z.string().optional(),
  num_pages: z.number().optional(),
  isbn13: z.string().optional(),
  publication_year: z.string().optional(),
  url: z.string().optional(),
  image_url: z.string().optional(),
  book_id: z.string(),
  work_id: z.string().optional(),
  title: z.string(),
  title_without_series: z.string().optional(),
  genres: z.array(z.string()).optional(),
});

export const createBookSchema = z.object({
  body: bookSchema,
});

export const updateBookSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: bookSchema.partial(),
});

export const getBookByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const deleteBookSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const searchBookSchema = z.object({
  query: z.object({
    q: z.string(),
  }),
});

export const getBooksByRatingSchema = z.object({
  params: z.object({
    rating: z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "Rating must be a number",
    }),
  }),
});

export const getBooksByGenreSchema = z.object({
  params: z.object({
    genre: z.string(),
  }),
});

export const getBooksByAuthorSchema = z.object({
  params: z.object({
    author: z.string(),
  }),
});
