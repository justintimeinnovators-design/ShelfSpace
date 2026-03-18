"use client";

import { useMemo } from "react";

export type BookCardSize = "small" | "medium" | "large";

export interface SizeConfig {
  image: { width: string; height: string };
  card: string;
  title: string;
  author: string;
  spacing: string;
}

/**
 * Use Book Card Size.
 * @param size - size value.
 * @returns SizeConfig.
 */
export function useBookCardSize(size: BookCardSize = "medium"): SizeConfig {
  return useMemo(() => {
    const sizeConfigs: Record<BookCardSize, SizeConfig> = {
      small: {
        image: { width: "w-12", height: "h-16" },
        card: "p-3",
        title: "text-sm",
        author: "text-xs",
        spacing: "space-x-2",
      },
      medium: {
        image: { width: "w-16", height: "h-24" },
        card: "p-4",
        title: "text-base",
        author: "text-sm",
        spacing: "space-x-4",
      },
      large: {
        image: { width: "w-20", height: "h-30" },
        card: "p-6",
        title: "text-lg",
        author: "text-base",
        spacing: "space-x-6",
      },
    };

    return sizeConfigs[size];
  }, [size]);
}
