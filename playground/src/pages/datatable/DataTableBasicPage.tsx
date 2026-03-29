import { useTranslation } from "react-i18next";
import { DataTable } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { basicRows, type BasicRow } from "../../data";

export function DataTableBasicPage() {
  const { t } = useTranslation();
  const code = String.raw`import { DataTable } from "@thabeut/react-data-kit";

type BasicRow = { id: number; name: string; email: string };

const basicRows: BasicRow[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  { id: 2, name: "Alan Turing", email: "alan@example.com" },
  { id: 3, name: "Grace Hopper", email: "grace@example.com" },
];

export function BasicDataTableExample() {
  return (
    <DataTable<BasicRow>
      tableId="playground-basic"
      columnResize
      rowKey="id"
      dataSource={basicRows}
      pagination={{
        pageSizeOptions: [10, 20, 50],
        defaultPageSize: 10,
      }}
      columnsInfo={[
        { id: "name", label: "Name", dataIndex: "name" },
        { id: "email", label: "Email", dataIndex: "email" },
      ]}
      actions={{
        onEdit: (row) => console.log("edit", row),
        onDelete: async (row) => console.log("delete", row),
        deleteModalConfig: {
          title: "Delete row",
          description: "Are you sure you want to delete this row?",
          confirmLabel: "Delete",
          cancelLabel: "Cancel",
        },
      }}
    />
  );
}`;

  return (
    <DemoPageShell
      title={t("dtPageBasicTitle")}
      description={t("dtPageBasicDesc")}
      setup={t("dtPageBasicSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <DataTable<BasicRow>
            tableId="playground-basic"
            columnResize
            rowKey="id"
            dataSource={basicRows}
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
            actions={{
              onEdit: (row) => console.log("edit", row),
              onDelete: async (row) => {
                console.log("delete", row);
              },
              deleteModalConfig: {
                title: t("deleteConfirmTitle"),
                description: t("deleteConfirmDescription"),
                confirmLabel: t("actionDelete"),
                cancelLabel: t("cancel"),
              },
            }}
          />
        }
        code={code}
      />
    </DemoPageShell>
  );
}
