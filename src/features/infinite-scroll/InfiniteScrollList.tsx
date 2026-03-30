import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, UIEvent } from "react";
import clsx from "clsx";
import { Spin } from "antd";
import { Loader } from "../../components/loader/Loader";

export interface InfiniteScrollQueryArgs {
  query: {
    page: number;
    [key: string]: unknown;
  };
  tag: { type: string };
}

type UseInfiniteQueryHook<TRaw> = (
  args: InfiniteScrollQueryArgs,
  options?: { skip?: boolean },
) => {
  data?: TRaw;
  isLoading: boolean;
  isFetching?: boolean;
};

export interface InfiniteScrollListProps<TItem, TRaw> {
  heightClass: string;
  useQuery: UseInfiniteQueryHook<TRaw>;
  buildQueryArgs: (page: number) => InfiniteScrollQueryArgs;
  selectItems: (data: TRaw | undefined) => TItem[];
  selectHasNext: (data: TRaw | undefined) => boolean;
  getKey: (item: TItem) => string;
  renderItem: (item: TItem) => ReactNode;
  enabled?: boolean;
  emptyState?: ReactNode;
  className?: string;
  thresholdPx?: number;
  resetKey?: string | number;
  renderInitialLoader?: ReactNode;
  renderFetchingLoader?: ReactNode;
}

export function InfiniteScrollList<TItem, TRaw>({
  heightClass,
  useQuery,
  buildQueryArgs,
  selectItems,
  selectHasNext,
  getKey,
  renderItem,
  enabled = true,
  emptyState,
  className,
  thresholdPx = 40,
  resetKey,
  renderInitialLoader,
  renderFetchingLoader,
}: InfiniteScrollListProps<TItem, TRaw>) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TItem[]>([]);
  const [loadedPages, setLoadedPages] = useState<number[]>([]);
  const prevResetKeyRef = useRef<string | number | undefined>(resetKey);

  const queryArgs = useMemo(() => buildQueryArgs(page), [buildQueryArgs, page]);

  const { data, isLoading, isFetching } = useQuery(queryArgs, {
    skip: !enabled,
  });

  const pageItems = useMemo(() => selectItems(data), [data, selectItems]);
  const hasNext = selectHasNext(data);

  useEffect(() => {
    if (!enabled) {
      setPage(1);
      setItems([]);
      setLoadedPages([]);
    }
  }, [enabled]);

  useEffect(() => {
    if (prevResetKeyRef.current !== resetKey) {
      prevResetKeyRef.current = resetKey;
      setPage(1);
      setItems([]);
      setLoadedPages([]);
    }
  }, [resetKey]);

  useEffect(() => {
    if (!enabled) return;
    if (pageItems.length === 0 && page !== 1) return;
    if (loadedPages.includes(page)) return;

    setItems((prev) => {
      if (page === 1) return pageItems;

      const keySet = new Set(prev.map((item) => getKey(item)));
      const next = [...prev];
      for (const item of pageItems) {
        const key = getKey(item);
        if (!keySet.has(key)) {
          keySet.add(key);
          next.push(item);
        }
      }
      return next;
    });
    setLoadedPages((prev) => [...prev, page]);
  }, [enabled, getKey, loadedPages, page, pageItems]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (!target || isFetching || !hasNext) return;
    const { scrollTop, clientHeight, scrollHeight } = target;
    if (scrollTop + clientHeight >= scrollHeight - thresholdPx) {
      setPage((prev) => prev + 1);
    }
  };

  const isInitialLoading = isLoading && page === 1 && items.length === 0;

  return (
    <div
      className={clsx(
        "flex w-full flex-col",
        heightClass,
        "overflow-hidden",
        className,
      )}
    >
      <div
        className="flex w-full flex-1 flex-col gap-[24px] overflow-y-auto px-[4px]"
        onScroll={handleScroll}
      >
        {isInitialLoading && (renderInitialLoader ?? <Loader />)}

        {!isInitialLoading && items.length === 0 && emptyState}

        {!isInitialLoading &&
          items.length > 0 &&
          items.map((item) => <div key={getKey(item)}>{renderItem(item)}</div>)}

        {page > 1 &&
          isFetching &&
          (renderFetchingLoader ?? (
            <div className="flex w-full justify-center">
              <Spin />
            </div>
          ))}
      </div>
    </div>
  );
}
