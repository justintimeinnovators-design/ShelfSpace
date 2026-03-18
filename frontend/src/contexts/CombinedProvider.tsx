// src/contexts/CombinedProvider.tsx
"use client";

import { ReactNode } from "react";
import { AppProvider } from "./AppContext";
import { ThemeProvider } from "./ThemeContext";

interface CombinedProviderProps {
  children: ReactNode;
  initialUser?: any;
  defaultTheme?: "light" | "dark" | "system";
}

/**
 * Combined Provider.
 * @param {
  children,
  initialUser,
  defaultTheme = "system",
} - { children, initial User, default Theme = "system", } value.
 */
export function CombinedProvider({
  children,
  initialUser,
  defaultTheme = "system",
}: CombinedProviderProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <AppProvider initialUser={initialUser}>{children}</AppProvider>
    </ThemeProvider>
  );
}

// Re-export hooks for convenience
export { useApp } from "./AppContext";
export { useTheme } from "./ThemeContext";
