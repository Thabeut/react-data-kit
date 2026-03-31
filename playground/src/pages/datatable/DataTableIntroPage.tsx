import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ColumnsType } from "antd/es/table";
import { dataTablePropRows } from "./props-data";
import { DocsIntroPage, type DocsIntroNextStep } from "../../components/DocsIntroPage";

type DataTablePropRow = {
  key: string;
  prop: string;
  type: string;
  required: string;
  description: string;
};

export function DataTableIntroPage() {
  const { t } = useTranslation();
  const propColumns: ColumnsType<DataTablePropRow> = useMemo(
    () => [
      { title: t("dtColProp"), dataIndex: "prop", key: "prop", width: 220 },
      { title: t("dtColType"), dataIndex: "type", key: "type", width: 200 },
      { title: t("dtColRequired"), dataIndex: "required", key: "required", width: 100 },
      { title: t("dtColDescription"), dataIndex: "description", key: "description" },
    ],
    [t],
  );
  const nextSteps: DocsIntroNextStep[] = [
    { to: "/datatable/basic", label: t("docsExampleBasic"), color: "blue" },
    {
      to: "/datatable/selection",
      label: t("docsExampleSelection"),
      color: "geekblue",
    },
    { to: "/datatable/groups", label: t("docsExampleGroups"), color: "purple" },
    { to: "/datatable/server", label: t("docsExampleServer"), color: "cyan" },
  ];

  return (
    <DocsIntroPage<DataTablePropRow>
      title={t("docsDataTableIntroTitle")}
      description={t("dtPagePropsIntro")}
      installTitle={t("dtInstallTitle")}
      installSnippets={[
        "npm install @thabeut/react-data-kit",
        'import { DataTable } from "@thabeut/react-data-kit";',
      ]}
      propsTitle={t("docsPropsTitle")}
      propsIntro={t("docsDataTablePropsIntro")}
      propsTable={{ columns: propColumns, rows: dataTablePropRows }}
      nextStepsTitle={t("docsNextSteps")}
      nextSteps={nextSteps}
    />
  );
}

