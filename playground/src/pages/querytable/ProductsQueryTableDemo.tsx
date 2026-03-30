import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Space, Tag, Typography, Divider } from "antd";
import { useSearchParams } from "react-router-dom";
import {
  QueryTable,
  parseTableState,
  serializeTableState,
  type QueryTableProps,
} from "@thabeut/react-data-kit";

import type {
  DummyJsonListResponse,
  DummyJsonProduct,
} from "./adapters/useProductsRtkQuery";

const { Title, Paragraph } = Typography;

export type ProductRow = {
  id: number;
  title: string;
  price: number;
  image: string;
  categoryName: string;
};

export type ProductsQueryTableUseQuery = QueryTableProps<ProductRow, DummyJsonListResponse>["useQuery"];

type DemoProps = {
  useQuery: ProductsQueryTableUseQuery;
  tagType: string;
};

const BASE = "https://dummyjson.com/products";

function productToRow(p: DummyJsonProduct): ProductRow {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.thumbnail,
    categoryName: p.category,
  };
}

function statusText(tableState: ReturnType<typeof parseTableState>): string {
  return [
    `page=${tableState.page}`,
    `pageSize=${tableState.pageSize}`,
    tableState.search ? `search=${tableState.search}` : null,
    tableState.sort ? `sort=${tableState.sort.field}:${tableState.sort.direction}` : null,
  ]
    .filter(Boolean)
    .join(" | ");
}

export function ProductsQueryTableDemo({ useQuery, tagType }: DemoProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const tableState = useMemo(
    () => parseTableState(searchParams),
    [searchParams],
  );

  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoadError(null);
    void fetch(`${BASE}/categories`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ slug: string; name: string }[]>;
      })
      .then((cats) => {
        if (!mounted) return;
        setCategoryOptions(cats.map((c) => ({ value: c.slug, label: c.name })));
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setLoadError(e instanceof Error ? e.message : "Unknown error");
        setCategoryOptions([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const onTableStateChange = (next: ReturnType<typeof parseTableState>) => {
    const qs = serializeTableState(next);
    setSearchParams(new URLSearchParams(qs));
  };

  const resultAdapter = useMemo(
    () => ({
      selectItems: (data: DummyJsonListResponse | undefined) =>
        data?.products.map(productToRow) ?? [],
      selectTotalItems: (data: DummyJsonListResponse | undefined) =>
        data?.total ?? 0,
    }),
    [],
  );

  const columnsInfo = useMemo(() => {
    const moneyFmt = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

    return [
      {
        id: "title",
        label: "Product",
        dataIndex: "title" as const,
        sortable: true,
        width: 360,
        render: (_value: unknown, record: unknown) => {
          const row = record as ProductRow;
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={row.image}
                alt=""
                width={48}
                height={48}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
              <span>{row.title}</span>
            </div>
          );
        },
      },
      {
        id: "price",
        label: "Price",
        dataIndex: "price" as const,
        sortable: true,
        width: 120,
        render: (value: unknown) => moneyFmt.format(Number(value)),
      },
      {
        id: "categoryName",
        label: "Category",
        dataIndex: "categoryName" as const,
        sortable: true,
        width: 200,
        render: (value: unknown) => <Tag>{String(value)}</Tag>,
      },
    ];
  }, []);

  const filters = useMemo(() => {
    return [
      {
        id: "category",
        label: "Category",
        type: "multi" as const,
        options: categoryOptions,
        searchPlaceholder: "Search categories",
      },
    ];
  }, [categoryOptions]);

  const pageSizeOptions = useMemo(() => [10, 20, 50], []);
  const reset = () => setSearchParams({});

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Title level={4} style={{ margin: 0 }}>
          QueryTable demo
        </Title>

        <Paragraph type="secondary">
          URL state: <code>{statusText(tableState)}</code>
        </Paragraph>

        <Space wrap>
          <Tag color="blue">tableState.page={tableState.page}</Tag>
          <Tag color="blue">pageSize={tableState.pageSize}</Tag>
          {tableState.search ? <Tag>search="{tableState.search}"</Tag> : null}
          {tableState.sort ? (
            <Tag>
              sort={tableState.sort.field}:{tableState.sort.direction}
            </Tag>
          ) : null}
        </Space>

        <Divider style={{ margin: 0 }} />

        <Space direction="vertical" style={{ width: "100%" }}>
          {loadError ? (
            <Alert
              type="error"
              showIcon
              message="Could not load category filter options"
              description={loadError}
            />
          ) : null}

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Button onClick={reset} size="small">
              Reset URL
            </Button>
          </div>

          <QueryTable<ProductRow, DummyJsonListResponse>
            tableId={`querytable-${tagType}`}
            rowKey="id"
            columnsInfo={columnsInfo as never}
            filters={filters}
            tableState={tableState}
            onTableStateChange={onTableStateChange}
            tag={{ type: tagType }}
            useQuery={useQuery as never}
            resultAdapter={resultAdapter}
            pageSizeOptions={pageSizeOptions}
            initialPageSize={pageSizeOptions[0] ?? 10}
            searchPlaceholder="Search products"
            renderToolbarLeft={<Tag color="processing">QueryTable</Tag>}
            renderToolbarRight={
              <Tag>{tagType === "products-rtk" ? "RTK Query" : "React Query"}</Tag>
            }
          />
        </Space>
    </Space>
  );
}

