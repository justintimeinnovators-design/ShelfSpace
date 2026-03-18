"use client";

import { useCallback, useEffect, useState } from "react";
import { ReviewService, type ReviewDTO } from "@/lib/review-service";

/**
 * Use User Reviews.
 * @param userId - user Id value.
 */
export function useUserReviews(userId: string) {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ReviewService.listByUser(userId, { limit: 50, offset: 0 });
      setReviews(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getReviewById = useCallback(async (reviewId: string) => {
    return ReviewService.getById(reviewId);
  }, []);

  return { reviews, loading, error, refresh, getReviewById };
}
