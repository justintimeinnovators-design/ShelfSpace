/**
 * Library domain service.
 *
 * Purpose:
 * - Encapsulate all library-related API calls and data transformations.
 * - Keep UI components free from transport concerns (URLs, payload shape, error mapping).
 * - Provide a stable, typed surface for library operations.
 *
 * Error model:
 * - Validation/client issues map to `ValidationError`.
 * - Missing entities map to `NotFoundError`.
 * - Conflict scenarios map to `ConflictError`.
 * - Other request failures map to `ServiceError`.
 */
import { Book, BookInput } from "@/types/book";
import { ReadingList as BaseReadingList, ReadingListInput } from "../../types/library";
import { ID } from "@/types/common";
import {
  ServiceResponse,
  PaginatedResponse,
  GetBooksParams,
  GetReadingListsParams,
  UpdateBookParams,
  CreateReadingListParams,
  UpdateReadingListParams,
  DeleteReadingListParams,
  MoveBooksParams,
  ServiceError,
  ValidationError,
  NotFoundError,
  ConflictError,
} from "./types";
import { bookService } from "@/lib/book-service";
import api, { createApiClient } from "@/lib/api";
import { getErrorMessage } from "@/lib/api-utils";

// ReadingList type that uses the correct Book type
type ReadingList = Omit<BaseReadingList, 'books'> & {
  books?: Book[];
};

// Library service API client
const LIBRARY_SERVICE_BASE_URL =
  process.env["NEXT_PUBLIC_LIBRARY_SERVICE_URL"] ||
  (process.env["NEXT_PUBLIC_API_URL"]
    ? `${process.env["NEXT_PUBLIC_API_URL"]}/api/library`
    : "http://localhost:3003");

const libraryApi = createApiClient(LIBRARY_SERVICE_BASE_URL);

const READING_LISTS_PATH = "/reading-lists";

/**
 * Stateful service wrapper for library operations.
 *
 * Most methods return `ServiceResponse<T>` wrappers so calling layers can rely on
 * consistent response metadata (`success`, `timestamp`) regardless of endpoint.
 */
export class LibraryService {
  private baseUrl: string;

