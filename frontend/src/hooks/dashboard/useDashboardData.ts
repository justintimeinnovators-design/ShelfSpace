"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Book,
  Recommendation,
  ReadingGroup,
  Activity,
} from "../../../types/models";
import { useReadingLists } from "../data/useReadingLists";
import { bookService } from "@/lib/book-service";
import {
  getDashboardSummary,
  getActivityTimeline,
  type DashboardSummary,
  type ActivityTimelineResponse,
} from "@/lib/analytics-service";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry<any>>();

/**
 * Get Cached Data.
 * @param key - key value.
 * @returns T | null.
 */
function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiresAt) {
    return entry.data;
  }
  if (entry) {
    cache.delete(key);
  }
  return null;
}

/**
 * Set Cached Data.
 * @param key - key value.
 * @param data - data value.
 */
function setCachedData<T>(key: string, data: T): void {
  const now = Date.now();
  cache.set(key, {
    data,
    timestamp: now,
    expiresAt: now + CACHE_DURATION,
  });
}

/**
 * Use Dashboard Data.
 */
export function useDashboardData() {
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [readingGroups, setReadingGroups] = useState<ReadingGroup[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    readingTime: 0,
    readingGoal: 52,
    activeGroups: 0,
    booksRead: 0,
    currentlyReading: 0,
    wantToRead: 0,
    currentStreak: 0,
    averageRating: 0,
    totalPages: 0,
    favoriteGenre: "N/A",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { data: readingLists } = useReadingLists({ includeBooks: true });

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);

    try {
      // Check cache first unless force refresh is requested
      if (!forceRefresh) {
        const cachedCurrentlyReading =
          getCachedData<Book[]>("currentlyReading");
        const cachedRecommendations =
          getCachedData<Recommendation[]>("recommendations");
        const cachedReadingGroups =
          getCachedData<ReadingGroup[]>("readingGroups");
        const cachedRecentActivity =
          getCachedData<Activity[]>("recentActivity");
        const cachedStats = getCachedData<typeof stats>("stats");
        const cachedSummary =
          getCachedData<DashboardSummary>("dashboardSummary");
        const cachedActivityTimeline =
          getCachedData<ActivityTimelineResponse["activity"]>("activityTimeline");

        if (
          cachedCurrentlyReading &&
          cachedRecommendations &&
          cachedReadingGroups &&
          cachedRecentActivity &&
          cachedStats &&
          cachedSummary &&
          cachedActivityTimeline
        ) {
          setCurrentlyReading(cachedCurrentlyReading);
          setRecommendations(cachedRecommendations);
          setReadingGroups(cachedReadingGroups);
          setRecentActivity(cachedRecentActivity);
          setStats(cachedStats);
          setIsLoading(false);
          return;
        }
      }

      // Fetch currently reading books from reading lists
      const currentlyReadingList = readingLists?.find(
        (list: any) => list.name.toLowerCase().includes('currently') || list.name.toLowerCase() === 'reading'
      );
      const currentlyReadingBooks = currentlyReadingList?.books?.filter(
        (book: any) => book.status === 'currently-reading' || !book.status
      ) || [];

      // Fetch recommendations from book service
      let recommendationsData: Recommendation[] = [];
      try {
        const booksResponse = await bookService.getBooks({ page: 1, limit: 5 });
        recommendationsData = booksResponse.data.slice(0, 5).map(book => ({
          id: book.id,
          book: {
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.coverImage || book.cover || '',
            rating: book.averageRating || book.rating || 0,
            status: (book.status === 'currently-reading' ? 'reading' : book.status === 'read' ? 'completed' : book.status || 'want-to-read') as "want-to-read" | "reading" | "completed" | "paused",
            dateAdded: book.addedAt || book.createdAt,
            pages: book.pages || 0,
            genre: book.genres?.[0] || 'General',
          },
          reason: "Based on your reading preferences",
          confidence: 0.85,
        }));
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }

      // Fetch analytics summary + activity timeline
      let summaryData: DashboardSummary = {
        totalBooks: 0,
        booksRead: 0,
        currentlyReading: 0,
        wantToRead: 0,
        readingGoal: 52,
        currentStreak: 0,
        averageRating: 0,
        totalPages: 0,
        readingTime: 0,
        favoriteGenre: "N/A",
      };
      let activityTimeline: ActivityTimelineResponse["activity"] = [];
      try {
        const [summary, activity] = await Promise.all([
          getDashboardSummary(),
          getActivityTimeline(),
        ]);
        summaryData = summary;
        activityTimeline = activity.activity || [];
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      }

      // Fetch groups from ForumService
      let groupsData: ReadingGroup[] = [];
      try {
        const { ForumService } = await import("@/lib/forum-service");
        const groupsResponse = await ForumService.list({ limit: 10, offset: 0 });
        groupsData = groupsResponse.map((g: any) => ({
          id: g.id,
          name: g.name,
          description: g.description || "",
          memberCount: g.memberships?.length || 0,
          currentBook: "", // Not in backend schema yet
          nextMeeting: "", // Not in backend schema yet
          isActive: true,
        }));
      } catch (err) {
        console.error('Error fetching groups:', err);
      }

      // Calculate stats after groups are fetched
      const statsData = {
        ...summaryData,
        activeGroups: groupsData.length,
      };

      // Check if request was aborted
      if (signal.aborted) {
        return;
      }

      // Cache the data
      setCachedData("currentlyReading", currentlyReadingBooks);
      setCachedData("recommendations", recommendationsData);
      setCachedData("readingGroups", groupsData);
      setCachedData("recentActivity", activityTimeline as any);
      setCachedData("stats", statsData);
      setCachedData("dashboardSummary", summaryData);
      setCachedData("activityTimeline", activityTimeline);

      setCurrentlyReading(currentlyReadingBooks as any);
      setRecommendations(recommendationsData);
      setReadingGroups(groupsData);
      setRecentActivity(activityTimeline as any);
      setStats(statsData);
      setLastFetch(Date.now());
      setIsLoading(false);
    } catch (error) {
      if (!signal.aborted) {
        console.error("Failed to fetch dashboard data:", error);
        setIsLoading(false);
      }
    }
  }, [readingLists, readingGroups]);

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run only once on mount

  const refetch = useCallback(
    (forceRefresh = false) => {
      return fetchData(forceRefresh);
    },
    [fetchData]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Auto-refresh functionality
  const enableAutoRefresh = useCallback(
    (intervalMinutes: number) => {
      const interval = setInterval(() => {
        fetchData(false); // Use cache if available
      }, intervalMinutes * 60 * 1000);

      return () => clearInterval(interval);
    },
    [fetchData]
  );

  return {
    currentlyReading,
    recommendations,
    readingGroups,
    recentActivity,
    stats,
    isLoading,
    lastFetch,
    refetch,
    enableAutoRefresh,
    clearCache: () => cache.clear(),
  };
}
