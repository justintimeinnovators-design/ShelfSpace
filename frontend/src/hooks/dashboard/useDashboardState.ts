// src/hooks/dashboard/useDashboardState.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { DashboardState, DashboardActions } from "../../../types/state";
import { useDashboardData } from "./useDashboardData";

const initialPreferences: DashboardState["preferences"] = {
  showStats: true,
  showRecentActivity: true,
  showRecommendations: true,
  compactView: false,
};

const initialState: Omit<DashboardState, "isLoading" | "error"> = {
  activeSection: "overview",
  preferences: initialPreferences,
  refreshInterval: 300000, // 5 minutes
};

/**
 * Use Dashboard State.
 */
export function useDashboardState() {
  const [state, setState] =
    useState<Omit<DashboardState, "isLoading" | "error">>(initialState);

  // Get dashboard data
  const {
    currentlyReading,
    recommendations,
    readingGroups,
    recentActivity,
    stats,
    isLoading,
    refetch,
  } = useDashboardData();

  const [error, _setError] = useState<string | null>(null);

  // Note: Auto-refresh is handled by useDashboardData hook internally
  // Removed auto-refresh logic here to prevent infinite loops

  // Actions
  const setActiveSection = useCallback((section: string) => {
    setState((prev) => ({ ...prev, activeSection: section }));
  }, []);

  const updatePreferences = useCallback(
    (newPreferences: Partial<DashboardState["preferences"]>) => {
      setState((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, ...newPreferences },
      }));
    },
    []
  );

  const setRefreshInterval = useCallback((interval: number) => {
    setState((prev) => ({ ...prev, refreshInterval: interval }));
  }, []);

  const refreshData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const actions = useMemo<DashboardActions>(
    () => ({
      setActiveSection,
      updatePreferences,
      setRefreshInterval,
      refreshData,
    }),
    [setActiveSection, updatePreferences, setRefreshInterval, refreshData]
  );

  // Computed values
  const visibleSections = useMemo(() => {
    const sections = [];
    if (state.preferences.showStats) sections.push("stats");
    if (state.preferences.showRecentActivity) sections.push("activity");
    if (state.preferences.showRecommendations) sections.push("recommendations");
    return sections;
  }, [state.preferences]);

  const statsData = useMemo(() => {
    return {
      totalBooks: stats?.totalBooks || 0,
      booksRead: stats?.booksRead || 0,
      currentlyReading: stats?.currentlyReading || 0,
      wantToRead: stats?.wantToRead || 0,
      readingGoal: stats?.readingGoal || 52,
      readingTime: stats?.readingTime || 0,
      currentStreak: stats?.currentStreak || 0,
      averageRating: stats?.averageRating || 0,
      totalPages: stats?.totalPages || 0,
      favoriteGenre: stats?.favoriteGenre || "N/A",
      activeGroups: stats?.activeGroups || 0,
    };
  }, [stats]);

  return {
    // State
    activeSection: state.activeSection,
    preferences: state.preferences,
    refreshInterval: state.refreshInterval,
    isLoading,
    error,

    // Data
    stats: statsData,
    visibleSections,

    // Dashboard specific data
    currentlyReading: currentlyReading || [],
    recommendations: recommendations || [],
    readingGroups: readingGroups || [],
    recentActivity: recentActivity || [],

    // Actions
    actions,
  };
}
