/**
 * Review service API wrapper.
 *
 * Centralizes book/user review endpoints and maps failures to `ReviewServiceError`
 * so calling hooks/components can handle review-specific failures consistently.
 */
import { createApiClient } from "./api";
import { getErrorMessage } from "./api-utils";
import { AxiosError } from "axios";

export interface CreateReviewInput {
  bookId: string;
  reviewText: string;
  rating: number;
  tldr?: string;
}

export interface UpdateReviewInput {
  reviewText?: string;
  rating?: number;
  tldr?: string;
}

export interface ReviewDTO {
  id: string;
  userId: string;
  bookId: string;
  reviewText: string;
  tldr?: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export class ReviewServiceError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "ReviewServiceError";
  }
}

export const ReviewService = {
  client: createApiClient(
    process.env["NEXT_PUBLIC_REVIEW_SERVICE_URL"] || "http://localhost:3002"
  ),

  /**
   * Lists reviews for a book.
   */
  async listByBook(bookId: string, opts?: { limit?: number; offset?: number }): Promise<ReviewDTO[]> {
    try {
      const params: Record<string, any> = {};
      if (opts?.limit) params['limit'] = opts.limit;
      if (opts?.offset) params['offset'] = opts.offset;
      const { data } = await ReviewService.client.get(`/api/reviews/book/${bookId}`, { params });
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ReviewServiceError(message, status);
    }
  },

  /**
   * Lists reviews authored by a user.
   */
  async listByUser(userId: string, opts?: { limit?: number; offset?: number }): Promise<ReviewDTO[]> {
    try {
      const params: Record<string, any> = {};
      if (opts?.limit) params["limit"] = opts.limit;
      if (opts?.offset) params["offset"] = opts.offset;
      const { data } = await ReviewService.client.get(`/api/reviews/user/${userId}`, { params });
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ReviewServiceError(message, status);
    }
  },

  /**
   * Fetches one review by id.
   */
  async getById(id: string): Promise<ReviewDTO> {
    try {
      const { data } = await ReviewService.client.get(`/api/reviews/${id}`);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ReviewServiceError(message, status);
    }
  },

  /**
   * Creates a new review.
   */
  async create(input: CreateReviewInput): Promise<ReviewDTO> {
    try {
      const { data } = await ReviewService.client.post(`/api/reviews`, input);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ReviewServiceError(message, status);
    }
  },

  /**
   * Updates an existing review.
   */
  async update(id: string, input: UpdateReviewInput): Promise<ReviewDTO> {
    try {
      const { data } = await ReviewService.client.put(`/api/reviews/${id}`, input);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ReviewServiceError(message, status);
    }
  },

  /**
   * Deletes a review.
   */
  async remove(id: string): Promise<void> {
    try {
      await ReviewService.client.delete(`/api/reviews/${id}`);
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ReviewServiceError(message, status);
    }
  },
};
