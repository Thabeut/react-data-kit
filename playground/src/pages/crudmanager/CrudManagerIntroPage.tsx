import { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import { crudManagerPropRows } from "./props-data";
import { useTranslation } from "react-i18next";
import { DocsIntroPage, type DocsIntroNextStep } from "../../components/DocsIntroPage";

type PropRow = {
  key: string;
  prop: string;
  type: string;
  required: string;
  description: string;
};

export function CrudManagerIntroPage() {
  const { t } = useTranslation();
  const propColumns: ColumnsType<PropRow> = useMemo(
    () => [
      { title: t("dtColProp"), dataIndex: "prop", key: "prop", width: 260 },
      { title: t("dtColType"), dataIndex: "type", key: "type", width: 260 },
      { title: t("dtColRequired"), dataIndex: "required", key: "required", width: 120 },
      { title: t("dtColDescription"), dataIndex: "description", key: "description" },
    ],
    [t],
  );
  const nextSteps: DocsIntroNextStep[] = [
    {
      to: "/crudmanager/basic",
      label: t("docsExampleDrawerDefault"),
      color: "blue",
    },
    { to: "/crudmanager/modal", label: t("docsExampleModal"), color: "geekblue" },
  ];

  return (
    <DocsIntroPage<PropRow>
      title={t("docsCrudManagerIntroTitle")}
      description="Query-driven CRUD feature built from QueryTable and DynamicForm with add/edit orchestration and pass-through API flexibility."
      installTitle={t("dtInstallTitle")}
      installSnippets={[
        "npm install @thabeut/react-data-kit",
        'import { CrudManager } from "@thabeut/react-data-kit";',
      ]}
      propsTitle={t("docsPropsTitle")}
      propsIntro="Core props for CrudManager including QueryTable and DynamicForm pass-throughs."
      propsTable={{ columns: propColumns, rows: crudManagerPropRows }}
      nextStepsTitle={t("docsNextSteps")}
      nextSteps={nextSteps}
    />
  );
}
