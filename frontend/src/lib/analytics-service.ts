/**
 * Analytics dashboard API module.
 *
 * Exposes typed read-only queries used by dashboard widgets and summary cards.
 */
import api from "./api";

export interface DashboardSummary {
  totalBooks: number;
  booksRead: number;
  currentlyReading: number;
  wantToRead: number;
  readingGoal: number;
  currentStreak: number;
  averageRating: number;
  totalPages: number;
  readingTime: number;
  favoriteGenre: string;
}

export interface ReadingAnalyticsResponse {
  readingTrends: Array<{ month: string; books: number; pages: number; hours: number }>;
  genreData: Array<{ name: string; value: number; color: string }>;
  monthlyData: Array<{ month: string; books: number; pages: number; hours: number }>;
  ratingData: Array<{ rating: string; count: number }>;
  stats: {
    totalBooksThisYear: number;
    averageBooksPerMonth: number;
    totalPagesRead: number;
    averageRating: number;
    readingTime: number;
    favoriteGenre: string;
    longestStreak: number;
    currentStreak: number;
  };
}

export interface ReadingGoalsResponse {
  goals: Array<{
    id: string;
    title: string;
    description: string;
    current: number;
    target: number;
    unit: string;
    deadline?: string;
    category: string;
    isCompleted?: boolean;
  }>;
  chartData: Array<{ goal: string; current: number; target: number; unit: string }>;
  completionRate: number;
}

export interface ActivityTimelineResponse {
  activity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
}

/**
 * Fetches dashboard summary counters.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get("/api/analytics/dashboard/summary");
  return response.data;
}

/**
 * Fetches charts/metrics for reading analytics panels.
 */
export async function getReadingAnalytics(): Promise<ReadingAnalyticsResponse> {
  const response = await api.get("/api/analytics/dashboard/reading-analytics");
  return response.data;
}

/**
 * Fetches reading goals and completion progress dataset.
 */
export async function getReadingGoals(): Promise<ReadingGoalsResponse> {
  const response = await api.get("/api/analytics/dashboard/reading-goals");
  return response.data;
}

/**
 * Fetches recent activity timeline events.
 */
export async function getActivityTimeline(): Promise<ActivityTimelineResponse> {
  const response = await api.get("/api/analytics/dashboard/activity");
  return response.data;
}
