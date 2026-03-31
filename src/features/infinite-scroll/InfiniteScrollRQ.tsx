import type { ReactNode } from "react";
import { InfiniteScrollUI } from "./InfiniteScrollUI";

export interface InfiniteScrollRQResult<TRawPage> {
  data?: {
    pages: TRawPage[];
  };
  isLoading: boolean;
  isFetching: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export type UseInfiniteQueryAdapter<TRawPage> = () => InfiniteScrollRQResult<
  TRawPage
>;

export interface InfiniteScrollRQProps<TItem, TRawPage> {
  heightClass?: string;
  useInfiniteQuery: UseInfiniteQueryAdapter<TRawPage>;
  selectItemsFromPage: (page: TRawPage) => TItem[];
  getKey: (item: TItem) => string;
  renderItem: (item: TItem) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
  thresholdPx?: number;
  renderInitialLoader?: ReactNode;
  renderFetchingLoader?: ReactNode;
}

export function InfiniteScrollRQ<TItem, TRawPage>({
  heightClass,
  useInfiniteQuery,
  selectItemsFromPage,
  getKey,
  renderItem,
  emptyState,
  className,
  thresholdPx,
  renderInitialLoader,
  renderFetchingLoader,
}: InfiniteScrollRQProps<TItem, TRawPage>) {
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery();

  const pages = data?.pages ?? [];
  const items = pages.flatMap((page) => selectItemsFromPage(page));
  const hasNext = Boolean(hasNextPage);
  const effectiveIsFetching = Boolean(isFetchingNextPage ?? isFetching);

  const handleLoadMore = () => {
    if (!hasNext || effectiveIsFetching || !fetchNextPage) return;
    fetchNextPage();
  };

  return (
    <InfiniteScrollUI
      items={items}
      isLoading={isLoading}
      isFetching={effectiveIsFetching}
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

