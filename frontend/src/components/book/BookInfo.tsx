"use client";

import { BookDetail } from "../../../../types/models";

interface BookInfoProps {
  book: BookDetail;
  ratingSummary: {
    average: number;
    count: number;
  };
}

export default function BookInfo({ book, ratingSummary }: BookInfoProps) {
  return (
    <div className="card p-6 mb-6">
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p className="text-lg text-gray-700 mb-2">by {book.author}</p>
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(ratingSummary.average) ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-gray-600 ml-2">
          {ratingSummary.average.toFixed(1)} ({ratingSummary.count.toLocaleString()} ratings)
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {book.genres.map((genre) => (
          <span
            key={genre}
            className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
          >
            {genre}
          </span>
        ))}
      </div>
      <p className="text-gray-700">{book.description}</p>
    </div>
  );
}