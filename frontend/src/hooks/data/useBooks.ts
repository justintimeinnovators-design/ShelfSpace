/**
 * Books collection query hook.
 *
 * Provides standardized query behavior for paginated books data and exposes
 * pagination helpers used by library/discovery UIs.
 */
import { useMemo, useCallback } from "react";
import { Book } from "../../../types/book";
import { libraryService } from "../../services/libraryService";
import { UseBooksOptions, cacheKeys } from "./types";
import { useDataQuery } from "./useDataQuery";

interface BooksQueryData {
  data: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Fetches and manages paginated books data.
 *
 * @param options Hook behavior controls (pagination, cache/retry/refetch policy).
 * @returns Query state, pagination helpers, and mutation/refetch functions.
 */
export function useBooks(options: UseBooksOptions = {}) {
  const {
    enabled = true,
    listId,
    filter,
    page = 1,
    limit = 20,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
    retry = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options;

  const cacheKey = useMemo(
    () => JSON.stringify(cacheKeys.books({ listId, filter, page, limit })),
    [listId, filter, page, limit]
  );

  const query = useDataQuery<BooksQueryData>({
    cacheKey,
    enabled,
    refetchOnWindowFocus,
    refetchOnMount,
    staleTime,
    cacheTime,
    retry,
    retryDelay,
    onSuccess,
    onError,
    fetcher: async () => {
      const response = await libraryService.getBooks({
        ...(listId && { listId }),
        ...(filter && { filter }),
        page,
        limit,
        options: { timeout: 10000 },
      } as any);

      return {
        data: response.data as unknown as Book[],
        pagination: response.pagination,
      };
    },
  });

  const goToPage = useCallback(
    (newPage: number) => {
      const pagination = query.data?.pagination;
      if (!pagination) return;
      if (newPage < 1 || newPage > pagination.totalPages) return;
      // Page is controlled by caller options; force refresh with current inputs.
      query.refetch();
    },
    [query]
  );

  const nextPage = useCallback(() => {
    const pagination = query.data?.pagination;
    if (!pagination?.hasNext) return;
    goToPage(pagination.page + 1);
  }, [query.data?.pagination, goToPage]);

  const prevPage = useCallback(() => {
    const pagination = query.data?.pagination;
    if (!pagination?.hasPrev) return;
    goToPage(pagination.page - 1);
  }, [query.data?.pagination, goToPage]);

  const pagination = query.data?.pagination;

  return {
    data: query.data?.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isValidating: query.isValidating,
    lastFetched: query.lastFetched,
    refetch: query.refetch,
    mutate: (
      updater: Book[] | ((prev: Book[] | null) => Book[] | null),
      shouldRevalidate = true
    ) => {
      query.mutate((prev) => {
        const prevBooks = prev?.data || null;
        const nextBooks = typeof updater === "function" ? updater(prevBooks) : updater;
        if (!prev) {
          return {
            data: nextBooks || [],
            pagination: {
              page,
              limit,
              total: nextBooks?.length || 0,
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
        return {
          ...prev,
          data: nextBooks || [],
        };
      }, shouldRevalidate);
    },
    isStale: query.isStale,
    page: pagination?.page ?? page,
    limit: pagination?.limit ?? limit,
    total: pagination?.total ?? 0,
    hasMore: pagination?.hasNext ?? false,
    pagination: pagination ?? null,
    goToPage,
    nextPage,
    prevPage,
    canGoNext: pagination?.hasNext ?? false,
    canGoPrev: pagination?.hasPrev ?? false,
  };
}
