/**
 * React debugging utilities for development
 */

import React, { useEffect, useRef } from "react";
import { debugHelpers } from "./errorLogger";

// Environment check
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Hook to debug component renders and prop changes
 */
export function useDebugRender(
  componentName: string,
  props: Record<string, unknown> = {}
) {
  const renderCount = useRef(0);
  const previousProps = useRef<Record<string, unknown> | undefined>(undefined);

  useEffect(() => {
    if (!isDevelopment) return;

    renderCount.current += 1;

    // Log render information
    debugHelpers.logRender(componentName, {
      renderCount: renderCount.current,
      props,
    });

    // Check for prop changes
    if (previousProps.current) {
      const changedProps = Object.keys(props).filter(
        (key) => props[key] !== previousProps.current?.[key]
      );

      if (changedProps.length > 0) {
        console.log(
          `[PROPS_CHANGED] ${componentName}`,
          changedProps.map((key) => ({
            prop: key,
            from: previousProps.current?.[key],
            to: props[key],
          }))
        );
      }
    }

    previousProps.current = { ...props };
  });

  return renderCount.current;
}

/**
 * Hook to debug state changes
 */
export function useDebugState<T>(stateName: string, value: T): T {
  const previousValue = useRef<T | undefined>(undefined);

  useEffect(() => {
    if (!isDevelopment) return;

    if (
      previousValue.current !== undefined &&
      previousValue.current !== value
    ) {
      debugHelpers.logStateChange(stateName, previousValue.current, value);
    }

    previousValue.current = value;
  }, [stateName, value]);

  return value;
}

/**
 * Hook to debug effect dependencies
 */
export function useDebugEffect(
  effectName: string,
  dependencies: unknown[],
  callback: () => void | (() => void)
) {
  const previousDeps = useRef<unknown[] | undefined>(undefined);

  useEffect(() => {
    if (!isDevelopment) return callback();

    if (previousDeps.current) {
      const changedDeps = dependencies
        .map((dep, index) => ({
          index,
          dep,
          prev: previousDeps.current?.[index],
        }))
        .filter(({ dep, prev }) => dep !== prev);

      if (changedDeps.length > 0) {
        console.log(
          `⚡ Effect ${effectName} - Dependencies changed:`,
          changedDeps
        );
      }
    }

    previousDeps.current = [...dependencies];
    return callback();
  }, dependencies);
}

/**
 * Performance measurement utilities
 */
