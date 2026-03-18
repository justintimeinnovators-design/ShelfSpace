"use client";

import React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  horizontal?: boolean;
}

interface VirtualizationResult<T> {
  virtualItems: Array<{
    index: number;
    start: number;
    end: number;
    item: T;
  }>;
  totalHeight: number;
  scrollToIndex: (index: number) => void;
  scrollToOffset: (offset: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Use Virtualization.
 * @param items - items value.
 * @param options - options value.
 * @returns VirtualizationResult<T>.
 */
export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
): VirtualizationResult<T> {
  const { itemHeight, containerHeight, overscan = 5, horizontal = false } = options;
  
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollOffset / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [scrollOffset, itemHeight, containerHeight, items.length, overscan]);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        item: items[i]
      });
    }
    return result;
  }, [visibleRange, itemHeight, items]);

  // Total height calculation
  const totalHeight = items.length * itemHeight;

  // Scroll handlers
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    const newOffset = horizontal ? target.scrollLeft : target.scrollTop;
    setScrollOffset(newOffset);
  }, [horizontal]);

  // Scroll to index
  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      const offset = index * itemHeight;
      if (horizontal) {
        containerRef.current.scrollLeft = offset;
      } else {
        containerRef.current.scrollTop = offset;
      }
    }
  }, [itemHeight, horizontal]);

  // Scroll to offset
  const scrollToOffset = useCallback((offset: number) => {
    if (containerRef.current) {
      if (horizontal) {
        containerRef.current.scrollLeft = offset;
      } else {
        containerRef.current.scrollTop = offset;
      }
    }
  }, [horizontal]);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [handleScroll]);

  return {
    virtualItems: virtualItems as VirtualizationResult<T>['virtualItems'],
    totalHeight,
    scrollToIndex,
    scrollToOffset,
    containerRef: containerRef as React.RefObject<HTMLDivElement>
  };
}

// Virtual List Component
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  horizontal?: boolean;
}

/**
 * Virtual List.
 * @param {
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = "",
  overscan = 5,
  horizontal = false
} - { items, item Height, container Height, render Item, class Name = "", overscan = 5, horizontal = false } value.
 */
export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = "",
  overscan = 5,
  horizontal = false
}: VirtualListProps<T>) {
  const {
    virtualItems,
    totalHeight,
    scrollToIndex: _scrollToIndex,
    containerRef
  } = useVirtualization(items, {
    itemHeight,
    containerHeight,
    overscan,
    horizontal
  });

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{
        height: containerHeight,
        width: horizontal ? containerHeight : 'auto'
      }}
    >
      <div
        style={{
          height: horizontal ? '100%' : totalHeight,
          width: horizontal ? totalHeight : '100%',
          position: 'relative'
        }}
      >
        {virtualItems.map(({ index, start, item }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: horizontal ? 0 : start,
              left: horizontal ? start : 0,
              height: horizontal ? '100%' : itemHeight,
              width: horizontal ? itemHeight : '100%'
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Virtual Grid Component
interface VirtualGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

/**
 * Virtual Grid.
 * @param {
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  renderItem,
  className = "",
  overscan = 5
} - { items, item Width, item Height, container Width, container Height, render Item, class Name = "", overscan = 5 } value.
 */
export function VirtualGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  renderItem,
  className = "",
  overscan = 5
}: VirtualGridProps<T>) {
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate grid dimensions
  const itemsPerRow = Math.floor(containerWidth / itemWidth);
  const totalRows = Math.ceil(items.length / itemsPerRow);
  const totalHeight = totalRows * itemHeight;

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startRow = Math.floor(scrollOffset.y / itemHeight);
    const endRow = Math.min(
      startRow + Math.ceil(containerHeight / itemHeight),
      totalRows - 1
    );

    const startCol = Math.floor(scrollOffset.x / itemWidth);
    const endCol = Math.min(
      startCol + Math.ceil(containerWidth / itemWidth),
      itemsPerRow - 1
    );

    return {
      startRow: Math.max(0, startRow - overscan),
      endRow: Math.min(totalRows - 1, endRow + overscan),
      startCol: Math.max(0, startCol - overscan),
      endCol: Math.min(itemsPerRow - 1, endCol + overscan)
    };
  }, [scrollOffset, itemHeight, itemWidth, containerHeight, containerWidth, totalRows, itemsPerRow, overscan]);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const result = [];
    for (let row = visibleRange.startRow; row <= visibleRange.endRow; row++) {
      for (let col = visibleRange.startCol; col <= visibleRange.endCol; col++) {
        const index = row * itemsPerRow + col;
        if (index < items.length) {
          result.push({
            index,
            row,
            col,
            startX: col * itemWidth,
            startY: row * itemHeight,
            item: items[index]
          });
        }
      }
    }
    return result;
  }, [visibleRange, itemWidth, itemHeight, itemsPerRow, items]);

  // Scroll handler
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollOffset({
      x: target.scrollLeft,
      y: target.scrollTop
    });
  }, []);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{
        height: containerHeight,
        width: containerWidth
      }}
    >
      <div
        style={{
          height: totalHeight,
          width: itemsPerRow * itemWidth,
          position: 'relative'
        }}
      >
        {virtualItems.map(({ index, startX, startY, item }) => item ? (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: startY,
              left: startX,
              height: itemHeight,
              width: itemWidth
            }}
          >
            {renderItem(item as T, index)}
          </div>
        ) : null)}
      </div>
    </div>
  );
}
