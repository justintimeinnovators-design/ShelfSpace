/**
 * Reviews query/mutation hook scoped to one book.
 *
 * Maintains local review list state and exposes CRUD handlers that synchronize
 * with review-service endpoints.
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ReviewService, type CreateReviewInput, type UpdateReviewInput, type ReviewDTO } from "@/lib/review-service";

/**
 * Fetches and manages reviews for a book.
 *
 * @param bookId Target book identifier.
 * @returns Review list state, aggregate metrics, and CRUD handlers.
 */
export function useReviews(bookId: string) {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ReviewService.listByBook(bookId, { limit: 50, offset: 0 });
      setReviews(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const createReview = useCallback(async (input: CreateReviewInput) => {
    const created = await ReviewService.create(input);
    setReviews((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateReview = useCallback(async (id: string, input: UpdateReviewInput) => {
    const updated = await ReviewService.update(id, input);
    setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  }, []);

  const deleteReview = useCallback(async (id: string) => {
    await ReviewService.remove(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const averageRating = useMemo(() => {
    // Derived metric used by UI summary chips/cards.
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
  }, [reviews]);

  return { reviews, loading, error, averageRating, refresh: fetchReviews, createReview, updateReview, deleteReview };
}
