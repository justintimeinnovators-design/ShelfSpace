import { Book, BookInput, BookStatus } from "../../../types/book";
import { ReadingList, ReadingListInput } from "../../../types/library";
import {
  BookDetail,
  SimilarBookItem,
  DiscussionThread,
  UserReview,
} from "../../../types/models";
import { ID } from "../../../types/common";

// Mock data for testing
export const mockBookDetails: BookDetail = {
  id: 1,
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  cover: "/book-covers/great-gatsby.jpg",
  description: "A classic American novel about the Jazz Age.",
  rating: 4.2,
  ratingsCount: 1250,
  genres: ["Classic Literature", "Fiction"],
};

export const mockSimilarBooks: SimilarBookItem[] = [
  {
    id: 2,
    title: "The Sun Also Rises",
    author: "Ernest Hemingway",
    cover: "/book-covers/sun-also-rises.jpg",
  },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/book-covers/mockingbird.jpg",
  },
];

export const mockDiscussions: DiscussionThread[] = [
  {
    id: 1,
    title: "The symbolism of the green light",
    replies: 5,
  },
];

export const mockReviews: UserReview[] = [
  {
    id: 1,
    user: "BookLover123",
    rating: 5,
    text: "This book captures the essence of the Jazz Age perfectly.",
    createdAt: "2024-01-05T00:00:00Z",
  },
];

export const mockReadingLists = [
  {
    id: "1",
    name: "Classic Literature",
    description: "Timeless classics",
    books: [],
    isPublic: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

/**
 * Generate Mock Books.
 * @param count - count value.
 */
export const generateMockBooks = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `book-${i + 1}`,
    title: `Book ${i + 1}`,
    author: `Author ${i + 1}`,
    cover: `/book-covers/book-${i + 1}.jpg`,
    rating: 4.0 + Math.random(),
    status: "want-to-read",
    pages: 200 + Math.floor(Math.random() * 300),
  }));
};

// API Response transformation utilities
export class DataTransformer {
  // Transform API book response to internal Book interface
/**
 * Transform Api Book To Book.
 * @param apiBook - api Book value.
 * @returns Book.
 */
  static transformApiBookToBook(apiBook: any): Book {
    return {
      id: apiBook.id?.toString() || "",
      title: apiBook.title || "",
      author: apiBook.author || "",
      isbn: apiBook.isbn,
      cover: apiBook.cover || "/book-covers/default.jpg",
      description: apiBook.description,
      pages: apiBook.pages,
      publishedDate: apiBook.published_date || apiBook.publishedDate,
      publisher: apiBook.publisher,
      language: apiBook.language || "en",
      genres: Array.isArray(apiBook.genres) ? apiBook.genres : [],
      tags: Array.isArray(apiBook.tags) ? apiBook.tags : [],
      status: apiBook.status || "want-to-read",
      format: apiBook.format || "physical",
      rating: apiBook.rating,
      personalNotes: apiBook.personal_notes || apiBook.personalNotes,
      readingProgress: apiBook.reading_progress || apiBook.readingProgress || 0,
      startedAt: apiBook.started_at || apiBook.startedAt,
      finishedAt: apiBook.finished_at || apiBook.finishedAt,
      lastReadAt: apiBook.last_read_at || apiBook.lastReadAt,
      averageRating: apiBook.average_rating || apiBook.averageRating,
      ratingsCount: apiBook.ratings_count || apiBook.ratingsCount || 0,
      isPublic: apiBook.is_public ?? apiBook.isPublic ?? true,
      isFavorite: apiBook.is_favorite ?? apiBook.isFavorite ?? false,
      createdAt:
        apiBook.created_at || apiBook.createdAt || new Date().toISOString(),
      updatedAt:
        apiBook.updated_at || apiBook.updatedAt || new Date().toISOString(),
    };
  }

  // Transform internal Book to API format
/**
 * Transform Book To Api Format.
 * @param book - book value.
 * @returns any.
 */
  static transformBookToApiFormat(book: Book): any {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      cover: book.cover,
      description: book.description,
      pages: book.pages,
      published_date: book.publishedDate,
      publisher: book.publisher,
      language: book.language,
      genres: book.genres,
      tags: book.tags,
      status: book.status,
      format: book.format,
      rating: book.rating,
      personal_notes: book.personalNotes,
      reading_progress: book.readingProgress,
      started_at: book.startedAt,
      finished_at: book.finishedAt,
      last_read_at: book.lastReadAt,
      average_rating: book.averageRating,
      ratings_count: book.ratingsCount,
      is_public: book.isPublic,
      is_favorite: book.isFavorite,
      created_at: book.createdAt,
      updated_at: book.updatedAt,
    };
  }

  // Transform BookInput to Book (for creation)
