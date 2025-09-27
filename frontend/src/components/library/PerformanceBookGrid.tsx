"use client";

import React, { useState, useMemo } from "react";
import { VirtualGrid, VirtualList } from "@/hooks/useVirtualization";
import { useDebounce } from "@/hooks/useDebounce";
import { OptimizedImage } from "@/components/ui";
import { BookOpen, Star, Clock, MoreVertical } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  pages?: number;
  genre?: string;
  status?: "read" | "reading" | "want-to-read";
  progress?: number;
  addedDate?: string;
}

interface PerformanceBookGridProps {
  books: Book[];
  onBookSelect?: (book: Book) => void;
  onBookAction?: (book: Book, action: string) => void;
  className?: string;
  itemWidth?: number;
  itemHeight?: number;
  containerHeight?: number;
}

export function PerformanceBookGrid({
  books,
  onBookSelect,
  onBookAction,
  className = "",
  itemWidth = 200,
  itemHeight = 300,
  containerHeight = 600
}: PerformanceBookGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<"title" | "author" | "rating" | "date">("title");

  // Debounced search
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let filtered = books;

    // Filter by search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre?.toLowerCase().includes(query)
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "date":
          return new Date(b.addedDate || 0).getTime() - new Date(a.addedDate || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [books, debouncedSearchQuery, selectedGenre, sortBy]);

  // Get unique genres
  const genres = useMemo(() => {
    const genreSet = new Set(books.map(book => book.genre).filter(Boolean));
    return Array.from(genreSet).sort();
  }, [books]);

  // Render individual book item
  const renderBookItem = (book: Book, index: number) => (
    <div
      key={book.id}
      className="group relative bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={() => onBookSelect?.(book)}
    >
      {/* Book Cover */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <OptimizedImage
          src={book.cover || "/placeholder-book.jpg"}
          alt={book.title}
          width={itemWidth}
          height={itemHeight * 0.7}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            </div>
          }
        />
        
        {/* Status Badge */}
        {book.status && (
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                book.status === "read"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : book.status === "reading"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              }`}
            >
              {book.status === "read" ? "Read" : book.status === "reading" ? "Reading" : "Want to Read"}
            </span>
          </div>
        )}

        {/* Progress Bar */}
        {book.progress && book.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${book.progress}%` }}
            />
          </div>
        )}

        {/* Action Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookAction?.(book, "menu");
            }}
            className="p-1 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-slate-100 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {book.title}
        </h3>
        
        <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-1">
          by {book.author}
        </p>

        {/* Rating */}
        {book.rating && (
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 dark:text-slate-400">
              {book.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Genre */}
        {book.genre && (
          <span className="inline-block px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full">
            {book.genre}
          </span>
        )}

        {/* Pages */}
        {book.pages && (
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{book.pages} pages</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Genre Filter */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="rating">Sort by Rating</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-slate-400">
        {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
      </div>

      {/* Virtual Grid */}
      <VirtualGrid
        items={filteredBooks}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        containerWidth={800}
        containerHeight={containerHeight}
        renderItem={renderBookItem}
        className="border border-gray-200 dark:border-slate-600 rounded-lg"
      />
    </div>
  );
}

// Performance-optimized book list
interface PerformanceBookListProps {
  books: Book[];
  onBookSelect?: (book: Book) => void;
  onBookAction?: (book: Book, action: string) => void;
  className?: string;
  itemHeight?: number;
  containerHeight?: number;
}

export function PerformanceBookList({
  books,
  onBookSelect,
  onBookAction,
  className = "",
  itemHeight = 120,
  containerHeight = 600
}: PerformanceBookListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter books
  const filteredBooks = useMemo(() => {
    if (!debouncedSearchQuery) return books;
    
    const query = debouncedSearchQuery.toLowerCase();
    return books.filter(
      book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre?.toLowerCase().includes(query)
    );
  }, [books, debouncedSearchQuery]);

  // Render book list item
  const renderBookItem = (book: Book, index: number) => (
    <div
      key={book.id}
      className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer border-b border-gray-200 dark:border-slate-600 last:border-b-0"
      onClick={() => onBookSelect?.(book)}
    >
      {/* Book Cover */}
      <div className="flex-shrink-0 w-16 h-20 overflow-hidden rounded-lg">
        <OptimizedImage
          src={book.cover || "/placeholder-book.jpg"}
          alt={book.title}
          width={64}
          height={80}
          className="w-full h-full object-cover"
          loading="lazy"
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          }
        />
      </div>

      {/* Book Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 truncate">
          by {book.author}
        </p>
        {book.genre && (
          <span className="inline-block mt-1 px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full">
            {book.genre}
          </span>
        )}
      </div>

      {/* Rating */}
      {book.rating && (
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600 dark:text-slate-400">
            {book.rating.toFixed(1)}
          </span>
        </div>
      )}

      {/* Status */}
      {book.status && (
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            book.status === "read"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : book.status === "reading"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {book.status === "read" ? "Read" : book.status === "reading" ? "Reading" : "Want to Read"}
        </span>
      )}

      {/* Action Menu */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBookAction?.(book, "menu");
        }}
        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-slate-400">
        {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
      </div>

      {/* Virtual List */}
      <VirtualList
        items={filteredBooks}
        itemHeight={itemHeight}
        containerHeight={containerHeight}
        renderItem={renderBookItem}
        className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden"
      />
    </div>
  );
}
