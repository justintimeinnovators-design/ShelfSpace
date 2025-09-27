"use client";

import { SimilarBookItem } from "../../../types";
import { BookCard } from "@/components/common/BookCard";

interface SimilarBooksProps {
  similarBooks: SimilarBookItem[];
}

export default function SimilarBooks({ similarBooks }: SimilarBooksProps) {
  return (
    <div className="card p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Similar Books</h2>
      <div className="flex overflow-x-auto space-x-4 no-scrollbar">
        {similarBooks.map((book) => (
          <div key={book.id} className="min-w-[150px]">
            <BookCard
              book={{
                id: book.id.toString(),
                title: book.title,
                author: book.author,
                cover: book.cover,
                status: "want-to-read" as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                genres: [],
                tags: [],
                format: "physical" as const,
                readingProgress: 0,
                rating: undefined,
                isbn: undefined,
                description: undefined,
                pages: undefined,
                publishedDate: undefined,
                publisher: undefined,
                language: "en",
                isPublic: false,
                isFavorite: false,
              }}
              variant="grid"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
