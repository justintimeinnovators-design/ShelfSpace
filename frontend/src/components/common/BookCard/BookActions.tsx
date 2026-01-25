"use client";

import React from "react";
import { memo } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Book } from "@/types/book";
import { BookCardActions } from "@/hooks/useBookCard";
import { cn } from "@/utils/cn";

interface BookActionsProps {
  book: Book;
  actions?: BookCardActions | undefined;
  variant?: "horizontal" | "vertical" | undefined;
  showViewButton?: boolean | undefined;
  showMoreButton?: boolean | undefined;
  className?: string | undefined;
}

export const BookActions: React.FC<BookActionsProps> = memo(({
  book,
  actions,
  variant = "horizontal",
  showViewButton = true,
  showMoreButton = true,
  className,
}) => {
  if (!actions || (!showViewButton && !showMoreButton)) {
    return null;
  }

  const containerClass = variant === "horizontal" 
    ? "flex items-center justify-between" 
    : "flex flex-col space-y-2";

  return (
    <div className={cn(containerClass, className)}>
      {showViewButton && actions.onView && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            actions.onView!(book);
          }}
        >
          {variant === "horizontal" ? "View Details" : "View"}
        </Button>
      )}
      {showMoreButton && actions.onMore && (
        <Button
          variant={variant === "horizontal" ? "ghost" : "outline"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            actions.onMore!(book);
          }}
        >
          {variant === "horizontal" ? (
            <MoreHorizontal className="h-4 w-4" />
          ) : (
            "More"
          )}
        </Button>
      )}
    </div>
  );
});

BookActions.displayName = "BookActions";