  constructor(baseUrl = "/api", _timeout = 5000) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetches all reading lists for the active user.
   *
   * @param params Query options (including optional in-memory book expansion).
   * @returns Reading lists, optionally with resolved `books[]`.
   * @throws ServiceError When list retrieval fails.
   */
  async getReadingLists(
    params: GetReadingListsParams = {}
  ): Promise<ServiceResponse<ReadingList[]>> {
    try {
      // Keep query construction explicit to avoid malformed path strings.
      const url = `${READING_LISTS_PATH}${params.includeBooks ? "?includeBooks=true" : ""}`;
      const response = await libraryApi.get<ReadingList[]>(url);

      // Optionally include books in the response
      if (params.includeBooks && response.data) {
        try {
/**
 * Fetch List Books.
 * @param list - list value.
 */
          const fetchListBooks = async (list: ReadingList) => {
            const books = await Promise.all(
              list.bookIds.map((id) => bookService.getBookById(String(id)))
            );
            return books;
          };
          const listBooks = await Promise.all(response.data.map(fetchListBooks));
          // Attach resolved books back to each list while preserving list order.
          response.data.forEach((list, index) => {
            list.books = listBooks[index] || [];
          });
        } catch (err) {
          console.warn("Failed to fetch books for reading lists:", err);
          response.data.forEach((list) => {
            list.books = [];
          });
        }
      }

      return {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new ServiceError(
        getErrorMessage(error) || "Failed to fetch reading lists",
        "FETCH_READING_LISTS_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Fetches one reading list by id.
   *
   * @param id Reading list id.
   * @param includeBooks Whether to resolve `bookIds` into concrete book objects.
   * @throws NotFoundError When the list does not exist.
   * @throws ServiceError On transport/backend errors.
   */
  async getReadingList(
    id: ID,
    includeBooks = false
  ): Promise<ServiceResponse<ReadingList>> {
    try {
      const url = `${READING_LISTS_PATH}/${id}${includeBooks ? "?includeBooks=true" : ""}`;
      const response = await libraryApi.get<ReadingList>(url);

      if (includeBooks && response.data) {
        try {
          const books = await Promise.all(
            response.data.bookIds.map((bookId) => bookService.getBookById(String(bookId)))
          );
          response.data.books = books;
        } catch {
          response.data.books = [];
        }
      }

      return {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError("Reading list", id);
      }
      throw new ServiceError(
        getErrorMessage(error) || `Failed to fetch reading list with id ${id}`,
        "FETCH_READING_LIST_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Fetches books with optional list scoping, searching, and filter/sort post-processing.
   *
   * Notes:
   * - If `listId` is provided, list membership filtering is applied.
   * - Search can be delegated to backend search endpoint.
   * - Additional filters can be applied client-side for consistency across endpoints.
   */
  async getBooks(
    params: GetBooksParams = {}
  ): Promise<PaginatedResponse<Book>> {
    try {
      let booksResponse;

      // If filtering by listId, get books from reading list first
      if (params.listId) {
        // List-filter flow: resolve list IDs first, then intersect with books payload.
        const listsResponse = await this.getReadingLists({ includeBooks: false });
        const targetList = listsResponse.data.find(
          (list) => list.id === params.listId
        );
        if (targetList && targetList.bookIds.length > 0) {
          // Current API lacks a dedicated batch-by-ids endpoint, so we fetch then filter.
          booksResponse = await bookService.getBooks({
            page: params.page || 1,
            limit: params.limit || 20,
            sortBy: params.filter?.sortOrder === "desc" ? "desc" : "asc",
          });
          // Filter to only books in the list
          booksResponse.data = booksResponse.data.filter((book) =>
            targetList.bookIds.includes(book.id)
          );
        } else {
          // Empty list
          return {
            data: [],
            pagination: {
              page: params.page || 1,
              limit: params.limit || 20,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
            success: true,
            timestamp: new Date().toISOString(),
          };
        }
      } else if (params.filter?.search) {
        // Search endpoint usually yields better relevance than client-side search.
        booksResponse = await bookService.searchBooks(
          params.filter.search,
          params.page || 1
        );
      } else {
        // Get all books with filters
        const getBooksParams: any = {
          page: params.page || 1,
          limit: params.limit || 20,
          sortBy: params.filter?.sortOrder === "desc" ? "desc" : "asc",
        };
        
        // Keep optional request fields sparse to avoid accidental backend filters.
        if (params.filter?.author) {
          getBooksParams.author = params.filter.author;
        }
        if (params.filter?.search) {
          getBooksParams.search = params.filter.search;
        }
        
        booksResponse = await bookService.getBooks(getBooksParams);
      }

      // Apply additional client-side filters if needed
      // Client-side filters are a final normalization layer for UX consistency.
      let filteredBooks = booksResponse.data;
      if (params.filter) {
        filteredBooks = this.applyBookFilters(filteredBooks, params.filter);
      }

      return {
        data: filteredBooks,
        pagination: booksResponse.pagination,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new ServiceError(
        "Failed to fetch books",
        "FETCH_BOOKS_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Fetches a single book by id.
   *
   * @param id Book identifier.
   * @throws NotFoundError When book is missing.
   */
  async getBook(id: ID): Promise<ServiceResponse<Book>> {
    try {
      const book = await bookService.getBookById(String(id));

      return {
        data: book,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError("Book", id);
      }
      throw new ServiceError(
        `Failed to fetch book with id ${id}`,
        "FETCH_BOOK_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Creates a new book entity.
   *
   * @param bookInput Frontend book payload.
   * @returns Normalized frontend book object created from backend response.
   */
  async createBook(bookInput: BookInput): Promise<ServiceResponse<Book>> {
    try {
      // Validate required fields
      this.validateBookInput(bookInput);

      // Transform to backend format
      // Normalize frontend field names to backend schema contract.
      const backendBook = {
        title: bookInput.title,
        authors: [{ name: bookInput.author }],
        description: bookInput.description,
        genres: bookInput.genres || [],
        isbn13: bookInput.isbn,
        num_pages: bookInput.pages,
        publication_year: bookInput.publishedYear?.toString(),
        language_code: bookInput.language,
        image_url: bookInput.coverImage || bookInput.cover,
      };

      const response = await api.post(`${this.baseUrl}/books`, backendBook);
      const book = response.data;

      // Transform back to frontend format
      // Preserve frontend-facing shape so components never consume raw backend objects.
      const frontendBook: Book = {
        id: book.book_id || book._id,
        title: bookInput.title,
        author: book.authors?.[0]?.name || bookInput.author || "Unknown",
        genres: bookInput.genres || [],
        tags: bookInput.tags || [],
        status: "want-to-read",
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        addedAt: new Date().toISOString(),
        ...(bookInput.description && { description: bookInput.description }),
        ...(bookInput.coverImage || bookInput.cover ? { coverImage: bookInput.coverImage || bookInput.cover } : {}),
        ...(bookInput.isbn && { isbn: bookInput.isbn }),
        ...(bookInput.pages && { pages: bookInput.pages }),
        ...(bookInput.publishedYear && { publishedYear: bookInput.publishedYear }),
        ...(bookInput.language && { language: bookInput.language }),
        ...(bookInput.rating && { rating: bookInput.rating }),
      };

      return {
        data: frontendBook,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ServiceError(
        getErrorMessage(error) || "Failed to create book",
        "CREATE_BOOK_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Updates an existing book.
   *
   * @param params Book id plus partial updates.
   * @returns Latest backend book state after update.
   */
  async updateBook(params: UpdateBookParams): Promise<ServiceResponse<Book>> {
    try {
      // Get existing book
      const existingBookResponse = await this.getBook(params.id);
      const existingBook = existingBookResponse.data;

      // Validate updates
      if (
        params.updates.title !== undefined ||
        params.updates.author !== undefined
      ) {
        this.validateBookInput({
          title: params.updates.title || existingBook.title,
          author: params.updates.author || existingBook.author,
        });
      }

      // Transform updates to backend shape where needed
      const backendBook = {
        title: params.updates.title ?? existingBook.title,
        authors: [{ name: params.updates.author ?? existingBook.author }],
        description: params.updates.description ?? existingBook.description,
        genres: params.updates.genres ?? existingBook.genres,
        isbn13: params.updates.isbn ?? existingBook.isbn,
        num_pages: params.updates.pages ?? existingBook.pages,
        publication_year: params.updates.publishedYear?.toString(),
        language_code: params.updates.language ?? existingBook.language,
        image_url: params.updates.coverImage ?? params.updates.cover ?? existingBook.coverImage ?? existingBook.cover,
      };

      await api.put(`/books/${params.id}`, backendBook);
      const updatedBook = await bookService.getBookById(String(params.id));

      return {
        data: updatedBook,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new ServiceError(
        getErrorMessage(error) || `Failed to update book with id ${params.id}`,
        "UPDATE_BOOK_ERROR",
        500,
        error
      );
    }
  }

  /**
   * Deletes a book.
   *
   * @param id Book id.
   */
  async deleteBook(id: ID): Promise<ServiceResponse<void>> {
    try {
      // Check if book exists
      await this.getBook(id);

      await api.delete(`/books/${id}`);

      return {
        data: undefined,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new ServiceError(
        getErrorMessage(error) || `Failed to delete book with id ${id}`,
        "DELETE_BOOK_ERROR",
        500,
        error
      );
    }
  }

  /**
   * Creates a reading list.
   *
   * @param params Reading list input payload.
   * @throws ConflictError If a duplicate list name exists.
   */
  async createReadingList(
    params: CreateReadingListParams
  ): Promise<ServiceResponse<ReadingList>> {
    try {
      // Validate required fields
      this.validateReadingListInput(params.list);

      const response = await libraryApi.post<ReadingList>(READING_LISTS_PATH, params.list);

      return {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error.response?.status === 409) {
        throw new ConflictError("A reading list with this name already exists");
      }
      throw new ServiceError(
        getErrorMessage(error) || "Failed to create reading list",
        "CREATE_READING_LIST_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Updates a reading list.
   *
   * @param params Reading list id + partial update payload.
   */
  async updateReadingList(
    params: UpdateReadingListParams
  ): Promise<ServiceResponse<ReadingList>> {
    try {
      // Validate updates
      if (params.updates.name) {
        this.validateReadingListInput({ name: params.updates.name });
      }

      const response = await libraryApi.put<ReadingList>(
        `${READING_LISTS_PATH}/${params.id}`,
        params.updates
      );

      return {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error.response?.status === 404) {
        throw new NotFoundError("Reading list", params.id);
      }
      if (error.response?.status === 409) {
        throw new ConflictError("A reading list with this name already exists");
      }
      throw new ServiceError(
        getErrorMessage(error) || `Failed to update reading list with id ${params.id}`,
        "UPDATE_READING_LIST_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Deletes a reading list.
   *
   * @param params Delete payload containing list id.
   */
  async deleteReadingList(
    params: DeleteReadingListParams
  ): Promise<ServiceResponse<void>> {
    try {
      await libraryApi.delete(`${READING_LISTS_PATH}/${params.id}`);

      return {
        data: undefined,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError("Reading list", params.id);
      }
      if (error.response?.status === 400) {
        throw new ValidationError("Cannot delete default reading lists");
      }
      throw new ServiceError(
        getErrorMessage(error) || `Failed to delete reading list with id ${params.id}`,
        "DELETE_READING_LIST_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Moves books from one list to another.
   *
   * @param params Move payload with source/target list context and book ids.
   */
  async moveBooks(params: MoveBooksParams): Promise<ServiceResponse<void>> {
    try {
      // Extract source list ID from params (assuming it's in the URL path)
      // The API expects: POST /reading-lists/:id/move-books
      // Fallback to targetListId keeps backward compatibility with older caller shape.
      const sourceListId = (params as any).sourceListId || params.targetListId;
      
      await libraryApi.post(`${READING_LISTS_PATH}/${sourceListId}/move-books`, {
        bookIds: params.bookIds,
        targetListId: params.targetListId,
      });

      return {
        data: undefined,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError("Reading list", params.targetListId);
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ServiceError(
        getErrorMessage(error) || "Failed to move books",
        "MOVE_BOOKS_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Adds books to an existing reading list.
   *
   * @param id Target list id.
   * @param bookIds Book ids to append.
   */
  async addBooksToReadingList(id: ID, bookIds: string[]): Promise<ServiceResponse<ReadingList>> {
    try {
      const response = await libraryApi.post<ReadingList>(`${READING_LISTS_PATH}/${id}/books`, {
        bookIds,
      });
      return {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new ServiceError(
        getErrorMessage(error) || "Failed to add books",
        "ADD_BOOKS_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Removes books from a reading list.
   *
   * @param id Target list id.
   * @param bookIds Book ids to remove.
   */
  async removeBooksFromReadingList(id: ID, bookIds: string[]): Promise<ServiceResponse<void>> {
    try {
      await libraryApi.delete(`${READING_LISTS_PATH}/${id}/books`, { data: { bookIds } });
      return {
        data: undefined,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new ServiceError(
        getErrorMessage(error) || "Failed to remove books",
        "REMOVE_BOOKS_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  /**
   * Triggers backend initialization of default lists for a user.
   */
  async initializeDefaults(): Promise<ServiceResponse<any>> {
    try {
      const response = await libraryApi.post(`${READING_LISTS_PATH}/initialize-defaults`, {});
      return {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new ServiceError(
        getErrorMessage(error) || "Failed to initialize defaults",
        "INIT_DEFAULTS_ERROR",
        error.response?.status || 500,
        error
      );
    }
  }

  // Private helper methods

  /**
   * Validates minimal book input constraints used by create/update flows.
   */
  private validateBookInput(input: Partial<BookInput>): void {
    const errors: string[] = [];
    if (!input.title || input.title.trim().length === 0) {
      errors.push("Title is required");
    }
    if (!input.author || input.author.trim().length === 0) {
      errors.push("Author is required");
    }
    if (errors.length > 0) {
      throw new ValidationError(errors.join(", "));
    }
  }

  /**
   * Validates reading list payload constraints before request dispatch.
   */
  private validateReadingListInput(input: Partial<ReadingListInput>): void {
    const errors: string[] = [];
    if (input.name && input.name.trim().length === 0) {
      errors.push("Name cannot be empty");
    }
    if (input.name && input.name.length > 100) {
      errors.push("Name must be less than 100 characters");
    }
    if (errors.length > 0) {
      throw new ValidationError(errors.join(", "));
    }
  }

  /**
   * Applies in-memory search/filter/sort to a book collection.
   *
   * @param books Source book list.
   * @param filter Filter/sort descriptor.
   * @returns Transformed list matching requested constraints.
   */
  private applyBookFilters(books: Book[], filter: any): Book[] {
    // Filtering/sorting happens in-memory to support cross-service composite views.
    let filtered = books;

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      );
    }

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter((book) => filter.status.includes(book.status));
    }

    if (filter.genres && filter.genres.length > 0) {
      filtered = filtered.filter((book) =>
        book.genres.some((genre) => filter.genres.includes(genre))
      );
    }

    if (filter.rating) {
      filtered = filtered.filter(
        (book) => book.rating && book.rating >= filter.rating
      );
    }

    // Apply sorting
    if (filter.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (filter.sortBy) {
          case "title":
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case "author":
            aValue = a.author.toLowerCase();
            bValue = b.author.toLowerCase();
            break;
          case "rating":
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case "dateAdded":
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return filter.sortOrder === "desc" ? 1 : -1;
        if (aValue > bValue) return filter.sortOrder === "desc" ? -1 : 1;
        return 0;
      });
    }

    return filtered;
  }
}

// Export singleton instance
export const libraryService = new LibraryService();
