/**
 * Analytics query hooks.
 *
 * Provides thin typed wrappers around analytics API calls with a shared
 * loading/error/refetch pattern.
 */
import { useState, useEffect, useCallback } from "react";
import {
  getDashboardSummary,
  getReadingAnalytics,
  getReadingGoals,
  getActivityTimeline,
  type DashboardSummary,
  type ReadingAnalyticsResponse,
  type ReadingGoalsResponse,
  type ActivityTimelineResponse,
} from "@/lib/analytics-service";

interface UseAnalyticsState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Generic internal query primitive for analytics endpoints.
 *
 * @param fetcher Promise-returning analytics request function.
 */
function useAnalyticsQuery<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<UseAnalyticsState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Failed to load analytics");
      setState({ data: null, isLoading: false, error: errorObj });
    }
  }, [fetcher]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    ...state,
    refetch: load,
  };
}

/**
 * Fetches summary counters for dashboard header/stat cards.
 */
export function useDashboardSummary() {
  return useAnalyticsQuery<DashboardSummary>(getDashboardSummary);
}

/**
 * Fetches reading analytics chart datasets.
 */
export function useReadingAnalyticsData() {
  return useAnalyticsQuery<ReadingAnalyticsResponse>(getReadingAnalytics);
}

/**
 * Fetches goals/progress datasets.
 */
export function useReadingGoalsData() {
  return useAnalyticsQuery<ReadingGoalsResponse>(getReadingGoals);
}

/**
 * Fetches recent activity timeline entries.
 */
export function useActivityTimelineData() {
  return useAnalyticsQuery<ActivityTimelineResponse>(getActivityTimeline);
}
