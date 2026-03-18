// src/contexts/OptimizedProvider.tsx
"use client";

import React, { createContext, useContext, useMemo, ReactNode } from "react";

// Generic optimized context provider that prevents unnecessary re-renders
interface OptimizedContextValue<T> {
  value: T;
  version: number;
}

/**
 * Create Optimized Context.
 */
export function createOptimizedContext<T>() {
  return createContext<OptimizedContextValue<T> | null>(null);
}

interface OptimizedProviderProps<T> {
  children: ReactNode;
  value: T;
  context: React.Context<OptimizedContextValue<T> | null>;
  isEqual?: (prev: T, next: T) => boolean;
}

/**
 * Optimized Provider.
 * @param {
  children,
  value,
  context,
  isEqual: _isEqual = (prev, next) => prev === next,
} - { children, value, context, is Equal: is Equal = (prev, next) => prev === next, } value.
 */
export function OptimizedProvider<T>({
  children,
  value,
  context,
  isEqual: _isEqual = (prev, next) => prev === next,
}: OptimizedProviderProps<T>) {
  const contextValue = useMemo(() => {
    // Use a version number to force re-renders only when needed
    const version = Date.now();
    return { value, version };
  }, [value]);

  // Memoize the provider to prevent re-renders when value hasn't changed
  const memoizedProvider = useMemo(() => {
    return React.createElement(
      context.Provider,
      { value: contextValue },
      children
    );
  }, [context.Provider, contextValue, children]);

  return memoizedProvider;
}

// Hook factory for optimized contexts
/**
 * Create Optimized Hook.
 * @param context - context value.
 * @param contextName - context Name value.
 */
export function createOptimizedHook<T>(
  context: React.Context<OptimizedContextValue<T> | null>,
  contextName: string
) {
  return function useOptimizedContext() {
    const contextValue = useContext(context);
    if (!contextValue) {
      throw new Error(
        `useOptimizedContext must be used within a ${contextName}Provider`
      );
    }
    return contextValue.value;
  };
}

// Selector hook for fine-grained subscriptions
/**
 * Create Selector Hook.
 * @param context - context value.
 * @param contextName - context Name value.
 */
export function createSelectorHook<T>(
  context: React.Context<OptimizedContextValue<T> | null>,
  contextName: string
) {
  return function useSelector<S>(
    selector: (state: T) => S,
    _isEqual?: (prev: S, next: S) => boolean
  ) {
    const contextValue = useContext(context);
    if (!contextValue) {
      throw new Error(
        `useSelector must be used within a ${contextName}Provider`
      );
    }

    return useMemo(() => {
      return selector(contextValue.value);
    }, [contextValue.value, selector]);
  };
}