export const performanceDebug = {
  /**
   * Measure component render time
   */
  measureRender: <T extends Record<string, unknown>>(
    componentName: string,
    Component: React.ComponentType<T>
  ): React.ComponentType<T> => {
    if (!isDevelopment) return Component;

    return function MeasuredComponent(props: T) {
      debugHelpers.time(`${componentName} render`);

      useEffect(() => {
        debugHelpers.timeEnd(`${componentName} render`);
      });

      return React.createElement(Component, props);
    };
  },

  /**
   * Measure async operation time
   */
  measureAsync: async <T>(
    label: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    if (!isDevelopment) return operation();

    const start = globalThis.performance.now();
    try {
      const result = await operation();
      const end = globalThis.performance.now();
      console.log(`[PERF] ${label}: ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = globalThis.performance.now();
      console.log(`[PERF] ${label} (failed): ${(end - start).toFixed(2)}ms`);
      throw error;
    }
  },

  /**
   * Measure synchronous operation time
   */
  measureSync: <T>(label: string, operation: () => T): T => {
    if (!isDevelopment) return operation();

    const start = globalThis.performance.now();
    try {
      const result = operation();
      const end = globalThis.performance.now();
      console.log(`[PERF] ${label}: ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = globalThis.performance.now();
      console.log(`[PERF] ${label} (failed): ${(end - start).toFixed(2)}ms`);
      throw error;
    }
  },
};

/**
 * Memory usage debugging
 */
export const memory = {
  /**
   * Log current memory usage (if available)
   */
  logUsage: (label?: string) => {
    if (!isDevelopment || typeof window === "undefined") return;

    // @ts-expect-error - memory API is not in all browsers
    if (window.performance?.memory) {
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } =
        // @ts-expect-error - memory API is not in all browsers
        window.performance.memory;
      console.log(`🧠 Memory${label ? ` (${label})` : ""}:`, {
        used: `${(usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
        usage: `${((usedJSHeapSize / jsHeapSizeLimit) * 100).toFixed(2)}%`,
      });
    }
  },

  /**
   * Monitor memory usage over time
   */
  startMonitoring: (intervalMs: number = 5000) => {
    if (!isDevelopment || typeof window === "undefined") return;

    const interval = setInterval(() => {
      memory.logUsage("Monitor");
    }, intervalMs);

    return () => clearInterval(interval);
  },
};

/**
 * Component tree debugging
 */
export const componentTree = {
  /**
   * Log component mount/unmount
   */
  useLifecycle: (componentName: string) => {
    useEffect(() => {
      if (!isDevelopment) return;

      console.log(`🟢 Mounted: ${componentName}`);

      return () => {
        console.log(`🔴 Unmounted: ${componentName}`);
      };
    }, [componentName]);
  },

  /**
   * Log component hierarchy
   */
  logHierarchy: (componentName: string, level: number = 0) => {
    if (!isDevelopment) return;

    const indent = "  ".repeat(level);
    console.log(`${indent}├─ ${componentName}`);
  },
};

/**
 * State debugging utilities
 */
export const stateDebug = {
  /**
   * Create a debug wrapper for useState
   */
  useState: <T>(
    initialValue: T,
    stateName: string
  ): [T, (value: T | ((prev: T) => T)) => void] => {
    const [value, setValue] = React.useState(initialValue);

/**
 * Debug Set Value.
 * @param newValue - new Value value.
 */
    const debugSetValue = (newValue: T | ((prev: T) => T)) => {
      if (!isDevelopment) {
        setValue(newValue);
        return;
      }

      const actualNewValue =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(value)
          : newValue;

      debugHelpers.logStateChange(stateName, value, actualNewValue);
      setValue(newValue);
    };

    return [value, debugSetValue];
  },

  /**
   * Create a debug wrapper for useReducer
   */
  useReducer: <S, A>(
    reducer: (state: S, action: A) => S,
    initialState: S,
    reducerName: string
  ): [S, (action: A) => void] => {
/**
 * Debug Reducer.
 * @param state - state value.
 * @param action - action value.
 * @returns S.
 */
    const debugReducer = (state: S, action: A): S => {
      if (!isDevelopment) return reducer(state, action);

      const newState = reducer(state, action);
      console.log(`[REDUCER] ${reducerName} - Action:`, action);
      console.log(`[REDUCER] ${reducerName} - State:`, { from: state, to: newState });

      debugHelpers.logStateChange(
        `${reducerName} (${JSON.stringify(action)})`,
        state,
        newState
      );

      return newState;
    };

    return React.useReducer(debugReducer, initialState);
  },
};

/**
 * API debugging utilities
 */
export const apiDebug = {
  /**
   * Wrap fetch with debugging
   */
  fetch: async (url: string, options?: RequestInit): Promise<Response> => {
    const method = options?.method || "GET";

    debugHelpers.logApiCall(method, url, options?.body);

    const start = performance.now();

    try {
      const response = await fetch(url, options);
      const end = performance.now();

      if (isDevelopment) {
        console.log(
          `🌐 API Response: ${method} ${url} - ${response.status} (${(
            end - start
          ).toFixed(2)}ms)`
        );
      }

      return response;
    } catch (error) {
      const end = performance.now();

      if (isDevelopment) {
        console.error(
          `🌐 API Error: ${method} ${url} - (${(end - start).toFixed(2)}ms)`,
          error
        );
      }

      throw error;
    }
  },
};

// Export all utilities
export const debug = {
  render: useDebugRender,
  state: useDebugState,
  effect: useDebugEffect,
  performance: performanceDebug,
  memory,
  componentTree,
  stateDebug,
  apiDebug,
};

export default debug;
