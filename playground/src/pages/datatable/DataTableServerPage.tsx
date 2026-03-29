import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, Tag } from "antd";
import { DataTable, type InternalRow } from "@thabeut/react-data-kit";
import type { DataTableSortState } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";

const BASE = "https://dummyjson.com/products";

type DummyJsonProduct = {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
};

type DummyJsonListResponse = {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
};

type ProductRow = {
  id: number;
  title: string;
  price: number;
  image: string;
  categoryName: string;
};

function buildProductsUrl(opts: {
  page: number;
  pageSize: number;
  search: string;
  categorySlugs: string[];
  sort: DataTableSortState | null;
}): string {
  const skip = (opts.page - 1) * opts.pageSize;
  const { columnId, order } = opts.sort ?? {};
  const sortBy =
    columnId === "price"
      ? "price"
      : columnId === "categoryName"
        ? "category"
        : "title";
  const orderParam = order === "descend" ? "desc" : "asc";

  const params = new URLSearchParams({
    limit: String(opts.pageSize),
    skip: String(skip),
    sortBy,
    order: orderParam,
  });

  const q = opts.search.trim();
  const categorySlug = opts.categorySlugs[0];

  if (q) {
    params.set("q", q);
    if (categorySlug) {
      params.set("category", categorySlug);
    }
    return `${BASE}/search?${params}`;
  }

  if (categorySlug) {
    return `${BASE}/category/${encodeURIComponent(categorySlug)}?${params}`;
  }

  return `${BASE}?${params}`;
}

