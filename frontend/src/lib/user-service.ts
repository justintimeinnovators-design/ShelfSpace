import serverApi from "./server-api";

// Use environment variable or fallback to localhost
// In server-side contexts (like NextAuth callbacks), this will use localhost
// In production, use the Docker service name
const USER_SERVICE_URL =
  typeof window === "undefined"
    ? (process.env["USER_SERVICE_URL"] ||
        process.env["NEXT_PUBLIC_USER_SERVICE_URL"] ||
        "http://localhost:3001/api")
    : process.env["NEXT_PUBLIC_USER_SERVICE_URL"] || "http://localhost:3001/api";

// Types for user service responses
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  isPublic: boolean;
  status: "ACTIVE" | "SUSPENDED" | "BANNED" | "DEACTIVATED";
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface UserPreferences {
  id: number;
  userId: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";
  language: string;
  timezone?: string;
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
  id: number;
  userId: string;
  booksRead: number;
  pagesRead: number;
  currentStreak: number;
  longestStreak: number;
  updatedAt: string;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface CreateUserResponse {
  token: string;
  user: User;
  isNewUser: boolean;
  needsPreferences: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  isPublic?: boolean;
  role?: "admin" | "user";
}

export interface UpdatePreferencesRequest {
  theme?: "LIGHT" | "DARK" | "SYSTEM";
  language?: string;
  timezone?: string;
  notificationsEmail?: boolean;
  notificationsSMS?: boolean;
  newsletterOptIn?: boolean;
  dailyDigest?: boolean;
  defaultSortOrder?: "MOST_RECENT" | "MOST_POPULAR" | "ALPHABETICAL";
  defaultViewMode?: "CARD" | "LIST";
  compactMode?: boolean;
  accessibilityFont?: boolean;
  reducedMotion?: boolean;
  autoPlayMedia?: boolean;
  settings?: Record<string, unknown> | null;
}

// API Client class
class UserServiceClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = USER_SERVICE_URL;
  }

  // Set authentication token
/**
 * Set Token.
 * @param token - token value.
 */
  setToken(token: string) {
    this.token = token;
  }

  // Clear authentication token
/**
 * Clear Token.
 */
  clearToken() {
    this.token = null;
  }

  // Get headers with auth token
/**
 * Get Headers.
 */
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Create or find user (handles both new and existing users)
/**
 * Create User.
 * @param userData - user Data value.
 * @returns Promise<CreateUserResponse>.
 */
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      console.log("UserService: Creating/finding user...");
      console.log("UserService: URL:", `${this.baseURL}/me`);
      console.log("UserService: Data:", userData);
      
      const response = await serverApi.post(
        `${this.baseURL}/me`,
        userData,
        { 
          headers: this.getHeaders(),
          timeout: 10000 // 10 second timeout
        }
      );
      
      console.log("UserService: Success! Response:", {
        userId: response.data.user?.id,
        isNewUser: response.data.isNewUser,
        hasToken: !!response.data.token
      });
      
      return response.data;
    } catch (error: any) {
      console.error('UserService: Error creating/finding user');
      console.error('UserService: Error message:', error.message);
      console.error('UserService: Error code:', error.code);
      console.error('UserService: Response status:', error.response?.status);
      console.error('UserService: Response data:', error.response?.data);
      throw error;
    }
  }

  // Get current user profile
/**
 * Get Current User.
 * @returns Promise<User>.
 */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await serverApi.get(
        `${this.baseURL}/me`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Update current user profile
/**
 * Update User.
 * @param userData - user Data value.
 * @returns Promise<User>.
 */
  async updateUser(userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await serverApi.patch(
        `${this.baseURL}/me`,
        userData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Get user preferences
/**
 * Get Preferences.
 * @returns Promise<UserPreferences>.
 */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const response = await serverApi.get(
        `${this.baseURL}/me/preferences`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  }

  // Update user preferences
/**
 * Update Preferences.
 * @param preferences - preferences value.
 * @returns Promise<UserPreferences>.
 */
  async updatePreferences(preferences: UpdatePreferencesRequest): Promise<UserPreferences> {
    try {
      const response = await serverApi.put(
        `${this.baseURL}/me/preferences`,
        preferences,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  // Get user stats
/**
 * Get Stats.
 * @returns Promise<UserStats>.
 */
  async getStats(): Promise<UserStats> {
    try {
      const response = await serverApi.get(
        `${this.baseURL}/me/stats`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // Get user by ID (for public profiles)
/**
 * Get User By Id.
 * @param userId - user Id value.
 * @returns Promise<{ token: string }>.
 */
  async getUserById(userId: string): Promise<{ token: string }> {
    try {
      const response = await serverApi.get(
        `${this.baseURL.replace(/\/api$/, "")}/api/token/${userId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserServiceClient();
