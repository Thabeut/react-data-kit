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
    key: "useQuery",
    prop: "useQuery",
    required: "required",
    description:
      "Injected data-fetching hook (RTK Query or React Query style). QueryTable calls it with `{ tag, query }`.",
  },
  {
    key: "tag",
    prop: "tag",
    required: "required",
    description:
      "Discriminator passed to `useQuery`. Usually part of caching identity.",
  },
  {
    key: "resultAdapter",
    prop: "resultAdapter",
    required: "required",
    description:
      "Maps raw server response to table rows and total count (`selectItems`, optional `selectTotalItems`).",
  },
  {
    key: "extraQuery",
    prop: "extraQuery",
    required: "optional",
    description:
      "Static query params merged into every request payload.",
  },
  {
    key: "filters",
    prop: "filters",
    required: "optional",
    description:
      "Toolbar filter definitions. Filter state is mapped into query payload using filter ids or `filterQueryKeys`.",
  },
  {
    key: "groupConfig",
    prop: "groupConfig",
    required: "optional",
    description: "DataTable row grouping config pass-through.",
  },
  {
    key: "searchPlaceholder",
    prop: "searchPlaceholder",
    required: "optional",
    description:
      "Enables search UI and controls displayed placeholder.",
  },
  {
    key: "renderToolbarLeft",
    prop: "renderToolbarLeft",
    required: "optional",
    description: "Custom content rendered on toolbar left side.",
  },
  {
    key: "renderToolbarRight",
    prop: "renderToolbarRight",
    required: "optional",
    description: "Custom content rendered on toolbar right side.",
  },
  {
    key: "actions",
    prop: "actions",
    required: "optional",
    description:
      "Row action config pass-through (preview/edit/delete/custom actions + delete modal config).",
  },
  {
    key: "selection-bookmark",
    prop: "disableSelectionAndBookmark, onSelectionChange, onBookmarkChange",
    required: "optional",
    description:
      "Selection/bookmark controls and callbacks pass-through from DataTable.",
  },
  {
    key: "column-options",
    prop: "hideColumnOptions, onVisibleColumnsChange, columnResize",
    required: "optional",
    description:
      "Column options visibility, persistence callbacks, and resize support.",
  },
  {
    key: "table-layout",
    prop: "className, customColors, maxTableHeight",
    required: "optional",
    description:
      "Visual styling/theming controls and max table scroll height.",
  },
  {
    key: "query-mapping",
    prop: "limitKey, searchKey, sortKey, filterQueryKeys",
    required: "optional",
    description:
      "Custom backend query key mapping for pagination/search/sort/filters.",
  },
  {
    key: "sort-serialization",
    prop: "serializeSort, mapSortToQuery",
    required: "optional",
    description:
      "Customize sort payload shape. `serializeSort` returns one value; `mapSortToQuery` spreads into multiple query keys.",
  },
  {
    key: "events",
    prop: "onRowClick, onFiltersChange, onRefresh",
    required: "optional",
    description:
      "Row click and toolbar/filter/refresh callbacks passed through from DataTable/QueryTable.",
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
  {
    key: "tableState",
    prop: "tableState",
    required: "optional",
    description:
      "Controlled table state (often from `parseTableState(searchParams)`). Omit with `onTableStateChange` for uncontrolled mode.",
  },
  {
    key: "onTableStateChange",
    prop: "onTableStateChange",
    required: "optional",
    description:
      "Controlled state callback for page/pageSize/search/filter/sort changes. Omit with `tableState` for uncontrolled mode.",
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
