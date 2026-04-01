import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, DataTableFilterTypeEnum } from "@thabeut/react-data-kit";
import type {
  AsyncOptionsParams,
  AsyncOptionsResult,
  IMultiFilterOption,
  LoadOptions,
} from "@thabeut/react-data-kit";
import { useDispatch } from "react-redux";
import {
  productsRtkApi,
  type PublicOptionsListResponse,
} from "../querytable/adapters/useProductsRtkQuery";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { filterDemoRows, statusOptions, type FilterDemoRow } from "../../data";

export function DataTableFiltersPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();

  const categoryLoadOptions = useMemo<LoadOptions<IMultiFilterOption>>(
    () =>
      async (
        params: AsyncOptionsParams,
      ): Promise<AsyncOptionsResult<IMultiFilterOption>> => {
        const page = params.page ?? 1;
        const search = params.search ?? "";
        const result = (await dispatch(
          productsRtkApi.endpoints.productCategoriesOptions.initiate(
            {
              tag: { type: "category-infinite" },
              query: { page, search },
            },
            { subscribe: false },
          ),
        ).unwrap()) as PublicOptionsListResponse;

        const items = (result.items ?? []).map((item) => ({
          value: item.id,
          label: item.label,
        }));
        return {
          options: items,
          hasMore: result.skip + result.limit < result.total,
        };
      },
    [dispatch],
  );

  const code = String.raw`import {
  DataTable,
  DataTableFilterTypeEnum,
} from "@thabeut/react-data-kit";
import type {
  AsyncOptionsParams,
  AsyncOptionsResult,
  DataTableColumnInfo,
  DataTableFilterConfig,
  IDateFilterOption,
  IMultiFilterOption,
  LoadOptions,
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

const loadCategories: LoadOptions<IMultiFilterOption> = async (
  params: AsyncOptionsParams,
): Promise<AsyncOptionsResult<IMultiFilterOption>> => {
  // Use params.page, params.search (and any custom keys) with RTK Query, React Query, fetch, etc.
  return { options: [], hasMore: false };
};

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
    type: DataTableFilterTypeEnum.Single,
    options: statusOptions,
    searchPlaceholder: "Search",
  },
  {
    id: "category",
    label: "Category",
    type: DataTableFilterTypeEnum.Multi,
    loadOptions: loadCategories,
    searchPlaceholder: "Search",
  },
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
                loadOptions: categoryLoadOptions,
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
