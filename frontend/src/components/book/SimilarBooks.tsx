"use client";

import { SimilarBookItem } from "../../../../types/models";
import BookCard from "../common/BookCard";

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
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}