import type { ReactNode, UIEvent } from "react";
import clsx from "clsx";
import { Spin } from "antd";
import { Loader } from "../../components/loader/Loader";
import "./infinite-scroll.scss";

export interface InfiniteScrollUIProps<TItem> {
  items: TItem[];
  isLoading: boolean;
  isFetching?: boolean;
  hasNext: boolean;
  onLoadMore: () => void;
  renderItem: (item: TItem) => ReactNode;
  getKey: (item: TItem) => string;
  heightClass?: string;
  className?: string;
  emptyState?: ReactNode;
  thresholdPx?: number;
  renderInitialLoader?: ReactNode;
  renderFetchingLoader?: ReactNode;
}

export function InfiniteScrollUI<TItem>({
  items,
  isLoading,
  isFetching,
  hasNext,
  onLoadMore,
  renderItem,
  getKey,
  heightClass,
  className,
  emptyState,
  thresholdPx = 100,
  renderInitialLoader,
  renderFetchingLoader,
}: InfiniteScrollUIProps<TItem>) {
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (!target || isFetching || !hasNext) return;
    const { scrollTop, clientHeight, scrollHeight } = target;
    if (scrollTop + clientHeight >= scrollHeight - thresholdPx) {
      onLoadMore();
    }
  };

  const isInitialLoading = isLoading && items.length === 0;

  return (
    <div className={clsx("rdk-infinite-scroll", heightClass, className)}>
      <div className="rdk-infinite-scroll__scroll" onScroll={handleScroll}>
        {isInitialLoading && (renderInitialLoader ?? <Loader />)}

        {!isInitialLoading && items.length === 0 && emptyState}

        {!isInitialLoading &&
          items.length > 0 &&
          items.map((item) => <div key={getKey(item)}>{renderItem(item)}</div>)}

        {!isInitialLoading &&
          isFetching &&
          hasNext &&
          (renderFetchingLoader ?? (
            <div className="rdk-infinite-scroll__spinner">
              <Spin />
            </div>
          ))}
      </div>
    </div>
  );
}

