/**
 * User-service API wrapper.
 *
 * This module centralizes user/profile/preferences endpoints and keeps calling
 * components independent of raw request details (paths, headers, base URL logic).
 */
import axios from "axios";
import { getErrorMessage } from "./api-utils";

const USER_API_BASE =
  process.env["NEXT_PUBLIC_USER_SERVICE_URL"] || "http://localhost:3001/api";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  website?: string | null;
  isPublic: boolean;
  status: "ACTIVE" | "SUSPENDED" | "BANNED" | "DEACTIVATED";
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  id: number;
  userId: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";
  language: string;
  timezone?: string | null;
  notificationsEmail: boolean;
  notificationsSMS: boolean;
  newsletterOptIn: boolean;
  dailyDigest: boolean;
  defaultSortOrder: "MOST_RECENT" | "MOST_POPULAR" | "ALPHABETICAL";
  defaultViewMode: "CARD" | "LIST";
  compactMode: boolean;
  accessibilityFont: boolean;
  reducedMotion: boolean;
  autoPlayMedia: boolean;
  settings?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  booksRead: number;
  pagesRead: number;
  currentStreak: number;
  longestStreak: number;
}

/**
 * Auth Headers.
 * @param token - token value.
 */
function authHeaders(token?: string) {
  // Small helper avoids repeating bearer-token header wiring in each endpoint call.
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const userApi = {
  /**
   * Validates whether the provided auth token is still accepted by user service.
   */
  async verify(token: string) {
    try {
      // Verification endpoint is used by auth flows to validate issued session tokens.
      const { data } = await axios.post(`${USER_API_BASE}/auth/verify`, null, {
        headers: authHeaders(token),
      });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Fetches current authenticated user's profile.
   */
  async getMe(token: string): Promise<UserProfile> {
    try {
      const { data } = await axios.get(`${USER_API_BASE}/me`, {
        headers: authHeaders(token),
      });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Applies partial profile updates for the current user.
   */
  async updateMe(token: string, input: Partial<UserProfile>) {
    try {
      const { data } = await axios.patch(`${USER_API_BASE}/me`, input, {
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
      });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Fetches current user's preference record.
   */
  async getPreferences(token: string): Promise<UserPreferences> {
    try {
      const { data } = await axios.get(`${USER_API_BASE}/me/preferences`, {
        headers: authHeaders(token),
      });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Applies partial preference updates.
   */
  async updatePreferences(token: string, input: Partial<UserPreferences>) {
    try {
      // JSON header is explicit to avoid middleware ambiguity across services.
      const { data } = await axios.put(`${USER_API_BASE}/me/preferences`, input, {
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
      });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Fetches aggregate reading/user statistics.
   */
  async getStats(token: string): Promise<UserStats> {
    try {
      const { data } = await axios.get(`${USER_API_BASE}/me/stats`, {
        headers: authHeaders(token),
      });
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Retrieves an impersonation/testing token for a specific user id.
   */
  async getTokenForUser(userId: string) {
    try {
      // Token endpoint lives outside `/api`, so we normalize base URL before appending path.
      const { data } = await axios.get(`${USER_API_BASE.replace(/\/api$/, "")}/api/token/${userId}`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Admin endpoint to update a target user's status.
   */
  async updateUserStatus(token: string, userId: string, status: UserProfile["status"]) {
    try {
      const { data } = await axios.put(
        `${USER_API_BASE}/users/${userId}/status`,
        { status },
        { headers: { "Content-Type": "application/json", ...authHeaders(token) } }
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Admin endpoint to reset a target user's preferences to defaults.
   */
  async resetUserPreferences(token: string, userId: string) {
    try {
      const { data } = await axios.put(
        `${USER_API_BASE}/users/${userId}/preferences/reset`,
        {},
        { headers: { "Content-Type": "application/json", ...authHeaders(token) } }
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
