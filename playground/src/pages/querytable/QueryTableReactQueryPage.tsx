import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ProductsQueryTableDemo } from "./ProductsQueryTableDemo";
import { useProductsReactQuery } from "./adapters/useProductsReactQuery";
import { useTranslation } from "react-i18next";

export function QueryTableReactQueryPage() {
  const { t } = useTranslation();
  const code = String.raw`import { QueryTable, parseTableState, serializeTableState } from "@thabeut/react-data-kit";
import { useSearchParams } from "react-router-dom";
import { useProductsReactQuery } from "./services/productsReact";

import type {
  DataTableColumnInfo,
  DataTableFilterConfig,
  QueryResultAdapter,
} from "@thabeut/react-data-kit";

type ProductRow = {
  id: number;
  title: string;
  price: number;
  categoryName: string;
};

type DummyJsonListResponse = {
  products: Array<{ id: number; title: string; price: number; category: string }>;
  total: number;
};

const filters: DataTableFilterConfig[] = [
  {
    id: "category",
    label: "Category",
    type: "multi",
    options: [
      { value: "clothes", label: "clothes" },
      { value: "electronics", label: "electronics" },
    ],
    searchPlaceholder: "Search categories",
  },
];

const columnsInfo: DataTableColumnInfo<ProductRow>[] = [
  { id: "title", label: "Product", dataIndex: "title", sortable: true },
  { id: "price", label: "Price", dataIndex: "price", sortable: true },
  { id: "categoryName", label: "Category", dataIndex: "categoryName", sortable: true },
];

const productsQueryResultAdapter: QueryResultAdapter<
  ProductRow,
  DummyJsonListResponse
> = {
  selectItems: (data) =>
    data?.products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      categoryName: p.category,
    })) ?? [],
  selectTotalItems: (data) => data?.total ?? 0,
};

const pageSizeOptions = [10, 20, 50];
const tag = { type: "products" };
const searchPlaceholder = "Search products";

export function QueryTableReactExample() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tableState = parseTableState(searchParams);

  return (
    <QueryTable<ProductRow, DummyJsonListResponse>
      tableId="demo"
      rowKey="id"
      columnsInfo={columnsInfo}
      filters={filters}
      tableState={tableState}
      onTableStateChange={(next) => {
        setSearchParams(new URLSearchParams(serializeTableState(next)));
      }}
      tag={tag}
      useQuery={useProductsReactQuery}
      resultAdapter={productsQueryResultAdapter}
      pageSizeOptions={pageSizeOptions}
      searchPlaceholder={searchPlaceholder}
    />
  );
}`;

  return (
    <DemoPageShell
      title={t("qtReactTitle")}
      description={t("qtReactDescription")}
      setup={t("qtReactSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <ProductsQueryTableDemo
            useQuery={useProductsReactQuery}
            tagType="products-react-query"
          />
        }
        code={code}
        defaultShow="preview"
      />
    </DemoPageShell>
  );
}
