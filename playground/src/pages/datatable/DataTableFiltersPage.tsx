import { useTranslation } from "react-i18next";
import { DataTable } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import {
  categoryOptions,
  filterDemoRows,
  statusOptions,
  type FilterDemoRow,
} from "../../data";

export function DataTableFiltersPage() {
  const { t } = useTranslation();
  const code = String.raw`import { DataTable } from "@thabeut/react-data-kit";

type FilterDemoRow = {
  id: number;
  title: string;
  status: string;
  category: string;
  updatedAt: string;
};

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Away", label: "Away" },
];

const categoryOptions = [
  { value: "Core", label: "Core" },
  { value: "Billing", label: "Billing" },
];

const rows: FilterDemoRow[] = [
  { id: 1, title: "Bug report", status: "Active", category: "Core", updatedAt: "2025-01-10" },
  { id: 2, title: "Invoice issue", status: "Away", category: "Billing", updatedAt: "2025-01-20" },
  { id: 3, title: "Feature request", status: "Active", category: "Billing", updatedAt: "2025-02-01" },
];

export function DataTableFiltersExample() {
  return (
    <DataTable<FilterDemoRow>
      tableId="playground-filters"
      columnResize
      rowKey="id"
      dataSource={rows}
      filters={[
        { id: "status", label: "Status", type: "multi", options: statusOptions, searchPlaceholder: "Search" },
        { id: "category", label: "Category", type: "multi", options: categoryOptions },
        {
          id: "updatedAt",
          label: "Updated",
          type: "date",
          dateOptions: [
            { value: "today", label: "Today" },
            { value: "last_7_days", label: "Last 7 days" },
          ],
        },
      ]}
      pagination={{ pageSizeOptions: [10, 20, 50], defaultPageSize: 10 }}
      columnsInfo={[
        { id: "title", label: "Title", dataIndex: "title" },
        { id: "status", label: "Status", dataIndex: "status" },
        { id: "category", label: "Category", dataIndex: "category" },
        { id: "updatedAt", label: "Updated", dataIndex: "updatedAt" },
      ]}
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
                type: "multi",
                options: statusOptions,
                searchPlaceholder: t("searchByName"),
              },
              {
                id: "category",
                label: t("dtFilterCategory"),
                type: "multi",
                options: categoryOptions,
              },
              {
                id: "updatedAt",
                label: t("dtFilterPeriod"),
                type: "date",
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
