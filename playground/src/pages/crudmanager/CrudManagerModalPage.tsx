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

export function CrudManagerModalPage() {
  const store = useMemo(() => makeProductsRtkStore(), []);

  const code = String.raw`<CrudManager
  formVariant="modal"
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
      title="CrudManager (Modal variant)"
      description="Same API as drawer mode, but form surface is modal for focused editing."
      setup="Same API, with RTK Query mutations and modal form surface."
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <Provider store={store}>
              <CrudManagerProductsDemo
                useQuery={useProductsRtkQuery}
                formVariant="modal"
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
