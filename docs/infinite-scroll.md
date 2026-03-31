# Infinite Scroll Guide

React Data Kit provides two exported infinite-scroll components:

- `InfiniteScrollRTK`: adapter for RTK Query style hooks
- `InfiniteScrollRQ`: adapter for React Query `useInfiniteQuery`

## 1) Install and import

```ts
import "@thabeut/react-data-kit/style.css";
import { InfiniteScrollRTK, InfiniteScrollRQ } from "@thabeut/react-data-kit";
```

## 2) `InfiniteScrollRTK`

```tsx
<InfiniteScrollRTK<Item, ApiResponse>
  useQuery={useProductsQuery}
  buildQueryArgs={(page) => ({
    tag: { type: "Products" },
    query: { page, limit: 20 },
  })}
  selectItems={(data) => data?.items ?? []}
  selectHasNext={(data) => Boolean(data?.hasNext)}
  getKey={(item) => String(item.id)}
  renderItem={(item) => <Card item={item} />}
/>
```

## 3) `InfiniteScrollRQ`

```tsx
<InfiniteScrollRQ<Item, ApiPage>
  useInfiniteQuery={() =>
    useInfiniteProductsQuery({
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
  }
  selectItemsFromPage={(page) => page.items}
  getKey={(item) => String(item.id)}
  renderItem={(item) => <Card item={item} />}
/>
```

## 4) UX tuning

- `thresholdPx`: how early to trigger load-more near bottom
- `renderInitialLoader`: initial skeleton/spinner
- `renderFetchingLoader`: loader while fetching next page
- `emptyState`: message/component for no results

## 5) Production tips

- Guard duplicate fetches (`isFetching` checks are already in adapters).
- Keep list item keys stable.
- Keep query cache keys stable for predictable pagination.
