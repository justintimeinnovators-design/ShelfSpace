import { useState, useEffect, useCallback, useRef } from "react";
import { BaseHookState } from "./types";

/**
 * Shared query behavior options for data hooks.
 */
export interface UseDataQueryOptions<TData> {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
  retryDelay?: number;
  onSuccess?: ((data: TData) => void) | undefined;
  onError?: ((error: Error) => void) | undefined;
}

interface UseDataQueryParams<TData> extends UseDataQueryOptions<TData> {
  cacheKey: string;
  fetcher: () => Promise<TData>;
}

/**
 * Standardized async query primitive used by feature data hooks.
 *
 * Provides consistent behavior for:
 * - caching + stale checks
 * - refetch on mount/focus
 * - retry policy
 * - optimistic local mutate
 */
export function useDataQuery<TData>({
  cacheKey,
  fetcher,
  enabled = true,
  refetchOnWindowFocus = true,
  refetchOnMount = true,
  staleTime = 5 * 60 * 1000,
  cacheTime = 10 * 60 * 1000,
  retry = 3,
  retryDelay = 1000,
  onSuccess,
  onError,
}: UseDataQueryParams<TData>) {
  const [state, setState] = useState<BaseHookState<TData>>({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    isValidating: false,
    lastFetched: null,
  });

  const retryCountRef = useRef(0);
  const cacheRef = useRef<Map<string, { data: TData; timestamp: number }>>(
    new Map()
  );
  const abortControllerRef = useRef<AbortController | null>(null);
  // Tracked in a ref (not state) so isStale doesn't change on every fetch,
  // which would otherwise cause runQuery → useEffect → runQuery infinite loops.
  const lastFetchedRef = useRef<number | null>(null);
  // Refs for callbacks so runQuery doesn't need them as deps. Callers often
  // pass inline arrow functions which get a new reference on every render.
  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  fetcherRef.current = fetcher;
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  const isStale = useCallback(() => {
    if (!lastFetchedRef.current) return true;
    return Date.now() - lastFetchedRef.current > staleTime;
  }, [staleTime]);

  const getCachedData = useCallback(() => {
    const cached = cacheRef.current.get(cacheKey);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cacheTime;
    if (isExpired) {
      cacheRef.current.delete(cacheKey);
      return null;
    }

    return cached.data;
  }, [cacheKey, cacheTime]);

  const setCachedData = useCallback(
    (data: TData) => {
      cacheRef.current.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    },
    [cacheKey]
  );

  const runQuery = useCallback(
    async (isRefetch = false) => {
      if (!enabled) return null;

      if (!isRefetch) {
        const cachedData = getCachedData();
        if (cachedData && !isStale()) {
          const now = Date.now();
          lastFetchedRef.current = now;
          setState((prev) => ({
            ...prev,
            data: cachedData,
            isLoading: false,
            isError: false,
            error: null,
            lastFetched: now,
          }));
          return cachedData;
        }
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setState((prev) => ({
        ...prev,
        isLoading: !prev.data,
        isValidating: true,
        isError: false,
        error: null,
      }));

      try {
        const data = await fetcherRef.current();

        if (abortControllerRef.current?.signal.aborted) return null;

        const now = Date.now();
        lastFetchedRef.current = now;
        setCachedData(data);
        setState((prev) => ({
          ...prev,
          data,
          isLoading: false,
          isValidating: false,
          isError: false,
          error: null,
          lastFetched: now,
        }));

        retryCountRef.current = 0;
        onSuccessRef.current?.(data);
        return data;
      } catch (error) {
        if (abortControllerRef.current?.signal.aborted) return null;

        const errorObj =
          error instanceof Error ? error : new Error("Unknown error");

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isValidating: false,
          isError: true,
          error: errorObj,
        }));

        onErrorRef.current?.(errorObj);

        if (
          retry &&
          retryCountRef.current < (typeof retry === "number" ? retry : 3)
        ) {
          retryCountRef.current++;
          setTimeout(() => {
            runQuery(isRefetch);
          }, retryDelay * retryCountRef.current);
        }

        throw errorObj;
      }
    },
    // fetcher/onSuccess/onError intentionally omitted — accessed via refs so
    // inline arrow function callers don't cause runQuery to be recreated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, getCachedData, isStale, retry, retryDelay, setCachedData]
  );

  const refetch = useCallback(() => runQuery(true), [runQuery]);

  const mutate = useCallback(
    (
      updater: TData | ((prev: TData | null) => TData | null),
      shouldRevalidate = true
    ) => {
      const now = Date.now();
      lastFetchedRef.current = now;
      setState((prev) => {
        const newData =
          typeof updater === "function"
            ? (updater as (prev: TData | null) => TData | null)(prev.data)
            : updater;

        return {
          ...prev,
          data: newData,
          lastFetched: now,
        };
      });

      if (shouldRevalidate) {
        runQuery(true);
      }
    },
    [runQuery]
  );

  useEffect(() => {
    if (enabled && refetchOnMount) {
      runQuery(false);
    }
  }, [enabled, refetchOnMount, runQuery]);

  useEffect(() => {
    if (!enabled || !refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (isStale()) {
        runQuery(false);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [enabled, refetchOnWindowFocus, isStale, runQuery]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    mutate,
    isStale: isStale(),
  };
}
