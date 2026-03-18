"use client";

// Performance monitoring utilities for navigation
export class NavigationPerformanceMonitor {
  private static instance: NavigationPerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private renderCounts: Map<string, number> = new Map();

/**
 * Get Instance.
 * @returns NavigationPerformanceMonitor.
 */
  static getInstance(): NavigationPerformanceMonitor {
    if (!NavigationPerformanceMonitor.instance) {
      NavigationPerformanceMonitor.instance =
        new NavigationPerformanceMonitor();
    }
    return NavigationPerformanceMonitor.instance;
  }

  // Track navigation timing
/**
 * Start Navigation.
 * @param route - route value.
 */
  startNavigation(route: string): void {
    this.metrics.set(`nav-start-${route}`, performance.now());
  }

/**
 * End Navigation.
 * @param route - route value.
 */
  endNavigation(route: string): void {
    const startTime = this.metrics.get(`nav-start-${route}`);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.set(`nav-duration-${route}`, duration);

      // Log slow navigations in development
      if (process.env.NODE_ENV === "development" && duration > 100) {
        console.warn(`Slow navigation to ${route}: ${duration.toFixed(2)}ms`);
      }
    }
  }

  // Track component render counts
/**
 * Track Render.
 * @param componentName - component Name value.
 */
  trackRender(componentName: string): void {
    const currentCount = this.renderCounts.get(componentName) || 0;
    this.renderCounts.set(componentName, currentCount + 1);

    // Log excessive re-renders in development
    if (process.env.NODE_ENV === "development" && currentCount > 10) {
      console.warn(
        `Component ${componentName} has rendered ${currentCount} times`
      );
    }
  }

  // Get performance metrics
/**
 * Get Metrics.
 * @returns Record<string, number>.
 */
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Get render counts
/**
 * Get Render Counts.
 * @returns Record<string, number>.
 */
  getRenderCounts(): Record<string, number> {
    return Object.fromEntries(this.renderCounts);
  }

  // Reset metrics
/**
 * Reset.
 */
  reset(): void {
    this.metrics.clear();
    this.renderCounts.clear();
  }
}

// Hook for tracking component renders
/**
 * Use Render Tracking.
 * @param componentName - component Name value.
 */
export function useRenderTracking(componentName: string): void {
  if (process.env.NODE_ENV === "development") {
    const monitor = NavigationPerformanceMonitor.getInstance();
    monitor.trackRender(componentName);
  }
}

// Debounce utility for performance optimization
/**
 * Debounce.
 * @param func - func value.
 * @param wait - wait value.
 * @returns (...args: Parameters<T>) => void.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for performance optimization
/**
 * Throttle.
 * @param func - func value.
 * @param limit - limit value.
 * @returns (...args: Parameters<T>) => void.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
