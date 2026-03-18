/**
 * Global application state context.
 *
 * Responsibilities:
 * - Store cross-feature state (auth, theme, app preferences, loading/error flags).
 * - Keep local app state synchronized with NextAuth session state.
 * - Expose a stable action interface to descendants.
 *
 * Design notes:
 * - State transitions are reducer-driven for predictability.
 * - Side effects (session sync, DOM theme updates, sign-out) are isolated in effects/actions.
 */
"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { signOut, useSession } from "next-auth/react";
import { AppState, AppActions } from "@/types/state";
import { userService } from "@/lib/user-service";

// Initial state
const initialState: AppState = {
  user: null,
  theme: "system",
  isAuthenticated: false,
  globalPreferences: {
    notifications: true,
    autoSave: true,
    language: "en",
  },
  isLoading: false,
  error: null,
};

// Action types
type AppActionType =
  | { type: "SET_USER"; payload: unknown }
  | { type: "SET_THEME"; payload: AppState["theme"] }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | {
      type: "UPDATE_GLOBAL_PREFERENCES";
      payload: Partial<AppState["globalPreferences"]>;
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET_STATE" };

/**
 * Pure reducer for all app-level state transitions.
 *
 * @param state Current app state snapshot.
 * @param action Transition descriptor.
 * @returns Next app state derived from the provided action.
 */
function appReducer(state: AppState, action: AppActionType): AppState {
  // Keep reducer pure so state transitions are predictable and testable.
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };
    case "SET_AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case "UPDATE_GLOBAL_PREFERENCES":
      return {
        ...state,
        globalPreferences: {
          ...state.globalPreferences,
          ...action.payload,
        },
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: AppState;
  actions: AppActions;
}

// Create context
const AppContext = createContext<AppContextType | null>(null);

// Provider component
interface AppProviderProps {
  children: ReactNode;
  initialUser?: unknown;
}

/**
 * React provider that exposes global app state and actions.
 *
 * @param children Descendant tree that consumes app state.
 * @param initialUser Optional server-hydrated user payload.
 */
export function AppProvider({ children, initialUser }: AppProviderProps) {
  // Boot state can be hydrated with a server-provided user to avoid auth flicker.
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    user: initialUser || null,
    isAuthenticated: !!initialUser,
  });

  const { data: session, status } = useSession();
  const hasSignedOutRef = useRef(false);

  // Actions
  const actions: AppActions = {
    setTheme: useCallback((theme: AppState["theme"]) => {
      dispatch({ type: "SET_THEME", payload: theme });

      // Only run in browser environment
      if (typeof window === "undefined") return;

      // Theme is applied via the root `dark` class so all tailwind `dark:` variants react.
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        // System theme
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (prefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }

      // Theme preference not persisted
    }, []),

    updateGlobalPreferences: useCallback(
      (preferences: Partial<AppState["globalPreferences"]>) => {
        dispatch({ type: "UPDATE_GLOBAL_PREFERENCES", payload: preferences });

        // Only run in browser environment
        if (typeof window === "undefined") return;

        // Preferences not persisted
      },
      []
    ),

    signOut: useCallback(async () => {
      // Mark loading first so UI can disable actions during sign-out.
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        // Clear user service token
        userService.clearToken();

        // No storage to clear

        // NextAuth signOut handles token/session cleanup and route transition.
        await signOut({ callbackUrl: "/login" });
      } catch (error) {
        console.error("Error during sign out:", error);
      } finally {
        dispatch({ type: "RESET_STATE" });
      }
    }, []),

    refreshUser: useCallback(async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        // In a real app, this would fetch user data from an API
        // For now, we'll just simulate a refresh
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update user data if needed
        dispatch({ type: "SET_LOADING", payload: false });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to refresh user data" });
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }, []),
  };

  // Mirror NextAuth session into app context so feature modules read one source of truth.
  useEffect(() => {
    // Wait until session state is resolved; otherwise we could overwrite user too early.
    if (status === "loading") return;

    if (session?.user && session.accessToken) {
      // Set user service token
      userService.setToken(session.accessToken);

      // Set user in app state
      dispatch({ type: "SET_USER", payload: session.userData || session.user });
      dispatch({ type: "SET_AUTHENTICATED", payload: true });
    } else {
      // Ensure stale auth state is cleared if session disappears.
      // Clear user if not authenticated
      dispatch({ type: "SET_USER", payload: null });
      dispatch({ type: "SET_AUTHENTICATED", payload: false });
    }
  }, [session, status]);

  useEffect(() => {
    // Guard against repeated token-expiry sign-outs from repeated renders.
    if (status !== "authenticated") return;
    if (session?.error !== "TokenExpired") return;
    if (hasSignedOutRef.current) return;
    hasSignedOutRef.current = true;
    actions.signOut();
  }, [actions.signOut, session?.error, status]);

  // Initialize theme on mount
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    // No saved preferences to load
  }, []); // Remove actions dependency

  // Keep DOM theme in sync when the app is in "system" mode.
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    if (state.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const root = document.documentElement;
        if (mediaQuery.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      handleChange(); // Apply initial state

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    return undefined;
  }, [state.theme]);

  const contextValue: AppContextType = {
    state,
    actions,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

/**
 * Hook to consume global app context.
 *
 * @throws Error when used outside `AppProvider`.
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Export context for testing
export { AppContext };
