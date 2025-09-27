// src/contexts/AppContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { signOut } from "next-auth/react";
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

// Reducer
function appReducer(state: AppState, action: AppActionType): AppState {
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

export function AppProvider({ children, initialUser }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    user: initialUser || null,
    isAuthenticated: !!initialUser,
  });

  // Actions
  const actions: AppActions = {
    setTheme: useCallback((theme: AppState["theme"]) => {
      dispatch({ type: "SET_THEME", payload: theme });

      // Apply theme to document
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

      // Persist theme preference
      localStorage.setItem("theme", theme);
    }, []),

    updateGlobalPreferences: useCallback(
      (preferences: Partial<AppState["globalPreferences"]>) => {
        dispatch({ type: "UPDATE_GLOBAL_PREFERENCES", payload: preferences });

        // Persist preferences
        const currentPrefs = JSON.parse(
          localStorage.getItem("globalPreferences") || "{}"
        );
        const updatedPrefs = { ...currentPrefs, ...preferences };
        localStorage.setItem("globalPreferences", JSON.stringify(updatedPrefs));
      },
      []
    ),

    signOut: useCallback(async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      
      try {
        // Clear user service token
        userService.clearToken();
        
        // Clear any local storage items
        localStorage.removeItem("userPreferences");
        localStorage.removeItem("chatSession");
        
        // Sign out from NextAuth
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

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | AppState["theme"]
      | null;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      // Apply theme directly without using actions to avoid dependency loop
      dispatch({ type: "SET_THEME", payload: savedTheme });

      // Apply theme to document
      const root = document.documentElement;
      if (savedTheme === "dark") {
        root.classList.add("dark");
      } else if (savedTheme === "light") {
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
    }

    const savedPreferences = localStorage.getItem("globalPreferences");
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: "UPDATE_GLOBAL_PREFERENCES", payload: preferences });
      } catch (error) {
        console.error("Failed to parse saved preferences:", error);
      }
    }
  }, []); // Remove actions dependency

  // Listen for system theme changes
  useEffect(() => {
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
  }, [state.theme]);

  const contextValue: AppContextType = {
    state,
    actions,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Export context for testing
export { AppContext };