const code = [
  `import { useEffect, useLayoutEffect, useMemo, useState } from "react";`,
  `import { Image, Tag } from "antd";`,
  `import { DataTable } from "@thabeut/react-data-kit";`,
  `import type { DataTableSortState } from "@thabeut/react-data-kit";`,
  ``,
  `const BASE = "https://dummyjson.com/products";`,
  ``,
  `type ProductRow = { id: number; title: string; price: number; category: string; thumbnail: string };`,
  ``,
  `function buildUrl(`,
  `  page: number,`,
  `  pageSize: number,`,
  `  q: string,`,
  `  categorySlug: string | undefined,`,
  `  sort: DataTableSortState | null,`,
  `) {`,
  `  const params = new URLSearchParams({`,
  `    limit: String(pageSize),`,
  `    skip: String((page - 1) * pageSize),`,
  `    sortBy:`,
  `      sort?.columnId === "price" ? "price" : sort?.columnId === "categoryName" ? "category" : "title",`,
  `    order: sort?.order === "descend" ? "desc" : "asc",`,
  `  });`,
  `  const search = q.trim();`,
  `  if (search) {`,
  `    params.set("q", search);`,
  `    if (categorySlug) params.set("category", categorySlug);`,
  `    return \`\${BASE}/search?\${params}\`;`,
  `  }`,
  `  if (categorySlug) return \`\${BASE}/category/\${encodeURIComponent(categorySlug)}?\${params}\`;`,
  `  return \`\${BASE}?\${params}\`;`,
  `}`,
  ``,
  `export function DataTableServerExample() {`,
  `  const [rows, setRows] = useState<ProductRow[]>([]);`,
  `  const [total, setTotal] = useState(0);`,
  `  const [loading, setLoading] = useState(true);`,
  `  const [page, setPage] = useState(1);`,
  `  const [pageSize, setPageSize] = useState(10);`,
  `  const [search, setSearch] = useState("");`,
  `  const [debouncedSearch, setDebouncedSearch] = useState("");`,
  `  const [sortState, setSortState] = useState<DataTableSortState | null>(null);`,
  `  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});`,
  `  const [categoryOptions, setCategoryOptions] = useState<`,
  `    { value: string; label: string }[]`,
  `  >([]);`,
  ``,
  `  const priceFmt = useMemo(`,
  `    () => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }),`,
  `    [],`,
  `  );`,
  ``,
  `  const columnsInfo = useMemo(`,
  `    () => [`,
  `      {`,
  `        id: "title",`,
  `        label: "Product",`,
  `        dataIndex: "title" as const,`,
  `        sortable: true,`,
  `        render: (_v: unknown, record: unknown) => {`,
  `          const row = record as ProductRow;`,
  `          return (`,
  `            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>`,
  `              <Image`,
  `                src={row.thumbnail}`,
  `                alt=""`,
  `                width={48}`,
  `                height={48}`,
  `                style={{ objectFit: "cover", borderRadius: 8 }}`,
  `                preview={false}`,
  `              />`,
  `              <span>{row.title}</span>`,
  `            </div>`,
  `          );`,
  `        },`,
  `      },`,
  `      {`,
  `        id: "price",`,
  `        label: "Price",`,
  `        dataIndex: "price" as const,`,
  `        sortable: true,`,
  `        render: (v: unknown) => priceFmt.format(Number(v)),`,
  `      },`,
  `      {`,
  `        id: "categoryName",`,
  `        label: "Category",`,
  `        dataIndex: "category" as const,`,
  `        sortable: true,`,
  `        render: (v: unknown) => <Tag>{String(v)}</Tag>,`,
  `      },`,
  `    ],`,
  `    [priceFmt],`,
  `  );`,
  ``,
  `  useEffect(() => {`,
  `    void fetch(\`\${BASE}/categories\`)`,
  `      .then((r) => r.json())`,
  `      .then((cats: { slug: string; name: string }[]) =>`,
  `        setCategoryOptions(cats.map((c) => ({ value: c.slug, label: c.name }))),`,
  `      )`,
  `      .catch(() => setCategoryOptions([]));`,
  `  }, []);`,
  ``,
  `  useEffect(() => {`,
  `    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);`,
  `    return () => clearTimeout(t);`,
  `  }, [search]);`,
  ``,
  `  useLayoutEffect(() => { setPage(1); }, [debouncedSearch, filterValues, sortState]);`,
  ``,
  `  useEffect(() => {`,
  `    const cats = (filterValues.category as string[] | undefined) ?? [];`,
  `    const url = buildUrl(page, pageSize, debouncedSearch, cats[0], sortState);`,
  `    const ac = new AbortController();`,
  `    setLoading(true);`,
  `    fetch(url, { signal: ac.signal })`,
  `      .then((r) => r.json())`,
  `      .then((data: { products: ProductRow[]; total: number }) => {`,
  `        setRows(data.products);`,
  `        setTotal(data.total);`,
  `      })`,
  `      .finally(() => { if (!ac.signal.aborted) setLoading(false); });`,
  `    return () => ac.abort();`,
  `  }, [page, pageSize, debouncedSearch, filterValues, sortState]);`,
  ``,
  `  return (`,
  `    <DataTable<ProductRow>`,
  `      tableId="demo"`,
  `      rowKey="id"`,
  `      serverMode`,
  `      loading={loading}`,
  `      dataSource={rows}`,
  `      searchValue={search}`,
  `      onSearch={setSearch}`,
  `      sortState={sortState}`,
  `      onSortChange={setSortState}`,
  `      filterValues={filterValues}`,
  `      onFilterChange={(id, v) => setFilterValues((p) => ({ ...p, [id]: v }))}`,
  `      filters={[`,
  `        {`,
  `          id: "category",`,
  `          label: "Category",`,
  `          type: "multi",`,
  `          options: categoryOptions,`,
  `        },`,
  `      ]}`,
  `      pagination={{ totalItems: total, pageSizeOptions: [10, 20, 50], defaultPageSize: 10 }}`,
  `      paginationState={{ page, pageSize }}`,
  `      onPageChange={(p, ps) => { setPage(p); setPageSize(ps); }}`,
  `      columnsInfo={columnsInfo}`,
  `    />`,
  `  );`,
  `}`,
].join("\n");

