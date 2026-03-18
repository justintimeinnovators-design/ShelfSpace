"use client";

import { useState, useEffect, useCallback } from "react";
import { NavigationPreferences } from "../../../types/navigation";

const defaultPreferences: NavigationPreferences = {
  isCollapsed: false,
  favoriteItems: [],
};

/**
 * Use Navigation Preferences.
 */
export function useNavigationPreferences() {
  const [preferences, setPreferences] =
    useState<NavigationPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Save preferences
  const savePreferences = useCallback(
    (newPreferences: Partial<NavigationPreferences>) => {
      setPreferences((current) => {
        const updated = { ...current, ...newPreferences };
        return updated;
      });
    },
    [] // Remove preferences dependency to prevent hook order issues
  );

  // Individual preference setters
  const setIsCollapsed = useCallback(
    (isCollapsed: boolean) => {
      savePreferences({ isCollapsed });
    },
    [savePreferences]
  );

  const addFavoriteItem = useCallback(
    (itemName: string) => {
      setPreferences((current) => {
        const favoriteItems = [...current.favoriteItems];
        if (!favoriteItems.includes(itemName)) {
          favoriteItems.push(itemName);
          const updated = { ...current, favoriteItems };
          return updated;
        }
        return current;
      });
    },
    [] // Remove dependencies to prevent hook order issues
  );

  const removeFavoriteItem = useCallback(
    (itemName: string) => {
      setPreferences((current) => {
        const favoriteItems = current.favoriteItems.filter(
          (name) => name !== itemName
        );
        const updated = { ...current, favoriteItems };
        return updated;
      });
    },
    [] // Remove dependencies to prevent hook order issues
  );

  const setCustomOrder = useCallback(
    (customOrder: string[]) => {
      setPreferences((current) => {
        const updated = { ...current, customOrder };
        return updated;
      });
    },
    [] // Remove dependencies to prevent hook order issues
  );

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, []);

  return {
    preferences,
    isLoaded,
    setIsCollapsed,
    addFavoriteItem,
    removeFavoriteItem,
    setCustomOrder,
    resetPreferences,
    savePreferences,
  };
}
