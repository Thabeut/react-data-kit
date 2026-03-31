import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { InfiniteScrollUI } from "./InfiniteScrollUI";

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

export interface InfiniteScrollRTKProps<TItem, TRaw> {
  heightClass?: string;
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
  renderInitialLoader?: ReactNode;
  renderFetchingLoader?: ReactNode;
}

export function InfiniteScrollRTK<TItem, TRaw>({
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
  thresholdPx,
  renderInitialLoader,
  renderFetchingLoader,
}: InfiniteScrollRTKProps<TItem, TRaw>) {
  const [page, setPage] = useState(1);

  const queryArgs = useMemo(
    () => buildQueryArgs(page),
    [buildQueryArgs, page],
  );

  const { data, isLoading, isFetching } = useQuery(queryArgs, {
    skip: !enabled,
  });

  const items = selectItems(data);
  const hasNext = selectHasNext(data);

  useEffect(() => {
    if (!enabled) {
      setPage(1);
    }
  }, [enabled]);

  const handleLoadMore = () => {
    if (isFetching || !hasNext) return;
    setPage((prev) => prev + 1);
  };

  return (
    <InfiniteScrollUI
      items={items}
      isLoading={isLoading}
      isFetching={isFetching}
      hasNext={hasNext}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
      getKey={getKey}
      heightClass={heightClass}
      className={className}
      emptyState={emptyState}
      thresholdPx={thresholdPx}
      renderInitialLoader={renderInitialLoader}
      renderFetchingLoader={renderFetchingLoader}
    />
  );
}

