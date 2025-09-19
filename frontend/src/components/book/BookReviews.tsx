"use client";

import { useState } from "react";
import { UserReview } from "../../../../types/models";

interface BookReviewsProps {
  reviews: UserReview[];
  onAddReview: (review: Omit<UserReview, 'id' | 'createdAt'>) => void;
}

export default function BookReviews({ reviews, onAddReview }: BookReviewsProps) {
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewText.trim() && newReviewRating > 0) {
      onAddReview({ user: "You", text: newReviewText, rating: newReviewRating });
      setNewReviewText("");
      setNewReviewRating(0);
    }
  };

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center mb-2">
          <span className="mr-2">Your rating:</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setNewReviewRating(i + 1)}
                className={`w-6 h-6 ${i < newReviewRating ? "text-yellow-400" : "text-gray-300"}`}
              >
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={newReviewText}
          onChange={(e) => setNewReviewText(e.target.value)}
          className="w-full border rounded-md p-2 mb-2"
          placeholder="Write your review..."
          rows={4}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md disabled:bg-gray-400"
          disabled={!newReviewText.trim() || newReviewRating === 0}
        >
          Submit Review
        </button>
      </form>
      <div>
        {reviews.map((review) => (
          <div key={review.id} className="border-b last:border-b-0 py-4">
            <div className="flex items-center mb-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="font-semibold ml-2">{review.user}</p>
            </div>
            <p className="text-gray-700">{review.text}</p>
            <p className="text-xs text-gray-500 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}