/**
 * Transform Book Input To Book.
 * @param input - input value.
 * @param id - id value.
 * @returns Book.
 */
  static transformBookInputToBook(input: BookInput, id: ID): Book {
    const now = new Date().toISOString();

    const book: Book = {
      id,
      title: input.title,
      author: input.author,
      cover: input.cover || "/book-covers/default.jpg",
      genres: input.genres || [],
      tags: input.tags || [],
      status: input.status || "want-to-read",
      format: input.format || "physical",
      readingProgress: input.readingProgress || 0,
      isPublic: input.isPublic ?? true,
      isFavorite: input.isFavorite ?? false,
      ratingsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    // Only add optional properties if they have values
    if (input.isbn) book.isbn = input.isbn;
    if (input.description) book.description = input.description;
    if (input.pages) book.pages = input.pages;
    if (input.publishedDate) book.publishedDate = input.publishedDate;
    if (input.publisher) book.publisher = input.publisher;
    if (input.language) book.language = input.language;
    if (input.rating) book.rating = input.rating;
    if (input.personalNotes) book.personalNotes = input.personalNotes;
    
    if (input.status === "currently-reading") {
      book.startedAt = now;
      book.lastReadAt = now;
    }
    
    if (input.status === "read") {
      book.finishedAt = now;
    }

    return book;
  }

  // Transform API reading list response to internal ReadingList interface
/**
 * Transform Api Reading List To Reading List.
 * @param apiList - api List value.
 * @returns ReadingList.
 */
  static transformApiReadingListToReadingList(apiList: any): ReadingList {
    return {
      id: apiList.id?.toString() || "",
      name: apiList.name || "",
      description: apiList.description,
      color: apiList.color || "#3B82F6",
      icon: apiList.icon || "BookOpen",
      isDefault: apiList.is_default ?? apiList.isDefault ?? false,
      isPublic: apiList.is_public ?? apiList.isPublic ?? false,
      userId: apiList.user_id || apiList.userId || "",
      bookIds: Array.isArray(apiList.book_ids || apiList.bookIds)
        ? (apiList.book_ids || apiList.bookIds).map((id: any) => id.toString())
        : [],
      books: apiList.books
        ? apiList.books.map(this.transformApiBookToBook)
        : undefined,
      bookCount: apiList.book_count ?? apiList.bookCount ?? 0,
      sortOrder: apiList.sort_order ?? apiList.sortOrder ?? 0,
      createdAt:
        apiList.created_at || apiList.createdAt || new Date().toISOString(),
      updatedAt:
        apiList.updated_at || apiList.updatedAt || new Date().toISOString(),
    };
  }

  // Transform internal ReadingList to API format
/**
 * Transform Reading List To Api Format.
 * @param list - list value.
 * @returns any.
 */
  static transformReadingListToApiFormat(list: ReadingList): any {
    return {
      id: list.id,
      name: list.name,
      description: list.description,
      color: list.color,
      icon: list.icon,
      is_default: list.isDefault,
      is_public: list.isPublic,
      user_id: list.userId,
      book_ids: list.bookIds,
      book_count: list.bookCount,
      sort_order: list.sortOrder,
      created_at: list.createdAt,
      updated_at: list.updatedAt,
    };
  }

  // Transform ReadingListInput to ReadingList (for creation)
/**
 * Transform Reading List Input To Reading List.
 * @param input - input value.
 * @param id - id value.
 * @param userId - user Id value.
 * @returns ReadingList.
 */
  static transformReadingListInputToReadingList(
    input: ReadingListInput,
    id: ID,
    userId: ID
  ): ReadingList {
    const now = new Date().toISOString();
    
    // Import BookOpen as default icon
    const { BookOpen } = require("lucide-react");

    const list: ReadingList = {
      id,
      name: input.name,
      color: input.color || "#3B82F6",
      icon: input.icon || BookOpen,
      isDefault: false,
      isPublic: input.isPublic ?? false,
      userId,
      bookIds: input.bookIds || [],
      bookCount: input.bookIds?.length || 0,
      sortOrder: 0, // Will be set by service
      createdAt: now,
      updatedAt: now,
    };

    // Only add description if it has a value
    if (input.description) {
      list.description = input.description;
    }

    return list;
  }

  // Transform legacy BookDetail to new Book interface
/**
 * Transform Legacy Book Detail To Book.
 * @param bookDetail - book Detail value.
 * @param status - status value.
 * @param progress - progress value.
 * @returns Book.
 */
  static transformLegacyBookDetailToBook(
    bookDetail: BookDetail,
    status: BookStatus = "want-to-read",
    progress: number = 0
  ): Book {
    const now = new Date().toISOString();

    const book: Book = {
      id: bookDetail.id.toString(),
      title: bookDetail.title,
      author: bookDetail.author,
      cover: bookDetail.cover,
      genres: bookDetail.genres.map(this.transformGenreString) as any[],
      tags: [],
      status,
      format: "physical",
      readingProgress: progress,
      isPublic: true,
      isFavorite: false,
      ratingsCount: bookDetail.ratingsCount,
      createdAt: now,
      updatedAt: now,
    };

    // Add optional properties only if they have values
    if (bookDetail.description) {
      book.description = bookDetail.description;
    }
    
    if (bookDetail.rating) {
      book.averageRating = bookDetail.rating;
    }

    if (status === "currently-reading") {
      book.startedAt = now;
      book.lastReadAt = now;
    }

    if (status === "read") {
      book.finishedAt = now;
    }

    return book;
  }

  // Transform genre strings to standardized format
/**
 * Transform Genre String.
 * @param genre - genre value.
 * @returns string.
 */
  private static transformGenreString(genre: string): string {
    const genreMap: Record<string, string> = {
      Classic: "fiction",
      Fiction: "fiction",
      Literature: "fiction",
      Dystopian: "sci-fi",
      "Science Fiction": "sci-fi",
      Political: "politics",
      Historical: "history",
      "Coming of Age": "fiction",
      "Self-Help": "self-help",
      Productivity: "self-help",
      Psychology: "science",
      Business: "business",
      Design: "art",
      Technology: "technology",
      Fantasy: "fantasy",
      Adventure: "fiction",
      Magic: "fantasy",
      Space: "sci-fi",
      History: "history",
      Anthropology: "science",
      Philosophy: "philosophy",
      Memoir: "memoir",
      Biography: "biography",
      Education: "self-help",
      Entrepreneurship: "business",
      Management: "business",
    };

    return genreMap[genre] || genre.toLowerCase().replace(/\s+/g, "-");
  }

  // Batch transformation utilities
/**
 * Transform Api Book Array To Books.
 * @param apiBooks - api Books value.
 * @returns Book[].
 */
  static transformApiBookArrayToBooks(apiBooks: any[]): Book[] {
    return apiBooks.map(this.transformApiBookToBook);
  }

/**
 * Transform Api Reading List Array To Reading Lists.
 * @param apiLists - api Lists value.
 * @returns ReadingList[].
 */
  static transformApiReadingListArrayToReadingLists(
    apiLists: any[]
  ): ReadingList[] {
    return apiLists.map(this.transformApiReadingListToReadingList);
  }

  // Validation utilities
/**
 * Validate Book Data.
 * @param book - book value.
 * @returns string[].
 */
  static validateBookData(book: Partial<Book>): string[] {
    const errors: string[] = [];

    if (!book.title || book.title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (!book.author || book.author.trim().length === 0) {
      errors.push("Author is required");
    }

    if (book.rating !== undefined && (book.rating < 1 || book.rating > 5)) {
      errors.push("Rating must be between 1 and 5");
    }

    if (
      book.readingProgress !== undefined &&
      (book.readingProgress < 0 || book.readingProgress > 100)
    ) {
      errors.push("Reading progress must be between 0 and 100");
    }

    return errors;
  }

/**
 * Validate Reading List Data.
 * @param list - list value.
 * @returns string[].
 */
  static validateReadingListData(list: Partial<ReadingList>): string[] {
    const errors: string[] = [];

    if (!list.name || list.name.trim().length === 0) {
      errors.push("Name is required");
    }

    if (list.name && list.name.trim().length > 100) {
      errors.push("Name must be less than 100 characters");
    }

    return errors;
  }

  // Utility for handling different date formats
/**
 * Normalize Date.
 * @param date - date value.
 * @returns string | undefined.
 */
  static normalizeDate(date: string | Date | undefined): string | undefined {
    if (!date) return undefined;

    try {
      return new Date(date).toISOString();
    } catch {
      return undefined;
    }
  }

  // Utility for handling different ID formats
/**
 * Normalize Id.
 * @param id - id value.
 * @returns string.
 */
  static normalizeId(id: string | number): string {
    return id.toString();
  }
}
