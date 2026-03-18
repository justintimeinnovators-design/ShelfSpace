/**
 * Forum service API wrapper.
 *
 * Encapsulates all forum/thread/post/membership endpoints and maps transport
 * failures into `ForumServiceError` for consistent caller handling.
 */
import { createApiClient } from "./api";
import { getErrorMessage } from "./api-utils";
import { AxiosError } from "axios";

export interface CreateForumInput {
  name: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateForumInput {
  name?: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface ForumDTO {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  tags: string[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
  memberships: ForumMembershipDTO[];
  memberCount?: number;
  threadCount?: number;
}

export interface ForumMembershipDTO {
  id: string;
  forumId: string;
  userId: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
  createdAt: string;
}

export interface ForumThreadDTO {
  id: string;
  forumId: string;
  title: string;
  content: string;
  createdById: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForumPostDTO {
  id: string;
  threadId: string;
  authorId: string;
  content: string;
  parentPostId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ForumPostReactionDTO {
  id: string;
  postId: string;
  userId: string;
  type: "LIKE" | "UPVOTE" | "LAUGH" | "SAD" | "ANGRY";
  createdAt: string;
}

export class ForumServiceError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "ForumServiceError";
  }
}

export const ForumService = {
  client: createApiClient(
    process.env["NEXT_PUBLIC_FORUM_SERVICE_URL"] || "http://localhost:3005"
  ),

  /**
   * Lists forums with optional pagination.
   */
  async list(opts?: { limit?: number; offset?: number }): Promise<ForumDTO[]> {
    try {
      const params: Record<string, any> = {};
      if (opts?.limit) params["limit"] = opts.limit;
      if (opts?.offset) params["offset"] = opts.offset;
      const { data } = await ForumService.client.get(`/api/forums`, { params });
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Fetches one forum by id.
   */
  async getById(id: string): Promise<ForumDTO> {
    try {
      const { data } = await ForumService.client.get(`/api/forums/${id}`);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Creates a forum.
   */
  async create(input: CreateForumInput): Promise<ForumDTO> {
    try {
      const { data } = await ForumService.client.post(`/api/forums`, input);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Updates forum metadata.
   */
  async update(id: string, input: UpdateForumInput): Promise<ForumDTO> {
    try {
      const { data } = await ForumService.client.put(`/api/forums/${id}`, input);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Deletes a forum.
   */
  async delete(id: string): Promise<void> {
    try {
      await ForumService.client.delete(`/api/forums/${id}`);
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Joins the current user to a forum.
   */
  async join(id: string): Promise<ForumMembershipDTO> {
    try {
      const { data } = await ForumService.client.post(`/api/forums/${id}/join`);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Removes current user membership from a forum.
   */
  async leave(id: string): Promise<void> {
    try {
      await ForumService.client.post(`/api/forums/${id}/leave`);
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Fetches all forum members.
   */
  async getMembers(forumId: string): Promise<ForumMembershipDTO[]> {
    try {
      const { data } = await ForumService.client.get(`/api/forums/${forumId}/members`);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Verifies whether a user is currently a member of a forum.
   */
  async verifyMembership(forumId: string, userId: string): Promise<{ isMember: boolean }> {
    try {
      const { data } = await ForumService.client.get(`/api/forums/${forumId}/members/${userId}/verify`);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Lists threads for a forum.
   */
  async listThreads(forumId: string, opts?: { limit?: number; offset?: number }): Promise<ForumThreadDTO[]> {
    try {
      const params: Record<string, any> = {};
      if (opts?.limit) params["limit"] = opts.limit;
      if (opts?.offset) params["offset"] = opts.offset;
      const { data } = await ForumService.client.get(`/api/forums/${forumId}/threads`, { params });
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Fetches one thread by id.
   */
  async getThread(forumId: string, threadId: string): Promise<ForumThreadDTO> {
    try {
      const { data } = await ForumService.client.get(`/api/forums/${forumId}/threads/${threadId}`);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Creates a new thread.
   */
  async createThread(forumId: string, input: { title: string; content: string }): Promise<ForumThreadDTO> {
    try {
      const { data } = await ForumService.client.post(`/api/forums/${forumId}/threads`, input);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Updates an existing thread.
   */
  async updateThread(
    forumId: string,
    threadId: string,
    input: { title?: string; content?: string; isPinned?: boolean; isLocked?: boolean }
  ): Promise<ForumThreadDTO> {
    try {
      const { data } = await ForumService.client.put(`/api/forums/${forumId}/threads/${threadId}`, input);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Deletes a thread.
   */
  async deleteThread(forumId: string, threadId: string): Promise<void> {
    try {
      await ForumService.client.delete(`/api/forums/${forumId}/threads/${threadId}`);
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Lists posts for a thread.
   */
  async listPosts(
    forumId: string,
    threadId: string,
    opts?: { limit?: number; offset?: number }
  ): Promise<ForumPostDTO[]> {
    try {
      const params: Record<string, any> = {};
      if (opts?.limit) params["limit"] = opts.limit;
      if (opts?.offset) params["offset"] = opts.offset;
      const { data } = await ForumService.client.get(`/api/forums/${forumId}/threads/${threadId}/posts`, { params });
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Creates a post in a thread.
   */
  async createPost(
    forumId: string,
    threadId: string,
    input: { content: string; parentPostId?: string }
  ): Promise<ForumPostDTO> {
    try {
      const { data } = await ForumService.client.post(`/api/forums/${forumId}/threads/${threadId}/posts`, input);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Updates a thread post.
   */
  async updatePost(
    forumId: string,
    threadId: string,
    postId: string,
    input: { content?: string }
  ): Promise<ForumPostDTO> {
    try {
      const { data } = await ForumService.client.put(`/api/forums/${forumId}/threads/${threadId}/posts/${postId}`, input);
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Deletes a post from a thread.
   */
  async deletePost(forumId: string, threadId: string, postId: string): Promise<void> {
    try {
      await ForumService.client.delete(`/api/forums/${forumId}/threads/${threadId}/posts/${postId}`);
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Adds a reaction to a post.
   */
  async addReaction(
    forumId: string,
    threadId: string,
    postId: string,
    type: "LIKE" | "UPVOTE" | "LAUGH" | "SAD" | "ANGRY"
  ): Promise<ForumPostReactionDTO> {
    try {
      const { data } = await ForumService.client.post(
        `/api/forums/${forumId}/threads/${threadId}/posts/${postId}/reactions`,
        { type }
      );
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },

  /**
   * Removes a reaction from a post.
   */
  async removeReaction(
    forumId: string,
    threadId: string,
    postId: string,
    type: "LIKE" | "UPVOTE" | "LAUGH" | "SAD" | "ANGRY"
  ): Promise<void> {
    try {
      await ForumService.client.delete(`/api/forums/${forumId}/threads/${threadId}/posts/${postId}/reactions`, { data: { type } });
    } catch (error) {
      const message = getErrorMessage(error);
      const status = (error as AxiosError)?.response?.status;
      throw new ForumServiceError(message, status);
    }
  },
};
