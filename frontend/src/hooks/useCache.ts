"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Simple cache hook
export function useCache<T>(key: string, fetcher: () => Promise<T>, ttl: number = 5 * 60 * 1000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number; ttl: number }>>(new Map());

  const fetchData = useCallback(async () => {
    const cached = cacheRef.current.get(key);
    const now = Date.now();

    // Check if cached data is still valid
    if (cached && (now - cached.timestamp) < cached.ttl) {
      setData(cached.data);
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      cacheRef.current.set(key, {
        data: result,
        timestamp: now,
        ttl
      });
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  const invalidate = useCallback(() => {
    cacheRef.current.delete(key);
    setData(null);
  }, [key]);

  const refresh = useCallback(() => {
    invalidate();
    return fetchData();
  }, [invalidate, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh, invalidate };
}

// Advanced cache with persistence
interface CacheOptions {
  ttl?: number;
  persist?: boolean;
  storage?: 'localStorage' | 'sessionStorage';
  serialize?: (data: any) => string;
  deserialize?: (data: string) => any;
}

export function useAdvancedCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000,
    persist = false,
    storage = 'localStorage',
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number; ttl: number }>>(new Map());

  // Load from persistent storage
  useEffect(() => {
    if (persist) {
      try {
        const stored = window[storage].getItem(`cache_${key}`);
        if (stored) {
          const parsed = deserialize(stored);
          const now = Date.now();
          
          if ((now - parsed.timestamp) < parsed.ttl) {
            cacheRef.current.set(key, parsed);
            setData(parsed.data);
          } else {
            window[storage].removeItem(`cache_${key}`);
          }
        }
      } catch (err) {
        console.warn('Failed to load from cache:', err);
      }
    }
  }, [key, persist, storage, deserialize]);

  // Save to persistent storage
  const saveToStorage = useCallback((cacheData: { data: T; timestamp: number; ttl: number }) => {
    if (persist) {
      try {
        window[storage].setItem(`cache_${key}`, serialize(cacheData));
      } catch (err) {
        console.warn('Failed to save to cache:', err);
      }
    }
  }, [key, persist, storage, serialize]);

  const fetchData = useCallback(async () => {
    const cached = cacheRef.current.get(key);
    const now = Date.now();

    // Check if cached data is still valid
    if (cached && (now - cached.timestamp) < cached.ttl) {
      setData(cached.data);
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      const cacheData = {
        data: result,
        timestamp: now,
        ttl
      };
      
      cacheRef.current.set(key, cacheData);
      saveToStorage(cacheData);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, saveToStorage]);

  const invalidate = useCallback(() => {
    cacheRef.current.delete(key);
    setData(null);
    
    if (persist) {
      try {
        window[storage].removeItem(`cache_${key}`);
      } catch (err) {
        console.warn('Failed to remove from cache:', err);
      }
    }
  }, [key, persist, storage]);

  const refresh = useCallback(() => {
    invalidate();
    return fetchData();
  }, [invalidate, fetchData]);

  const clearAll = useCallback(() => {
    cacheRef.current.clear();
    setData(null);
    
    if (persist) {
      try {
        const keys = Object.keys(window[storage]).filter(k => k.startsWith('cache_'));
        keys.forEach(k => window[storage].removeItem(k));
      } catch (err) {
        console.warn('Failed to clear cache:', err);
      }
    }
  }, [persist, storage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh, invalidate, clearAll };
}

// Cache manager hook
export function useCacheManager() {
  const cacheRef = useRef<Map<string, { data: any; timestamp: number; ttl: number }>>(new Map());

  const set = useCallback((key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }, []);

  const get = useCallback((key: string) => {
    const cached = cacheRef.current.get(key);
    if (!cached) return null;

    const now = Date.now();
    if ((now - cached.timestamp) >= cached.ttl) {
      cacheRef.current.delete(key);
      return null;
    }

    return cached.data;
  }, []);

  const has = useCallback((key: string) => {
    const cached = cacheRef.current.get(key);
    if (!cached) return false;

    const now = Date.now();
    if ((now - cached.timestamp) >= cached.ttl) {
      cacheRef.current.delete(key);
      return false;
    }

    return true;
  }, []);

  const deleteKey = useCallback((key: string) => {
    cacheRef.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const size = useCallback(() => {
    return cacheRef.current.size;
  }, []);

  const keys = useCallback(() => {
    return Array.from(cacheRef.current.keys());
  }, []);

  const cleanup = useCallback(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];

    cacheRef.current.forEach((value, key) => {
      if ((now - value.timestamp) >= value.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => cacheRef.current.delete(key));
  }, []);

  // Auto cleanup every minute
  useEffect(() => {
    const interval = setInterval(cleanup, 60 * 1000);
    return () => clearInterval(interval);
  }, [cleanup]);

  return {
    set,
    get,
    has,
    delete: deleteKey,
    clear,
    size,
    keys,
    cleanup
  };
}

// SWR-like hook
export function useSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    refreshInterval?: number;
    dedupingInterval?: number;
  } = {}
) {
  const {
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    refreshInterval,
    dedupingInterval = 2000
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const lastFetchRef = useRef<number>(0);

  const mutate = useCallback(async () => {
    const now = Date.now();
    
    // Dedupe requests
    if (now - lastFetchRef.current < dedupingInterval) {
      return data;
    }

    lastFetchRef.current = now;
    setIsValidating(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsValidating(false);
    }
  }, [fetcher, dedupingInterval, data]);

  // Initial fetch
  useEffect(() => {
    mutate();
  }, [mutate]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => mutate();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, mutate]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleOnline = () => mutate();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [revalidateOnReconnect, mutate]);

  // Refresh interval
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(mutate, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, mutate]);

  return { data, error, isValidating, mutate };
}
