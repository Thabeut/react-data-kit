import { useMemo } from "react";
import { Provider } from "react-redux";
import { Divider } from "antd";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { CrudManagerProductsDemo } from "./CrudManagerProductsDemo";
import { useTranslation } from "react-i18next";
import {
  makeProductsRtkStore,
  useProductsRtkQuery,
} from "../querytable/adapters/useProductsRtkQuery";

export function CrudManagerBasicPage() {
  const { t } = useTranslation();
  const store = useMemo(() => makeProductsRtkStore(), []);

  const code = String.raw`import { CrudManager } from "@thabeut/react-data-kit";

<CrudManager
  formVariant="drawer"
  tableState={tableState}
  onTableStateChange={onTableStateChange}
  tableId="products"
  rowKey="id"
  columnsInfo={columnsInfo}
  useQuery={useProductsRtkQuery}
  tag={{ type: "products" }}
  resultAdapter={resultAdapter}
  fields={[...]}
  editDefaultValues={(item) => ({ ... })}
  onCreate={async (values) => { ... }}
  onUpdate={async (item, values) => { ... }}
  onDelete={async (item) => { ... }}
/>;
`;

  return (
    <DemoPageShell
      title={t("cmDrawerTitle")}
      description={t("cmDrawerDescription")}
      setup={t("cmDrawerSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <Provider store={store}>
              <CrudManagerProductsDemo
                useQuery={useProductsRtkQuery}
                formVariant="drawer"
              />
            </Provider>
            <Divider />
          </>
        }
        code={code}
      />
    </DemoPageShell>
  );
}
