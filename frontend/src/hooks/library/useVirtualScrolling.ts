"use client";

import { useState, useEffect, useMemo } from "react";

interface UseVirtualScrollingOptions {
  itemCount: number;
  viewMode: "grid" | "list";
  threshold?: number;
}

interface UseVirtualScrollingReturn {
  shouldUseVirtual: boolean;
  itemHeight: number;
  itemsPerRow: number;
  overscan: number;
}

/**
 * Use Virtual Scrolling.
 * @param {
  itemCount,
  viewMode,
  threshold = 50,
} - { item Count, view Mode, threshold = 50, } value.
 * @returns UseVirtualScrollingReturn.
 */
export function useVirtualScrolling({
  itemCount,
  viewMode,
  threshold = 50,
}: UseVirtualScrollingOptions): UseVirtualScrollingReturn {
  const [_containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
/**
 * Update Height.
 */
    const updateHeight = () => {
      setContainerHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const shouldUseVirtual = useMemo(() => {
    return itemCount > threshold;
  }, [itemCount, threshold]);

  const itemHeight = useMemo(() => {
    return viewMode === "grid" ? 400 : 120;
  }, [viewMode]);

  const itemsPerRow = useMemo(() => {
    if (viewMode === "list") return 1;
    
    const containerWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    if (containerWidth < 768) return 1;
    if (containerWidth < 1024) return 2;
    if (containerWidth < 1280) return 3;
    return 4;
  }, [viewMode]);

  const overscan = useMemo(() => {
    return Math.ceil(itemsPerRow * 2);
  }, [itemsPerRow]);

  return {
    shouldUseVirtual,
    itemHeight,
    itemsPerRow,
    overscan,
  };
}