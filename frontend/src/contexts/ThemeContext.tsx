// src/contexts/ThemeContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark"; // The actual applied theme (resolved from system)
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

/**
 * Theme Provider.
 * @param {
  children,
  defaultTheme = "system",
} - { children, default Theme = "system", } value.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  // Function to get the actual theme based on system preference
  const getActualTheme = useCallback((themeValue: Theme): "light" | "dark" => {
    if (themeValue === "system") {
      // Only check matchMedia in browser environment
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "light"; // Default to light on server
    }
    return themeValue;
  }, []);

  // Function to apply theme to DOM
  const applyTheme = useCallback(
    (themeValue: Theme) => {
      // Only run in browser environment
      if (typeof window === "undefined") return;

      const root = document.documentElement;
      const actual = getActualTheme(themeValue);

      if (actual === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      setActualTheme(actual);
    },
    [getActualTheme]
  );

  // Set theme function
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      applyTheme(newTheme);

      // Theme preference not persisted
    },
    [applyTheme]
  );

  // Toggle between light and dark (ignoring system)
  const toggleTheme = useCallback(() => {
    const newTheme = actualTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [actualTheme, setTheme]);

  // Initialize theme on mount
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    // Apply default theme directly
    setThemeState(defaultTheme);
    const root = document.documentElement;
    const actual =
      defaultTheme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : defaultTheme;

    if (actual === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setActualTheme(actual);
  }, [defaultTheme]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * Handle Change.
 */
      const handleChange = () => {
        // Apply theme directly to avoid dependency loop
        const root = document.documentElement;
        const actual = mediaQuery.matches ? "dark" : "light";

        if (actual === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        setActualTheme(actual);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    return undefined;
  }, [theme]); // Remove applyTheme dependency

  const contextValue: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use the theme context
/**
 * Use Theme.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Export context for testing
export { ThemeContext };
