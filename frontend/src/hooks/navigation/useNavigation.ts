"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationPerformanceMonitor,
  throttle,
} from "../../utils/navigationPerformance";

// Define NavigationItemData interface inline
interface NavigationItemData {
  name: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavigationItemData[];
  ariaLabel?: string;
  isDisabled?: boolean;
}

export interface NavigationState {
  activeTab: string;
  isCollapsed: boolean;
  expandedItems: string[];
}

export interface NavigationActions {
  setActiveTab: (tab: string) => void;
  toggleCollapse: () => void;
  toggleItemExpansion: (itemName: string) => void;
  navigateToItem: (item: NavigationItemData) => void;
  handleKeyboardNavigation: (
    event: KeyboardEvent,
    items: NavigationItemData[]
  ) => void;
}

export interface UseNavigationReturn {
  state: NavigationState;
  actions: NavigationActions;
  isActive: (href: string) => boolean;
  getNavigationItems: () => NavigationItemData[];
}

/**
 * Use Navigation.
 * @returns UseNavigationReturn.
 */
export function useNavigation(): UseNavigationReturn {
  const pathname = usePathname();
  const router = useRouter();
  const performanceMonitor = useRef(NavigationPerformanceMonitor.getInstance());

  const [state, setState] = useState<NavigationState>({
    activeTab: "dashboard", // Start with default value
    isCollapsed: false, // Always start expanded
    expandedItems: [],
  });

  // Sync active tab with pathname changes
  useEffect(() => {
    if (!pathname) return;
    const pathSegments = pathname.split("/").filter(Boolean);
    let newActiveTab = "dashboard";
    
    // Handle dashboard route group - look at the second segment for actual page
    if (pathSegments.length > 0 && pathSegments[0] === "dashboard") {
      newActiveTab = pathSegments[1] || "dashboard";
    } else if (pathSegments.length > 0) {
      // For direct routes like /library, /discover, etc.
      newActiveTab = pathSegments[0] || "dashboard";
    }
    
    setState((prev) => ({
      ...prev,
      activeTab: newActiveTab,
    }));
  }, [pathname]);

  // Navigation items configuration
  const navigationItems: NavigationItemData[] = useMemo(
    () => [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: "Home",
        ariaLabel: "Go to Dashboard",
      },
      {
        name: "Chat",
        href: "/chat",
        icon: "MessageCircle",
        ariaLabel: "Open AI Chat Assistant",
      },
      {
        name: "Library",
        href: "/library",
        icon: "BookOpen",
        badge: 12,
        ariaLabel: "Manage your personal library",
      },
      {
        name: "Discover",
        href: "/discover",
        icon: "Search",
        ariaLabel: "Discover new books",
      },
      {
        name: "Forums",
        href: "/forums",
        icon: "Users",
        badge: 3,
        ariaLabel: "Join reading forums",
      },
      {
        name: "Settings",
        href: "/settings",
        icon: "Settings",
        ariaLabel: "Application settings",
      },
    ],
    []
  );

  // Throttled keyboard navigation to prevent excessive calls
  const throttledKeyboardNavigation = useMemo(
    () =>
      throttle((event: KeyboardEvent, items: NavigationItemData[]) => {
        if (!pathname) return;
        const currentPathSegments = pathname.split("/").filter(Boolean);
        let currentPage = "dashboard";
        
        // Handle dashboard route group
        if (currentPathSegments.length > 0 && currentPathSegments[0] === "dashboard") {
          currentPage = currentPathSegments[1] || "dashboard";
        } else if (currentPathSegments.length > 0) {
          currentPage = currentPathSegments[0] || "dashboard";
        }
        
        const currentIndex = items.findIndex(
          (item) => currentPage === item.href.replace("/", "")
        );

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % items.length;
            // Use direct state update to avoid circular dependency
            if (items[nextIndex]) {
              setState((prev) => ({
                ...prev,
                activeTab: items[nextIndex]!.href.replace("/", ""),
              }));
            }
            break;

          case "ArrowUp":
            event.preventDefault();
            const prevIndex =
              currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            if (items[prevIndex]) {
              setState((prev) => ({
                ...prev,
                activeTab: items[prevIndex]!.href.replace("/", ""),
              }));
            }
            break;

          case "Enter":
          case " ":
            event.preventDefault();
            if (currentIndex >= 0 && items[currentIndex]) {
              performanceMonitor.current.startNavigation(
                items[currentIndex]!.href
              );
              router.push(items[currentIndex]!.href);
              setTimeout(() => {
                performanceMonitor.current.endNavigation(
                  items[currentIndex]!.href
                );
              }, 0);
            }
            break;

          case "Escape":
            event.preventDefault();
            setState((prev) => ({ ...prev, isCollapsed: !prev.isCollapsed }));
            break;
        }
      }, 100),
    [pathname, router]
  );

  // Define individual action callbacks first
  const setActiveTab = useCallback((tab: string) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const toggleCollapse = useCallback(() => {
    setState((prev) => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  }, []);

  const toggleItemExpansion = useCallback((itemName: string) => {
    setState((prev) => ({
      ...prev,
      expandedItems: prev.expandedItems.includes(itemName)
        ? prev.expandedItems.filter((name) => name !== itemName)
        : [...prev.expandedItems, itemName],
    }));
  }, []);

  const navigateToItem = useCallback(
    (item: NavigationItemData) => {
      // Track navigation performance
      performanceMonitor.current.startNavigation(item.href);

      const tabName = item.href.replace("/", "");
      setState((prev) => ({ ...prev, activeTab: tabName }));

      // Handle expansion for items with children
      if (item.children) {
        setState((prev) => ({
          ...prev,
          expandedItems: prev.expandedItems.includes(item.name)
            ? prev.expandedItems.filter((name) => name !== item.name)
            : [...prev.expandedItems, item.name],
        }));
      } else {
        // Navigate to the route
        router.push(item.href);
        // End performance tracking after navigation
        setTimeout(() => {
          performanceMonitor.current.endNavigation(item.href);
        }, 0);
      }
    },
    [router]
  );

  const handleKeyboardNavigation = useCallback(
    (event: KeyboardEvent, items: NavigationItemData[]) => {
      throttledKeyboardNavigation(event, items);
    },
    [throttledKeyboardNavigation]
  );

  // Actions object
  const actions: NavigationActions = useMemo(
    () => ({
      setActiveTab,
      toggleCollapse,
      toggleItemExpansion,
      navigateToItem,
      handleKeyboardNavigation,
    }),
    [
      setActiveTab,
      toggleCollapse,
      toggleItemExpansion,
      navigateToItem,
      handleKeyboardNavigation,
    ]
  );

  // Helper functions
  const isActive = useCallback(
    (href: string) => {
      if (!pathname) return false;
      const tabName = href.replace("/", "");
      const currentPathSegments = pathname.split("/").filter(Boolean);
      
      // Handle dashboard route group
      if (currentPathSegments.length > 0 && currentPathSegments[0] === "dashboard") {
        const currentPage = currentPathSegments[1] || "dashboard";
        return currentPage === tabName;
      }
      
      // For direct routes
      const currentPage = currentPathSegments[0] || "dashboard";
      return currentPage === tabName;
    },
    [pathname]
  );

  const getNavigationItems = useCallback(
    () => navigationItems,
    [navigationItems]
  );

  return {
    state,
    actions,
    isActive,
    getNavigationItems,
  };
}
