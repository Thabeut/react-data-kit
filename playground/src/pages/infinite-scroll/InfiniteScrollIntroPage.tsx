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

export function InfiniteScrollIntroPage() {
  const { t } = useTranslation();
  const infiniteScrollPropRows: PropRow[] = [
    { key: "heightClass", prop: "heightClass", required: t("docsRequired"), description: t("isPropHeightClassDesc") },
    { key: "useQuery", prop: "useQuery", required: t("docsRequired"), description: t("isPropUseQueryDesc") },
    { key: "buildQueryArgs", prop: "buildQueryArgs", required: t("docsRequired"), description: t("isPropBuildQueryArgsDesc") },
    { key: "selectItems", prop: "selectItems", required: t("docsRequired"), description: t("isPropSelectItemsDesc") },
    { key: "selectHasNext", prop: "selectHasNext", required: t("docsRequired"), description: t("isPropSelectHasNextDesc") },
    { key: "getKey", prop: "getKey", required: t("docsRequired"), description: t("isPropGetKeyDesc") },
    { key: "renderItem", prop: "renderItem", required: t("docsRequired"), description: t("isPropRenderItemDesc") },
    { key: "enabled", prop: "enabled", required: t("docsOptional"), description: t("isPropEnabledDesc") },
    { key: "emptyState", prop: "emptyState", required: t("docsOptional"), description: t("isPropEmptyStateDesc") },
    { key: "className", prop: "className", required: t("docsOptional"), description: t("isPropClassNameDesc") },
    { key: "thresholdPx", prop: "thresholdPx", required: t("docsOptional"), description: t("isPropThresholdPxDesc") },
    { key: "resetKey", prop: "resetKey", required: t("docsOptional"), description: t("isPropResetKeyDesc") },
    { key: "renderInitialLoader", prop: "renderInitialLoader", required: t("docsOptional"), description: t("isPropRenderInitialLoaderDesc") },
    { key: "renderFetchingLoader", prop: "renderFetchingLoader", required: t("docsOptional"), description: t("isPropRenderFetchingLoaderDesc") },
  ];
  const columns: ColumnsType<PropRow> = [
    { title: t("dtColProp"), dataIndex: "prop", key: "prop" },
    { title: t("dtColRequired"), dataIndex: "required", key: "required", width: 120 },
    { title: t("dtColDescription"), dataIndex: "description", key: "description" },
  ];
  const nextSteps: DocsIntroNextStep[] = [
    { to: "/infinite-scroll/rtk-query", label: t("docsExampleRtkQuery"), color: "blue" },
    {
      to: "/infinite-scroll/react-query",
      label: t("docsExampleReactQuery"),
      color: "geekblue",
    },
  ];
  const description: ReactNode =
    "InfiniteScrollUI is a UI-only helper for list rendering and load-more states. Data fetching can be wired using RTK Query or React Query wrappers.";

  return (
    <DocsIntroPage<PropRow>
      title={t("docsInfiniteScrollIntroTitle")}
      description={description}
      installTitle={t("dtInstallTitle")}
      installSnippets={[
        "npm install @thabeut/react-data-kit",
        'import { InfiniteScrollRTK, InfiniteScrollRQ } from "@thabeut/react-data-kit";',
      ]}
      propsTitle={t("docsPropsTitle")}
      propsIntro={t("isPropsIntro")}
      propsTable={{ columns, rows: infiniteScrollPropRows }}
      nextStepsTitle={t("docsNextSteps")}
      nextSteps={nextSteps}
    />
  );
}
