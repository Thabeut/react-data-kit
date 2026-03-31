import { useCallback, useEffect, useRef, useState } from "react";
import type { LoadOptions } from "../types/async-options";

interface UseAsyncOptionsArgs<TOption> {
  loadOptions?: LoadOptions<TOption>;
  pageSize?: number;
  enabled?: boolean;
}

interface UseAsyncOptionsResult<TOption> {
  options: TOption[];
  search: string;
  isLoading: boolean;
  isFetching: boolean;
  hasMore: boolean;
  setSearch: (value: string) => void;
  loadMore: () => void;
  reset: () => void;
  refetch: () => void;
}

export function useAsyncOptions<TOption>({
  loadOptions,
  pageSize = 10,
  enabled = true,
}: UseAsyncOptionsArgs<TOption>): UseAsyncOptionsResult<TOption> {
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);

  const [options, setOptions] = useState<TOption[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const requestIdRef = useRef(0);
  const loadOptionsRef = useRef(loadOptions);

  const hasLoader = Boolean(loadOptions);

  useEffect(() => {
    loadOptionsRef.current = loadOptions;
  }, [loadOptions]);

  const fetchOptions = useCallback(
    async (nextPage: number, nextSearch: string, replace = false) => {
      const run = loadOptionsRef.current;
      if (!run || !enabled) return;

      const requestId = ++requestIdRef.current;
      const isFirstPage = nextPage === 1;

      if (isFirstPage) setIsLoading(true);
      setIsFetching(true);

      try {
        const result = await run({
          page: nextPage,
          search: nextSearch,
          pageSize,
        });

        if (requestIdRef.current !== requestId) return;

        const next = result.options ?? [];

        setOptions((prev) =>
          replace || isFirstPage ? next : [...prev, ...next],
        );

        setHasMore(Boolean(result.hasMore));
      } catch {
        if (requestIdRef.current !== requestId) return;
        if (isFirstPage) setOptions([]);
        setHasMore(false);
      } finally {
        if (requestIdRef.current !== requestId) return;
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    [enabled, pageSize],
  );

  // single source of truth for fetching
  useEffect(() => {
    if (!hasLoader || !enabled) {
      setOptions([]);
      setHasMore(false);
      setIsLoading(false);
      setIsFetching(false);
      return;
    }

    fetchOptions(page, search, page === 1);
  }, [page, search, enabled, hasLoader, fetchOptions]);

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (!hasLoader || !enabled || isFetching || !hasMore) return;
    setPage((p) => p + 1);
  }, [enabled, hasLoader, hasMore, isFetching]);

  const reset = useCallback(() => {
    requestIdRef.current++;
    setPage(1);
    setSearchState("");
    setOptions([]);
    setHasMore(false);
  }, []);

  const refetch = useCallback(() => {
    requestIdRef.current++;
    fetchOptions(1, search, true);
  }, [fetchOptions, search]);

  return {
    options,
    search,
    isLoading,
    isFetching,
    hasMore,
    setSearch,
    loadMore,
    reset,
    refetch,
  };
}
