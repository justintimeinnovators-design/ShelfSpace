import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().min(10),
  tldr: z.string().optional(),
  bookId: z.string(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  reviewText: z.string().min(10).optional(),
  tldr: z.string().optional(),
});