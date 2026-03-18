"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Basic debounce hook
/**
 * Use Debounce.
 * @param value - value value.
 * @param delay - delay value.
 * @returns T.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Debounced callback hook
/**
 * Use Debounced Callback.
 * @param callback - callback value.
 * @param delay - delay value.
 * @returns T.
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Debounced state hook
/**
 * Use Debounced State.
 * @param initialValue - initial Value value.
 * @param delay - delay value.
 * @returns [T, T, (value: T) => void].
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [value, debouncedValue, setValue];
}

// Advanced debounce hook with options
interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/**
 * Use Advanced Debounce.
 * @param callback - callback value.
 * @param delay - delay value.
 * @param options - options value.
 * @returns T.
 */
export function useAdvancedDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: DebounceOptions = {}
): T {
  const { leading = false, trailing = true, maxWait } = options;
  
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const maxTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastCallTimeRef = useRef<number | undefined>(undefined);
  const lastInvokeTimeRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);
  const lastThisRef = useRef<any>(undefined);

  const debouncedCallback = useCallback(
    function(this: any, ...args: Parameters<T>) {
      const now = Date.now();
      const timeSinceLastCall = now - (lastCallTimeRef.current || 0);
      const timeSinceLastInvoke = now - lastInvokeTimeRef.current;

      lastArgsRef.current = args;
      lastThisRef.current = this;
      lastCallTimeRef.current = now;

      const isInvoking = leading && timeSinceLastCall >= delay;
      const shouldInvoke = timeSinceLastCall >= delay || 
                          (maxWait && timeSinceLastInvoke >= maxWait);

      if (isInvoking) {
        lastInvokeTimeRef.current = now;
        callback.apply(this, args);
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (shouldInvoke) {
        lastInvokeTimeRef.current = now;
        callback.apply(this, args);
      } else if (trailing) {
        timeoutRef.current = setTimeout(() => {
          lastInvokeTimeRef.current = Date.now();
          callback.apply(lastThisRef.current, lastArgsRef.current!);
        }, delay - timeSinceLastCall);
      }

      if (maxWait && !maxTimeoutRef.current) {
        maxTimeoutRef.current = setTimeout(() => {
          lastInvokeTimeRef.current = Date.now();
          callback.apply(lastThisRef.current, lastArgsRef.current!);
        }, maxWait);
      }
    },
    [callback, delay, leading, trailing, maxWait]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Throttle hook
/**
 * Use Throttle.
 * @param callback - callback value.
 * @param delay - delay value.
 * @returns T.
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      if (timeSinceLastCall >= delay) {
        lastCallTimeRef.current = now;
        callback(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastCallTimeRef.current = Date.now();
          callback(...args);
          timeoutRef.current = undefined;
        }, delay - timeSinceLastCall);
      }
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

// Search debounce hook
/**
 * Use Search Debounce.
 * @param searchTerm - search Term value.
 * @param delay - delay value.
 * @returns string.
 */
export function useSearchDebounce(
  searchTerm: string,
  delay: number = 300
): string {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return debouncedSearchTerm;
}

// Resize debounce hook
/**
 * Use Resize Debounce.
 * @param callback - callback value.
 * @param delay - delay value.
 */
export function useResizeDebounce(
  callback: (width: number, height: number) => void,
  delay: number = 250
) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
/**
 * Handle Resize.
 */
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(window.innerWidth, window.innerHeight);
      }, delay);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, delay]);
}
