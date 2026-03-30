import { useMemo } from "react";
import { Table, Typography, Tag, Space, Divider } from "antd";
import { Link } from "react-router-dom";
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
    key: "tableState",
    prop: "tableState",
    required: "required",
    description:
      "Normalized table state parsed from the URL (or any external source). Includes `page`, `pageSize`, optional `search`, `filters`, and `sort`.",
  },
  {
    key: "onTableStateChange",
    prop: "onTableStateChange",
    required: "required",
    description:
      "Called when the user changes page/search/filters/sort. In the playground, it serializes back into the URL.",
  },
  {
    key: "tableId",
    prop: "tableId",
    required: "required",
    description:
      "ID used by DataTable for column width persistence in storage.",
  },
  {
    key: "rowKey",
    prop: "rowKey",
    required: "required",
    description:
      "Ant Design `rowKey` for stable row identity (string field or function).",
  },
  {
    key: "columnsInfo",
    prop: "columnsInfo",
    required: "required",
    description:
      "DataTable columns definition (id/label/dataIndex and optional `sortable` or `render`).",
  },
  {
    key: "filters",
    prop: "filters",
    required: "optional",
    description:
      "Toolbar filters (multi and date types supported by DataTable). Only filters declared here are mapped into the query args and the URL state.",
  },
  {
    key: "useQuery",
    prop: "useQuery",
    required: "required",
    description:
      "Injected hook that fetches data. QueryTable calls it with `{ tag, query }` where `query` is built from the current table state.",
  },
  {
    key: "tag",
    prop: "tag",
    required: "required",
    description:
      "A small discriminator passed to the injected `useQuery` hook. Commonly maps to an RTK/React-query “key”.",
  },
  {
    key: "resultAdapter",
    prop: "resultAdapter",
    required: "required",
    description:
      "Maps the raw server response (`TRaw`) into the rows array and total items count for the DataTable footer.",
  },
  {
    key: "pageSizeOptions",
    prop: "pageSizeOptions",
    required: "optional",
    description:
      "Pagination page-size options (defaults to `[5,10,20,50]`).",
  },
  {
    key: "initialPageSize",
    prop: "initialPageSize",
    required: "optional",
    description:
      "Used when `pageSize` is missing from the external state source.",
  },
  {
    key: "limitKey/searchKey/sortKey",
    prop: "limitKey/searchKey/sortKey",
    required: "optional",
    description:
      "Controls field names inside the `query` object sent to your `useQuery` hook (defaults: `limit`, `search`, `sort`).",
  },
];

export function QueryTableIntroPage() {
  const columns: ColumnsType<Row> = useMemo(
    () => [
      { title: "Prop", dataIndex: "prop", key: "prop" },
      { title: "Required", dataIndex: "required", key: "required", width: 120 },
      { title: "Description", dataIndex: "description", key: "description" },
    ],
    [],
  );

  const persistExample = useMemo(
    () => String.raw`// 1) Parse table state from URL
const tableState = parseTableState(searchParams);

// 2) Pass it to QueryTable
<QueryTable
  tableState={tableState}
  onTableStateChange={(next) => {
    // 3) Serialize back into URL
    setSearchParams(new URLSearchParams(serializeTableState(next)));
  }}
  useQuery={useQueryRtk /* or useQueryReact */}
  ...
/>
`,
    [],
  );

  const urlDefaults = useMemo(
    () => (
      <>
        <Tag>page</Tag>
        <Tag>pageSize</Tag>
        <Tag>search</Tag>
        <Tag>sort=field:asc|desc</Tag>
        <Tag>{`filter.* (multi via comma)`}</Tag>
      </>
    ),
    [],
  );

  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        QueryTable: server-driven DataTable with URL state
      </Title>

      <Paragraph type="secondary" style={{ maxWidth: 900 }}>
        `QueryTable` is a higher-level wrapper around your existing `DataTable`. It
        renders DataTable in <b>server mode</b>, builds a request payload from table
        state (pagination/search/filters/sort), and calls an injected `useQuery`
        hook (RTK Query or React Query).
      </Paragraph>

      <Divider />

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Title level={4} style={{ marginBottom: 0 }}>
          Persistence in URLs (step-by-step)
        </Title>

        <Paragraph type="secondary" style={{ maxWidth: 900 }}>
          QueryTable itself stays framework-agnostic: it does not import any router.
          In the playground, URL persistence is implemented by the page using only
          `URLSearchParams`.
        </Paragraph>

        <Paragraph style={{ maxWidth: 900 }}>
          1. Parse the URL into normalized state: `parseTableState(searchParams)`
          <br />
          2. Pass `tableState` into `QueryTable`
          <br />
          3. When the user interacts, `QueryTable` calls `onTableStateChange(next)`
          <br />
          4. Serialize back into the URL: `serializeTableState(next)`
        </Paragraph>

        <Paragraph style={{ maxWidth: 900 }}>
          Default URL keys are: {urlDefaults}
        </Paragraph>

        <pre
          style={{
            maxWidth: 900,
            whiteSpace: "pre-wrap",
            background: "var(--antd-color-bg-container)",
            border: "1px solid var(--antd-color-border)",
            borderRadius: 8,
            padding: 12,
            margin: 0,
            overflowX: "auto",
          }}
        >
          <code>{persistExample}</code>
        </pre>

        <Divider />

        <Title level={4} style={{ marginBottom: 0 }}>
          Choose an adapter (RTK Query vs React Query)
        </Title>

        <Paragraph type="secondary" style={{ maxWidth: 900 }}>
          Each adapter page demonstrates the same QueryTable setup, but with a different
          `useQuery` implementation.
        </Paragraph>

        <Space wrap>
          <Link to="/querytable/rtk-query">
            <Tag color="blue">RTK Query example</Tag>
          </Link>
          <Link to="/querytable/react-query">
            <Tag color="geekblue">React Query example</Tag>
          </Link>
        </Space>

        <Divider />

        <Title level={4} style={{ marginBottom: 0 }}>
          Props (overview)
        </Title>

        <Paragraph type="secondary" style={{ maxWidth: 900 }}>
          This is a quick, practical map of the main `QueryTable` props. For full types,
          check the exported `QueryTableProps` in the library.
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
      </Space>
    </>
  );
}

// Backward-compatible export name used by the current App.tsx import.
export { QueryTableIntroPage as QueryTablePage };

