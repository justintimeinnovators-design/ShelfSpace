
export interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  readingProgress?: number;
  timeToRead?: string;
  genre?: string;
  isCurrentlyReading?: boolean;
  isRead?: boolean;
  isWishlist?: boolean;
  dateAdded?: string;
  lastRead?: string;
  pages?: number;
  isbn?: string;
}

export interface ReadingList {
  id: string;
  name: string;
  description: string;
  bookCount: number;
  isDefault?: boolean;
  color?: string;
  icon: React.ComponentType<{ className?: string }>;
  books: Book[];
}
