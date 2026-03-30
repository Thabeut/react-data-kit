import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { DataTable } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { basicRows, type BasicRow } from "../../data";

export function DataTableLoadingPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const code = String.raw`import { useState } from "react";
import { DataTable, type DataTableColumnInfo } from "@thabeut/react-data-kit";

type BasicRow = { id: number; name: string; email: string };

const basicRows: BasicRow[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  { id: 2, name: "Alan Turing", email: "alan@example.com" },
  { id: 3, name: "Grace Hopper", email: "grace@example.com" },
];

const columnsInfo: DataTableColumnInfo<BasicRow>[] = [
  { id: "name", label: "Name", dataIndex: "name" },
  { id: "email", label: "Email", dataIndex: "email" },
];

const pagination = { pageSizeOptions: [10, 20, 50], defaultPageSize: 10 };

export function DataTableLoadingExample() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setLoading((v) => !v)}>
        Toggle loading
      </button>

      <DataTable<BasicRow>
        tableId="playground-loading"
        columnResize
        rowKey="id"
        dataSource={basicRows}
        loading={loading}
        pagination={pagination}
        columnsInfo={columnsInfo}
      />
    </>
  );
}`;

  return (
    <DemoPageShell
      title={t("dtPageLoadingTitle")}
      description={t("dtPageLoadingDesc")}
      setup={t("dtPageLoadingSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={() => setLoading((v) => !v)}>
                {loading ? t("dtLoadingOff") : t("dtLoadingOn")}
              </Button>
            </div>
            <DataTable<BasicRow>
              tableId="playground-loading"
              columnResize
              rowKey="id"
              dataSource={basicRows}
              loading={loading}
              pagination={{
                pageSizeOptions: [10, 20, 50],
                defaultPageSize: 10,
              }}
              columnsInfo={[
                {
                  id: "name",
                  label: t("Name"),
                  dataIndex: "name",
                },
                {
                  id: "email",
                  label: t("Email"),
                  dataIndex: "email",
                },
              ]}
            />
          </>
        }
        code={code}
      />
    </DemoPageShell>
  );
}
