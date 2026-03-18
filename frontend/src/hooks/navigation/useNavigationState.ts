// src/hooks/navigation/useNavigationState.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { NavigationState, NavigationActions } from "../../../types/state";

const initialPreferences: NavigationState["preferences"] = {
  showLabels: true,
  compactMode: false,
};

const initialState: Omit<NavigationState, "isLoading" | "error"> = {
  activeTab: "dashboard",
  isCollapsed: false,
  preferences: initialPreferences,
};

/**
 * Use Navigation State.
 */
export function useNavigationState() {
  const [state, setState] =
    useState<Omit<NavigationState, "isLoading" | "error">>(initialState);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Actions
  const actions = useMemo<NavigationActions>(
    () => ({
      setActiveTab: useCallback((tab: string) => {
        setState((prev) => ({ ...prev, activeTab: tab }));
      }, []),

      toggleCollapsed: useCallback(() => {
        setState((prev) => ({ ...prev, isCollapsed: !prev.isCollapsed }));
      }, []),

      updatePreferences: useCallback(
        (newPreferences: Partial<NavigationState["preferences"]>) => {
          setState((prev) => ({
            ...prev,
            preferences: { ...prev.preferences, ...newPreferences },
          }));
        },
        []
      ),
    }),
    []
  );

  // Computed values
  const navigationItems = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: "Home" },
      { id: "library", label: "Library", icon: "BookOpen" },
      { id: "discover", label: "Discover", icon: "Compass" },
      { id: "forums", label: "Forums", icon: "Users" },
      { id: "chat", label: "AI Assistant", icon: "MessageCircle" },
      { id: "profile", label: "Profile", icon: "User" },
      { id: "settings", label: "Settings", icon: "Settings" },
    ],
    []
  );

  const activeItem = useMemo(() => {
    return navigationItems.find((item) => item.id === state.activeTab);
  }, [navigationItems, state.activeTab]);

  return {
    // State
    activeTab: state.activeTab,
    isCollapsed: state.isCollapsed,
    preferences: state.preferences,
    isLoading,
    error,

    // Computed values
    navigationItems,
    activeItem,

    // Actions
    actions,
  };
}
