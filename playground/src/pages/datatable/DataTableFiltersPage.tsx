import { useTranslation } from "react-i18next";
import { DataTable, DataTableFilterTypeEnum } from "@thabeut/react-data-kit";
import type { IOptionsQueryConfig } from "@thabeut/react-data-kit";
import { useProductCategoriesOptionsInfiniteRtkQuery } from "../querytable/adapters/useProductsRtkQuery";
import type { PublicOptionsListResponse } from "../querytable/adapters/useProductsRtkQuery";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { filterDemoRows, statusOptions, type FilterDemoRow } from "../../data";

type CategoryInfiniteData = PublicOptionsListResponse;

const categoryInfiniteQueryConfig: IOptionsQueryConfig<
  CategoryInfiniteData,
  { type: string }
> = {
  tag: { type: "category-infinite" },
  useQuery: useProductCategoriesOptionsInfiniteRtkQuery,
  formatOptions: (data) => {
    const items = (data?.items ?? []).map((item) => ({
      value: item.id,
      label: item.label,
    }));
    const total = data?.total ?? 0;
    const skip = data?.skip ?? 0;
    const limit = data?.limit ?? 15;
    return { items, hasMore: skip + limit < total };
  },
};

export function DataTableFiltersPage() {
  const { t } = useTranslation();
  const code = String.raw`import {
  DataTable,
  DataTableFilterTypeEnum,
  type DataTableColumnInfo,
  type DataTableFilterConfig,
  type IMultiFilterOption,
  type IDateFilterOption,
} from "@thabeut/react-data-kit";

type FilterDemoRow = {
  id: number;
  title: string;
  status: string;
  category: string;
  updatedAt: string;
};

const statusOptions: IMultiFilterOption[] = [
  { value: "Active", label: "Active" },
  { value: "Away", label: "Away" },
];

const categoryOptions: IMultiFilterOption[] = [
  { value: "Core", label: "Core" },
  { value: "Billing", label: "Billing" },
];

const dateOptions: IDateFilterOption[] = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 days" },
];

const rows: FilterDemoRow[] = [
  { id: 1, title: "Bug report", status: "Active", category: "Core", updatedAt: "2025-01-10" },
  { id: 2, title: "Invoice issue", status: "Away", category: "Billing", updatedAt: "2025-01-20" },
  { id: 3, title: "Feature request", status: "Active", category: "Billing", updatedAt: "2025-02-01" },
];

const filters: DataTableFilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: DataTableFilterTypeEnum.Multi,
    options: statusOptions,
    searchPlaceholder: "Search",
  },
  { id: "category", label: "Category", type: DataTableFilterTypeEnum.Multi, options: categoryOptions },
  {
    id: "updatedAt",
    label: "Updated",
    type: DataTableFilterTypeEnum.Date,
    dateOptions,
  },
];

const columnsInfo: DataTableColumnInfo<FilterDemoRow>[] = [
  { id: "title", label: "Title", dataIndex: "title" },
  { id: "status", label: "Status", dataIndex: "status" },
  { id: "category", label: "Category", dataIndex: "category" },
  { id: "updatedAt", label: "Updated", dataIndex: "updatedAt" },
];

const pagination = {
  pageSizeOptions: [10, 20, 50],
  defaultPageSize: 10,
};

export function DataTableFiltersExample() {
  return (
    <DataTable<FilterDemoRow>
      tableId="playground-filters"
      columnResize
      rowKey="id"
      dataSource={rows}
      filters={filters}
      pagination={pagination}
      columnsInfo={columnsInfo}
    />
  );
}`;

  return (
    <DemoPageShell
      title={t("dtPageFiltersTitle")}
      description={t("dtPageFiltersDesc")}
      setup={t("dtPageFiltersSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <DataTable<FilterDemoRow>
            tableId="playground-filters"
            columnResize
            rowKey="id"
            dataSource={filterDemoRows}
            filters={[
              {
                id: "status",
                label: t("dtFilterStatus"),
                type: DataTableFilterTypeEnum.Single,
                options: statusOptions,
                searchPlaceholder: t("searchByName"),
              },
              {
                id: "category",
                label: t("dtFilterCategory"),
                type: DataTableFilterTypeEnum.Multi,
                optionsQuery: categoryInfiniteQueryConfig,
                searchPlaceholder: t("searchByName"),
              },
              {
                id: "updatedAt",
                label: t("dtFilterPeriod"),
                type: DataTableFilterTypeEnum.Date,
                dateOptions: [
                  { value: "today", label: t("dtDateToday") },
                  { value: "yesterday", label: t("dtDateYesterday") },
                  { value: "last_7_days", label: t("dtDateLast7") },
                  { value: "last_30_days", label: t("dtDateLast30") },
                  { value: "last_3_months", label: t("dtDateLast3Months") },
                  { value: "last_12_months", label: t("dtDateLast12Months") },
                  { value: "custom", label: t("dtDateCustomRange") },
                ],
              },
            ]}
            pagination={{
              pageSizeOptions: [10, 20, 50],
              defaultPageSize: 10,
            }}
            columnsInfo={[
              {
                id: "title",
                label: t("dtColTitle"),
                dataIndex: "title",
              },
              {
                id: "status",
                label: t("dtColStatus"),
                dataIndex: "status",
              },
              {
                id: "category",
                label: t("dtColCategory"),
                dataIndex: "category",
              },
              {
                id: "updatedAt",
                label: t("dtColUpdated"),
                dataIndex: "updatedAt",
              },
            ]}
          />
        }
        code={code}
      />
    </DemoPageShell>
  );
}
