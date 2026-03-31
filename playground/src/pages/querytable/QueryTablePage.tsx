import type { ReactNode } from "react";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { DocsIntroPage, type DocsIntroNextStep } from "../../components/DocsIntroPage";

type PropRow = {
  key: string;
  prop: string;
  required: string;
  description: string;
};

const queryTablePropRows: PropRow[] = [
  {
    key: "tableState",
    prop: "tableState",
    required: "required",
    description:
      "Normalized table state object that QueryTable reads from. Usually comes from `parseTableState(searchParams)`.",
  },
  {
    key: "onTableStateChange",
    prop: "onTableStateChange",
    required: "required",
    description:
      "Callback fired whenever the user changes page, page size, search, filters, or sort. You typically serialize this back into the URL.",
  },
  {
    key: "tableId",
    prop: "tableId",
    required: "required",
    description:
      "Stable identifier used by the underlying DataTable to persist column widths.",
  },
  {
    key: "rowKey",
    prop: "rowKey",
    required: "required",
    description:
      "Ant Design `rowKey` used by DataTable for stable row identity (field name or function).",
  },
  {
    key: "columnsInfo",
    prop: "columnsInfo",
    required: "required",
    description:
      "Columns configuration passed through to DataTable (id, label, dataIndex, sortable, render, etc.).",
  },
  {
    key: "filters",
    prop: "filters",
    required: "optional",
    description:
      "Toolbar filters definition. Only filters specified here are synced into table state and ultimately into the query payload.",
  },
  {
    key: "useQuery",
    prop: "useQuery",
    required: "required",
    description:
      "Injected data-fetching hook (RTK Query or React Query). QueryTable calls it with `{ tag, query }`.",
  },
  {
    key: "tag",
    prop: "tag",
    required: "required",
    description:
      "Small discriminator passed to `useQuery`. Commonly becomes part of the cache key.",
  },
  {
    key: "resultAdapter",
    prop: "resultAdapter",
    required: "required",
    description:
      "Adapter that maps the raw server response into `{ rows, totalItems }` so DataTable can render pagination correctly.",
  },
  {
    key: "pageSizeOptions",
    prop: "pageSizeOptions",
    required: "optional",
    description:
      "Array of page size options passed through to DataTable pagination. Defaults to `[5, 10, 20, 50]`.",
  },
  {
    key: "initialPageSize",
    prop: "initialPageSize",
    required: "optional",
    description:
      "Fallback page size used when the external state source does not yet contain a concrete `pageSize`.",
  },
];

export function QueryTableIntroPage() {
  const { t } = useTranslation();
  const columns: ColumnsType<PropRow> = [
    { title: t("dtColProp"), dataIndex: "prop", key: "prop", width: 200 },
    { title: t("dtColRequired"), dataIndex: "required", key: "required", width: 120 },
    { title: t("dtColDescription"), dataIndex: "description", key: "description" },
  ];

  const nextSteps: DocsIntroNextStep[] = [
    { to: "/querytable/rtk-query", label: t("docsExampleRtkQuery"), color: "blue" },
    {
      to: "/querytable/react-query",
      label: t("docsExampleReactQuery"),
      color: "geekblue",
    },
  ];
  const description: ReactNode =
    "QueryTable is a server-first wrapper around DataTable. It builds query payloads from table state and calls an injected data hook.";

  return (
    <DocsIntroPage<PropRow>
      title={t("docsQueryTableIntroTitle")}
      description={description}
      installTitle={t("dtInstallTitle")}
      installSnippets={[
        "npm install @thabeut/react-data-kit",
        'import { QueryTable } from "@thabeut/react-data-kit";',
      ]}
      propsTitle={t("docsPropsTitle")}
      propsIntro="Core props used by QueryTable in most implementations."
      propsTable={{ columns, rows: queryTablePropRows }}
      nextStepsTitle={t("docsNextSteps")}
      nextSteps={nextSteps}
    />
  );
}