export function DataTableServerPage() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortState, setSortState] = useState<DataTableSortState | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useLayoutEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterValues, sortState]);

  const fetchKey = useMemo(
    () =>
      JSON.stringify({
        page,
        pageSize,
        debouncedSearch,
        filterValues,
        sortState,
        refreshTick,
      }),
    [page, pageSize, debouncedSearch, filterValues, sortState, refreshTick],
  );

  const loadCategories = useCallback(() => {
    void fetch(`${BASE}/categories`)
      .then((r) => r.json())
      .then((cats: { slug: string; name: string }[]) =>
        setCategoryOptions(cats.map((c) => ({ value: c.slug, label: c.name }))),
      )
      .catch(() => setCategoryOptions([]));
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const categorySlugs = (filterValues.category as string[] | undefined) ?? [];
    const url = buildProductsUrl({
      page,
      pageSize,
      search: debouncedSearch,
      categorySlugs,
      sort: sortState,
    });

    const ac = new AbortController();
    setLoading(true);
    setLoadError(null);

    void fetch(url, { signal: ac.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(String(res.status));
        }
        return res.json() as Promise<DummyJsonListResponse>;
      })
      .then((data) => {
        setRows(
          data.products.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            image: p.thumbnail,
            categoryName: p.category,
          })),
        );
        setTotal(data.total);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setLoadError(t("dtPageServerLoadError"));
        setRows([]);
        setTotal(0);
      })
      .finally(() => {
        if (!ac.signal.aborted) {
          setLoading(false);
        }
      });

    return () => ac.abort();
  }, [fetchKey, t]);

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    [],
  );

  const columnsInfo = useMemo(
    () => [
      {
        id: "title",
        label: t("dtColProduct"),
        dataIndex: "title" as const,
        sortable: true,
        width: 360,
        render: (_value: unknown, record: InternalRow<ProductRow>) => {
          const row = record as ProductRow;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Image
                src={row.image}
                alt=""
                width={48}
                height={48}
                style={{ objectFit: "cover", borderRadius: 8 }}
                preview={false}
              />
              <span>{row.title}</span>
            </div>
          );
        },
      },
      {
        id: "price",
        label: t("dtColPrice"),
        dataIndex: "price" as const,
        sortable: true,
        width: 120,
        render: (value: unknown) => priceFormatter.format(Number(value)),
      },
      {
        id: "categoryName",
        label: t("dtColCategory"),
        dataIndex: "categoryName" as const,
        sortable: true,
        width: 200,
        render: (value: unknown) => <Tag>{String(value)}</Tag>,
      },
    ],
    [t, priceFormatter],
  );

  return (
    <DemoPageShell
      title={t("dtPageServerTitle")}
      description={t("dtPageServerDesc")}
      setup={t("dtPageServerSetup")}
    >
      {loadError ? (
        <Alert
          type="error"
          showIcon
          message={loadError}
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <ExamplePreviewCodeFlip
        view={
          <DataTable<ProductRow>
            tableId="playground-server"
            columnResize
            rowKey="id"
            dataSource={rows}
            serverMode
            loading={loading}
            onRefresh={() => {
              loadCategories();
              setRefreshTick((n) => n + 1);
            }}
            searchValue={search}
            onSearch={setSearch}
            sortState={sortState}
            onSortChange={setSortState}
            filterValues={filterValues}
            onFilterChange={(id, value) =>
              setFilterValues((prev) => ({ ...prev, [id]: value }))
            }
            filters={[
              {
                id: "category",
                label: t("dtFilterCategory"),
                type: "multi",
                options: categoryOptions,
              },
            ]}
            paginationState={{ page, pageSize }}
            onPageChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            pagination={{
              pageSizeOptions: [10, 20, 50],
              defaultPageSize: 10,
              totalItems: total,
            }}
            columnsInfo={columnsInfo}
          />
        }
        code={code}
      />
    </DemoPageShell>
  );
}
