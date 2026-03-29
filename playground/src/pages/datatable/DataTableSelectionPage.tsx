import { Typography } from "antd";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DataTableKey } from "@thabeut/react-data-kit";
import { DataTable } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { basicRows, type BasicRow } from "../../data";

const { Text } = Typography;

export function DataTableSelectionPage() {
  const { t } = useTranslation();
  const [selectedKeys, setSelectedKeys] = useState<DataTableKey[]>([]);
  const [bookmarkKeys, setBookmarkKeys] = useState<DataTableKey[]>([]);

  const selectionSummary = useMemo(
    () => selectedKeys.join(", ") || "—",
    [selectedKeys],
  );
  const bookmarkSummary = useMemo(
    () => bookmarkKeys.join(", ") || "—",
    [bookmarkKeys],
  );

  const code = String.raw`import { useMemo, useState } from "react";
import { DataTable, type DataTableKey } from "@thabeut/react-data-kit";

type BasicRow = { id: number; name: string; email: string };

const basicRows: BasicRow[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  { id: 2, name: "Alan Turing", email: "alan@example.com" },
  { id: 3, name: "Grace Hopper", email: "grace@example.com" },
];

export function DataTableSelectionExample() {
  const [selectedKeys, setSelectedKeys] = useState<DataTableKey[]>([]);
  const [bookmarkKeys, setBookmarkKeys] = useState<DataTableKey[]>([]);

  const selectionSummary = useMemo(() => selectedKeys.join(", ") || "—", [selectedKeys]);
  const bookmarkSummary = useMemo(() => bookmarkKeys.join(", ") || "—", [bookmarkKeys]);

  console.log(selectionSummary, bookmarkSummary);

  return (
    <DataTable<BasicRow>
      tableId="playground-selection"
      columnResize
      rowKey="id"
      dataSource={basicRows}
      pagination={{ pageSizeOptions: [10, 20, 50], defaultPageSize: 10 }}
      onSelectionChange={(keys) => setSelectedKeys(keys)}
      onBookmarkChange={(keys) => setBookmarkKeys(keys)}
      onRefresh={() => console.log("refresh")}
      columnsInfo={[
        { id: "name", label: "Name", dataIndex: "name" },
        { id: "email", label: "Email", dataIndex: "email" },
      ]}
    />
  );
}`;

  return (
    <DemoPageShell
      title={t("dtPageSelectionTitle")}
      description={t("dtPageSelectionDesc")}
      setup={t("dtPageSelectionSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">
                {t("dtSelectionState")}: {selectionSummary}
              </Text>
              <br />
              <Text type="secondary">
                {t("dtBookmarkState")}: {bookmarkSummary}
              </Text>
            </div>
            <DataTable<BasicRow>
              tableId="playground-selection"
              columnResize
              rowKey="id"
              dataSource={basicRows}
              pagination={{
                pageSizeOptions: [10, 20, 50],
                defaultPageSize: 10,
              }}
              onSelectionChange={(keys) => setSelectedKeys(keys)}
              onBookmarkChange={(keys) => setBookmarkKeys(keys)}
              onRefresh={() => console.log("refresh")}
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
