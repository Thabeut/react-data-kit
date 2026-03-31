import { Divider, Space, Typography } from "antd";

const { Title, Paragraph } = Typography;

export function InfiniteScrollIntroPage() {
  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        Infinite scroll: UI + data wrappers
      </Title>

      <Paragraph type="secondary" style={{ maxWidth: 900 }}>
        `InfiniteScrollUI` is a small, UI-only helper: a scroll container that
        renders items, loading states, and an optional “load more” spinner.
        Data fetching is handled separately by `InfiniteScrollRTK` (for RTK
        Query) and `InfiniteScrollRQ` (for React Query).
      </Paragraph>

      <Divider />

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Title level={4} style={{ marginBottom: 0 }}>
          What the UI does
        </Title>

        <Paragraph style={{ maxWidth: 900 }}>
          - Renders a vertical scroll container with your cards.
          <br />
          - Shows an initial loader while the first page is loading.
          <br />
          - Shows an empty state when there are no items.
          <br />
          - Calls an `onLoadMore` callback when the user reaches the bottom,
          and renders a “load more” spinner while more items are being fetched.
        </Paragraph>

        <Divider />

        <Title level={4} style={{ marginBottom: 0 }}>
          How it fits with RTK Query and React Query
        </Title>

        <Paragraph type="secondary" style={{ maxWidth: 900 }}>
          You stay in charge of the data layer. The UI layer (`InfiniteScrollUI`)
          only knows about items and loading flags; data-aware wrappers connect
          it to your queries:
        </Paragraph>

        <Paragraph style={{ maxWidth: 900 }}>
          - `InfiniteScrollRTK` wires a page-based RTK Query endpoint into the
          UI: it manages `page`, calls your endpoint, and passes{" "}
          <code>{`{ items, hasNext, isLoading, isFetching }`}</code> down.
          <br />
          - `InfiniteScrollRQ` uses React Query’s <code>useInfiniteQuery</code>
          and normalizes <code>data.pages</code> into a flat list of items plus
          <code>hasNextPage</code>.
        </Paragraph>
      </Space>
    </>
  );
}
