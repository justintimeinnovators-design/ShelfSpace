"use client";

import React from "react";
import { memo } from "react";
import { Star, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { Book } from "@/types/book";

interface BookInfoProps {
  book: Book;
  sizeConfig: {
    title: string;
    author: string;
  };
  statusColor: string;
  formattedStatus: string;
  showProgress?: boolean;
  showRating?: boolean;
  showGenre?: boolean;
  showPages?: boolean;
  showLastRead?: boolean;
  className?: string;
}

export const BookInfo: React.FC<BookInfoProps> = memo(({
  book,
  sizeConfig,
  statusColor,
  formattedStatus,
  showProgress = true,
  showRating = true,
  showGenre = true,
  showPages = true,
  showLastRead = true,
  className,
}) => {
  return (
    <div className={cn("flex-1 min-w-0", className)}>
      <h4
        className={cn(
          "font-semibold text-gray-900 dark:text-white",
          sizeConfig.title
        )}
      >
        {book.title}
      </h4>
      <p
        className={cn(
          "text-gray-500 dark:text-gray-400 mt-1",
          sizeConfig.author
        )}
      >
        {book.author}
      </p>

      <div className="flex items-center space-x-4 mt-2">
        {showGenre && book.genres?.[0] && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {book.genres[0]}
          </span>
        )}
        {showPages && book.pages && (
          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            {book.pages} pages
          </span>
        )}
        {showRating && book.rating && (
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {book.rating}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <Badge className={statusColor} size="xs">
          {formattedStatus}
        </Badge>
        {showLastRead && book.lastReadAt && (
          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Last read {new Date(book.lastReadAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {showProgress &&
        book.readingProgress !== undefined &&
        book.status === "currently-reading" && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Reading Progress</span>
              <span>{book.readingProgress}%</span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${book.readingProgress}%` }}
              />
            </div>
          </div>
        )}
    </div>
  );
});

BookInfo.displayName = "BookInfo";
