/**
 * Reading lists query hook.
 *
 * Handles list fetching with optional embedded books and supports standardized
 * cache/stale/retry/refetch semantics via `useDataQuery`.
 */
import { useMemo } from "react";
import { ReadingList } from "../../../types/library";
import { libraryService } from "../../services/libraryService";
import { UseReadingListsOptions, cacheKeys } from "./types";
import { useDataQuery } from "./useDataQuery";

/**
 * Fetches and manages reading list collection state.
 *
 * @param options Hook behavior controls (include books, cache/refetch/retry policy).
 * @returns Query state with refetch/mutate helpers.
 */
export function useReadingLists(options: UseReadingListsOptions = {}) {
  const {
    enabled = true,
    includeBooks = false,
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
    () => JSON.stringify(cacheKeys.readingLists(includeBooks)),
    [includeBooks]
  );

  return useDataQuery<ReadingList[]>({
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
      const response = await libraryService.getReadingLists({ includeBooks });
      return response.data as unknown as ReadingList[];
    },
  });
}
