import { useMemo } from "react";
import { Provider } from "react-redux";
import { Divider } from "antd";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { CrudManagerProductsDemo } from "./CrudManagerProductsDemo";
import {
  makeProductsRtkStore,
  useProductsRtkQuery,
} from "../querytable/adapters/useProductsRtkQuery";

export function CrudManagerBasicPage() {
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
      title="CrudManager (Drawer default)"
      description="Query-driven CRUD workflow with add/edit forms rendered in drawer by default."
      setup="This demo uses RTK Query for list + add/update/delete mutations."
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
