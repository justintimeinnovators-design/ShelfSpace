/**
 * Single-book query hook.
 *
 * Wraps library-service detail fetch with standardized query semantics from
 * `useDataQuery` (cache/stale/retry/refetch/mutate behavior).
 */
import { useMemo } from "react";
import { Book } from "../../../types/book";
import { libraryService } from "../../services/libraryService";
import { UseBookOptions, cacheKeys } from "./types";
import { useDataQuery } from "./useDataQuery";

/**
 * Fetches one book by id with cached query semantics.
 *
 * @param bookId Target book identifier.
 * @param options Hook behavior controls (cache/refetch/retry).
 * @returns Book query state and helpers.
 */
export function useBook(
  bookId: string,
  options: Omit<UseBookOptions, "bookId"> = {}
) {
  const {
    enabled = true,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
    retry = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options;

  const cacheKey = useMemo(() => JSON.stringify(cacheKeys.book(bookId)), [bookId]);

  const query = useDataQuery<Book>({
    cacheKey,
    enabled: enabled && !!bookId,
    refetchOnWindowFocus,
    refetchOnMount,
    staleTime,
    cacheTime,
    retry,
    retryDelay,
    onSuccess,
    onError,
    fetcher: async () => {
      const response = await libraryService.getBook(bookId);
      return response.data as unknown as Book;
    },
  });

  return query;
}
