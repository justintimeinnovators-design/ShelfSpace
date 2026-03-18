/**
 * Book service client wrapper.
 *
 * Converts backend book payloads into the frontend `Book` model and exposes
 * typed query helpers for list/detail/search/filter metadata endpoints.
 */
import { createApiClient } from "./api";
import { getErrorMessage } from "./api-utils";

// Backend book response structure
interface BackendBook {
  _id: string;
  book_id?: string;
  title: string;
  authors: Array<{ name: string; role?: string }>;
  image_url?: string;
  published_year?: number;
  publication_year?: string;
  published_date?: string;
  publisher?: string;
  language?: string;
  language_code?: string;
  genres?: string[];
  isbn?: string;
  isbn13?: string;
  description?: string;
  pages?: number;
  num_pages?: number;
  rating?: number;
  average_rating?: number;
  ratings_count?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Frontend book structure (matches frontend/src/types/book.ts)
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
  publishedDate?: string;
  publisher?: string;
  language?: string;
  genres: string[];
  status: "read" | "currently-reading" | "want-to-read";
  rating?: number;
  pages?: number;
  description?: string;
  coverImage?: string;
  cover?: string;
  format?: string;
  personalNotes?: string;
  notes?: string;
  tags?: string[];
  readingProgress?: number;
  progress: number;
  startedAt?: string;
  finishedAt?: string;
  lastReadAt?: string;
  readAt?: string | null;
  averageRating?: number;
  ratingsCount?: number;
  isPublic?: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  addedAt: string;
}

interface PaginatedBooksResponse {
  success: boolean;
  totalBooks: number;
  currentPage: number;
  totalPages: number;
  books: BackendBook[];
}

/**
 * Transforms backend book payload into frontend book shape.
 *
 * @param backendBook Raw backend DTO.
 * @returns Normalized frontend `Book` model.
 */
function transformBook(backendBook: BackendBook): Book {
  const coverUrlRaw = backendBook.image_url || "";
  const coverUrl = coverUrlRaw.startsWith("http://")
    ? coverUrlRaw.replace("http://", "https://")
    : coverUrlRaw;

  // Get first author name or "Unknown"
  const authorName =
    backendBook.authors && backendBook.authors.length > 0
      ? backendBook.authors.map((a) => a.name).join(", ")
      : "Unknown Author";

  const publishedYear =
    backendBook.published_year ||
    (backendBook.publication_year
      ? parseInt(backendBook.publication_year, 10)
      : 0);

  const pages =
    backendBook.pages ||
    (typeof backendBook.num_pages === "number" ? backendBook.num_pages : 0);

  const averageRating =
    typeof backendBook.average_rating === "number"
      ? backendBook.average_rating
      : 0;

  const rating =
    typeof backendBook.rating === "number"
      ? backendBook.rating
      : averageRating;

  const ratingsCount =
    typeof backendBook.ratings_count === "number"
      ? backendBook.ratings_count
      : 0;

  return {
    id: backendBook.book_id || backendBook._id,
    title: backendBook.title || "Untitled",
    author: authorName,
    isbn: backendBook.isbn13 || backendBook.isbn || "",
    publishedYear: publishedYear,
    publishedDate: backendBook.published_date || "",
    publisher: backendBook.publisher || "",
    language: backendBook.language_code || backendBook.language || "en",
    genres: backendBook.genres || [],
    status: "want-to-read", // Default status, will be set by reading lists
    rating: rating,
    pages: pages,
    description: backendBook.description || "",
    coverImage: coverUrl,
    cover: coverUrl,
    averageRating: averageRating,
    ratingsCount: ratingsCount,
    progress: 0,
    createdAt: backendBook.createdAt || new Date().toISOString(),
    updatedAt: backendBook.updatedAt || new Date().toISOString(),
    addedAt: backendBook.createdAt || new Date().toISOString(),
  };
}

class BookServiceClient {
  private bookApi = createApiClient(
    process.env["NEXT_PUBLIC_BOOK_SERVICE_URL"] || "http://localhost:3004"
  );

/**
 * Fetches paginated books with optional filters.
 *
 * @param params Paging/filter/search options.
 * @returns Normalized books and pagination metadata.
 */
  async getBooks(params: {
    page?: number;
    limit?: number;
    author?: string;
    genre?: string;
    sortBy?: "asc" | "desc";
    search?: string;
  } = {}): Promise<{ data: Book[]; pagination: any }> {
    try {
      const response = await this.bookApi.get<PaginatedBooksResponse>("/api/books", { params });
      const books = response.data.books.map(transformBook);

      return {
        data: books,
        pagination: {
          page: response.data.currentPage,
          limit: 30, // Book service uses 30 per page
          total: response.data.totalBooks,
          totalPages: response.data.totalPages,
          hasNext: response.data.currentPage < response.data.totalPages,
          hasPrev: response.data.currentPage > 1,
        },
      };
    } catch (error: any) {
      const message = getErrorMessage(error);
      console.error("Error fetching books:", error);
      throw new Error(message);
    }
  }

/**
 * Fetches one book by identifier.
 */
  async getBookById(bookId: string): Promise<Book> {
    try {
      const response = await this.bookApi.get<BackendBook>(`/api/books/${bookId}`);
      return transformBook(response.data);
    } catch (error: any) {
      const message = getErrorMessage(error) || "Failed to fetch book";
      console.error("Error fetching book:", error);
      if (error?.response?.status === 404) {
        throw new Error("Book not found");
      }
      throw new Error(message);
    }
  }

/**
 * Searches books by free-text query.
 */
  async searchBooks(query: string, page: number = 1): Promise<{ data: Book[]; pagination: any }> {
    try {
      const response = await this.bookApi.get<PaginatedBooksResponse>("/api/books/search", {
        params: { q: query, page },
      });

      const books = response.data.books.map(transformBook);

      return {
        data: books,
        pagination: {
          page: response.data.currentPage,
          limit: 30,
          total: response.data.totalBooks,
          totalPages: response.data.totalPages,
          hasNext: response.data.currentPage < response.data.totalPages,
          hasPrev: response.data.currentPage > 1,
        },
      };
    } catch (error: any) {
      const message = getErrorMessage(error) || "Failed to search books";
      console.error("Error searching books:", error);
      throw new Error(message);
    }
  }

/**
 * Fetches all available book genres.
 */
  async getGenres(): Promise<string[]> {
    try {
      const response = await this.bookApi.get<string[]>("/api/books/genres");
      return response.data;
    } catch (error: any) {
      const message = getErrorMessage(error) || "Failed to fetch genres";
      console.error("Error fetching genres:", error);
      throw new Error(message);
    }
  }

/**
 * Fetches all available author names.
 */
  async getAuthors(): Promise<string[]> {
    try {
      const response = await this.bookApi.get<string[]>("/api/books/authors");
      return response.data;
    } catch (error: any) {
      const message = getErrorMessage(error) || "Failed to fetch authors";
      console.error("Error fetching authors:", error);
      throw new Error(message);
    }
  }

/**
 * Fetches all available language codes/names.
 */
  async getLanguages(): Promise<string[]> {
    try {
      const response = await this.bookApi.get<string[]>("/api/books/languages");
      return response.data;
    } catch (error: any) {
      const message = getErrorMessage(error) || "Failed to fetch languages";
      console.error("Error fetching languages:", error);
      throw new Error(message);
    }
  }
}

// Export singleton instance
export const bookService = new BookServiceClient();
