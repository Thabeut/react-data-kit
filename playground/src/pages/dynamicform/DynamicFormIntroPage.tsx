import { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import { dynamicFormPropRows } from "./props-data";
import { useTranslation } from "react-i18next";
import { DocsIntroPage, type DocsIntroNextStep } from "../../components/DocsIntroPage";

type PropRow = {
  key: string;
  prop: string;
  type: string;
  required: string;
  description: string;
};

export function DynamicFormIntroPage() {
  const { t } = useTranslation();
  const propColumns: ColumnsType<PropRow> = useMemo(
    () => [
      { title: t("dtColProp"), dataIndex: "prop", key: "prop", width: 220 },
      { title: t("dtColType"), dataIndex: "type", key: "type", width: 240 },
      { title: t("dtColRequired"), dataIndex: "required", key: "required", width: 120 },
      { title: t("dtColDescription"), dataIndex: "description", key: "description" },
    ],
    [t],
  );
  const nextSteps: DocsIntroNextStep[] = [
    { to: "/dynamicform/default", label: t("docsExampleDefault"), color: "blue" },
    { to: "/dynamicform/modal", label: t("docsExampleModal"), color: "geekblue" },
    { to: "/dynamicform/drawer", label: t("docsExampleDrawer"), color: "purple" },
    { to: "/dynamicform/colors", label: t("docsExampleColors"), color: "cyan" },
  ];

  return (
    <DocsIntroPage<PropRow>
      title={t("docsDynamicFormIntroTitle")}
      description="Build package-ready forms from typed field definitions, run validation from each field's fieldSchema, and render consistently in inline, modal, and drawer views."
      installTitle={t("dtInstallTitle")}
      installSnippets={[
        "npm install @thabeut/react-data-kit",
        'import { DynamicForm } from "@thabeut/react-data-kit";',
      ]}
      propsTitle={t("docsPropsTitle")}
      propsIntro="Main DynamicForm props for layout, validation, variants, and theming."
      propsTable={{ columns: propColumns, rows: dynamicFormPropRows }}
      nextStepsTitle={t("docsNextSteps")}
      nextSteps={nextSteps}
    />
  );
}

