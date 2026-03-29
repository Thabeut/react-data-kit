import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@thabeut/react-data-kit";
import type { DataTableSortState } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";

type SortRow = {
  id: number;
  product: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  updatedAt: string;
};

const rows: SortRow[] = [
  {
    id: 1,
    product: "Nebula Keyboard",
    category: "Peripherals",
    price: 129,
    rating: 4.7,
    stock: 42,
    updatedAt: "2026-01-21",
  },
  {
    id: 2,
    product: "Aurora Mouse",
    category: "Peripherals",
    price: 79,
    rating: 4.5,
    stock: 118,
    updatedAt: "2026-02-03",
  },
  {
    id: 3,
    product: "Helios Monitor 27",
    category: "Displays",
    price: 399,
    rating: 4.8,
    stock: 26,
    updatedAt: "2026-01-11",
  },
  {
    id: 4,
    product: "Atlas Dock Pro",
    category: "Accessories",
    price: 219,
    rating: 4.4,
    stock: 33,
    updatedAt: "2026-02-10",
  },
  {
    id: 5,
    product: "Pulse Headset",
    category: "Audio",
    price: 149,
    rating: 4.2,
    stock: 76,
    updatedAt: "2026-01-29",
  },
  {
    id: 6,
    product: "Vector Webcam 4K",
    category: "Cameras",
    price: 189,
    rating: 4.6,
    stock: 51,
    updatedAt: "2026-02-17",
  },
  {
    id: 7,
    product: "Quantum SSD 2TB",
    category: "Storage",
    price: 259,
    rating: 4.9,
    stock: 19,
    updatedAt: "2026-01-14",
  },
  {
    id: 8,
    product: "Nimbus Stand",
    category: "Accessories",
    price: 69,
    rating: 4.3,
    stock: 140,
    updatedAt: "2026-02-06",
  },
];

export function DataTableSortPage() {
  const { t } = useTranslation();
  const [sortState, setSortState] = useState<DataTableSortState | null>(null);

  const code = String.raw`import { useState } from "react";
import { DataTable } from "@thabeut/react-data-kit";

type Row = {
  id: number;
  product: string;
  price: number;
  rating: number;
};

const rows: Row[] = [
  { id: 1, product: "Nebula Keyboard", price: 129, rating: 4.7 },
  { id: 2, product: "Aurora Mouse", price: 79, rating: 4.5 },
];

export function SortExample() {
  return (
    <DataTable<Row>
      tableId="sort-example"
      rowKey="id"
      dataSource={rows}
      pagination={{ pageSizeOptions: [10, 20, 50], defaultPageSize: 10 }}
      columnsInfo={[
        { id: "product", label: "Product", dataIndex: "product", sortable: true },
        { id: "price", label: "Price", dataIndex: "price", sortable: true },
        { id: "rating", label: "Rating", dataIndex: "rating", sortable: true },
      ]}
    />
  );
}`;

  return (
    <DemoPageShell
      title={t("dtPageSortTitle")}
      description={t("dtPageSortDesc")}
      setup={t("dtPageSortSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <DataTable<SortRow>
              tableId="playground-sort"
              columnResize
              rowKey="id"
              sortState={sortState}
              onSortChange={setSortState}
              dataSource={rows}
              pagination={{
                pageSizeOptions: [10, 20, 50],
                defaultPageSize: 10,
              }}
              columnsInfo={[
                {
                  id: "product",
                  label: t("dtColProduct"),
                  dataIndex: "product",
                  sortable: true,
                },
                {
                  id: "category",
                  label: t("dtColCategory"),
                  dataIndex: "category",
                  sortable: true,
                },
                {
                  id: "price",
                  label: t("dtColPrice"),
                  dataIndex: "price",
                  sortable: true,
                },
                {
                  id: "rating",
                  label: t("dtColRating"),
                  dataIndex: "rating",
                  sortable: true,
                },
                {
                  id: "stock",
                  label: t("dtColStock"),
                  dataIndex: "stock",
                  sortable: true,
                },
                {
                  id: "updatedAt",
                  label: t("dtColUpdated"),
                  dataIndex: "updatedAt",
                  sortable: true,
                },
              ]}
            />
          </>
        }
        code={code}
      />
    </DemoPageShell>
  );
}
