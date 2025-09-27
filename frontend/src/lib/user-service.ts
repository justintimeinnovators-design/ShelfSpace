import axios from "axios";

// Use Docker service name for microservice communication
const USER_SERVICE_URL = process.env.NODE_ENV === 'production' 
  ? "http://user-service:3001/api"
  : "http://localhost:3001/api";

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
}

// API Client class
class UserServiceClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = USER_SERVICE_URL;
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
  }

  // Get headers with auth token
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
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/me`,
        userData,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating/finding user:', error);
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get(
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
  async updateUser(userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await axios.patch(
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
  async getPreferences(): Promise<UserPreferences> {
    try {
      const response = await axios.get(
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
  async updatePreferences(preferences: UpdatePreferencesRequest): Promise<UserPreferences> {
    try {
      const response = await axios.put(
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
  async getStats(): Promise<UserStats> {
    try {
      const response = await axios.get(
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
  async getUserById(userId: string): Promise<{ token: string }> {
    try {
      const response = await axios.get(
        `${this.baseURL}/${userId}`,
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
