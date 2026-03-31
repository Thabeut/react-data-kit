import { useMemo } from "react";
import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Title, Paragraph } = Typography;

type Row = {
  key: string;
  prop: string;
  required: string;
  description: string;
};

const propsRows: Row[] = [
  {
    key: "heightClass",
    prop: "heightClass",
    required: "required",
    description:
      "CSS class applied to the outer container to control height (e.g. a fixed panel height).",
  },
  {
    key: "useQuery",
    prop: "useQuery",
    required: "required",
    description:
      "Injected hook that fetches a single page. Receives `{ query: { page, ... }, tag }` and returns `{ data, isLoading, isFetching }`.",
  },
  {
    key: "buildQueryArgs",
    prop: "buildQueryArgs",
    required: "required",
    description:
      "Function that builds the `{ query, tag }` payload for a given page number.",
  },
  {
    key: "selectItems",
    prop: "selectItems",
    required: "required",
    description:
      "Maps the raw response into an array of items for the list. Called on every page.",
  },
  {
    key: "selectHasNext",
    prop: "selectHasNext",
    required: "required",
    description:
      "Returns `true` while there are more pages to fetch, based on the raw response (e.g. `total`, `skip`, `limit`).",
  },
  {
    key: "getKey",
    prop: "getKey",
    required: "required",
    description:
      "Returns a stable string key for each item. Used to avoid duplicates when appending pages.",
  },
  {
    key: "renderItem",
    prop: "renderItem",
    required: "required",
    description:
      "Render function for a single item. This is where you build your card / row component.",
  },
  {
    key: "enabled",
    prop: "enabled",
    required: "optional",
    description:
      "When `false`, the list resets its internal state and stops querying. Default: `true`.",
  },
  {
    key: "emptyState",
    prop: "emptyState",
    required: "optional",
    description:
      "Node rendered when there are no items after the initial load (e.g. an `<Empty />` component).",
  },
  {
    key: "className",
    prop: "className",
    required: "optional",
    description: "Additional classes for the outer container.",
  },
  {
    key: "thresholdPx",
    prop: "thresholdPx",
    required: "optional",
    description:
      "Distance in pixels from the bottom at which the next page is requested. Default: `40`.",
  },
  {
    key: "resetKey",
    prop: "resetKey",
    required: "optional",
    description:
      "When this value changes, the list resets pages and items (useful for filters/search change).",
  },
  {
    key: "renderInitialLoader",
    prop: "renderInitialLoader",
    required: "optional",
    description:
      "Custom node for the very first loading state. Defaults to the shared `Loader` component.",
  },
  {
    key: "renderFetchingLoader",
    prop: "renderFetchingLoader",
    required: "optional",
    description:
      "Custom node shown while loading the next page (after page 1). Defaults to a centered `Spin`.",
  },
];

export function InfiniteScrollPropsPage() {
  const columns: ColumnsType<Row> = useMemo(
    () => [
      { title: "Prop", dataIndex: "prop", key: "prop" },
      { title: "Required", dataIndex: "required", key: "required", width: 120 },
      { title: "Description", dataIndex: "description", key: "description" },
    ],
    [],
  );

  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        InfiniteScrollList props
      </Title>

      <Paragraph type="secondary" style={{ maxWidth: 900 }}>
        This page summarizes the main props you pass into <code>InfiniteScrollList</code>.
        For full type definitions, see <code>InfiniteScrollListProps</code> exported from
        the library.
      </Paragraph>

      <Table<Row>
        className="docs-props-table"
        rowKey="key"
        size="small"
        columns={columns}
        dataSource={propsRows}
        pagination={false}
        scroll={{ x: true }}
      />
    </>
  );
}

