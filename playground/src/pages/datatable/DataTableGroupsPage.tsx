import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Segmented } from "antd";
import { DataTable } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { groupedRows, type GroupedRow } from "../../data";
import "./users-demo-page.scss";

type GroupBy = "department" | "role";

export function DataTableGroupsPage() {
  const { t } = useTranslation();
  const [groupBy, setGroupBy] = useState<GroupBy>("department");

  const data = useMemo(() => groupedRows, []);

  const groupConfig = useMemo(() => {
    if (groupBy === "department") {
      return {
        getGroupLabel: (row: GroupedRow) => row.department,
        order: ["Platform", "Product", "Research"],
        groupIcon: "lucide:building-2",
      };
    }
    return {
      getGroupLabel: (row: GroupedRow) => row.role,
      order: ["Engineer", "Researcher", "Architect"],
      groupIcon: "lucide:briefcase",
    };
  }, [groupBy]);

  const code = String.raw`import { useMemo, useState } from "react";
import {
  DataTable,
  type DataTableColumnInfo,
  type DataTableGroupConfig,
} from "@thabeut/react-data-kit";

type GroupedRow = {
  id: number;
  name: string;
  role: string;
  department: string;
};

type GroupBy = "department" | "role";

const groupedRows: GroupedRow[] = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", department: "Platform" },
  { id: 2, name: "Alan Turing", role: "Researcher", department: "Platform" },
  { id: 3, name: "Grace Hopper", role: "Engineer", department: "Product" },
  { id: 4, name: "Barbara Liskov", role: "Architect", department: "Platform" },
  { id: 5, name: "Margaret Hamilton", role: "Engineer", department: "Product" },
  { id: 6, name: "Donald Knuth", role: "Researcher", department: "Research" },
];

export function DataTableGroupsExample() {
  const [groupBy, setGroupBy] = useState<GroupBy>("department");

  const groupConfig = useMemo<DataTableGroupConfig<GroupedRow>>(() => {
    if (groupBy === "department") {
      return {
        getGroupLabel: (row: GroupedRow) => row.department,
        order: ["Platform", "Product", "Research"],
        groupIcon: "lucide:building-2",
      };
    }
    return {
      getGroupLabel: (row: GroupedRow) => row.role,
      order: ["Engineer", "Researcher", "Architect"],
      groupIcon: "lucide:briefcase",
    };
  }, [groupBy]);

  const columnsInfo: DataTableColumnInfo<GroupedRow>[] = [
    { id: "name", label: "Name", dataIndex: "name" },
    { id: "role", label: "Role", dataIndex: "role" },
    { id: "department", label: "Department", dataIndex: "department" },
  ];

const pagination = {
  pageSizeOptions: [10, 20, 50],
  defaultPageSize: 10,
};

  return (
    <DataTable<GroupedRow>
      tableId="playground-groups"
      columnResize
      rowKey="id"
      dataSource={groupedRows}
      groupConfig={groupConfig}
      pagination={pagination}
      columnsInfo={columnsInfo}
    />
  );
}`;

  return (
    <DemoPageShell
      title={t("dtPageGroupsTitle")}
      description={t("dtPageGroupsDesc")}
      setup={t("dtPageGroupsSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <div className="users-demo">
              <div className="users-demo__toolbar">
                <p className="users-demo__toolbar-label">
                  {t("dtUsersGroupBy")}
                </p>
                <Segmented<GroupBy>
                  className="users-demo__segment"
                  value={groupBy}
                  onChange={setGroupBy}
                  options={[
                    { label: t("dtUsersGroupByDept"), value: "department" },
                    { label: t("dtUsersGroupByRole"), value: "role" },
                  ]}
                />
              </div>
            </div>

            <DataTable<GroupedRow>
              tableId="playground-groups"
              columnResize
              rowKey="id"
              dataSource={data}
              groupConfig={groupConfig}
              pagination={{
                pageSizeOptions: [10, 20, 50],
                defaultPageSize: 10,
              }}
              columnsInfo={[
                {
                  id: "name",
                  label: t("dtColName"),
                  dataIndex: "name",
                },
                {
                  id: "role",
                  label: t("dtColRole"),
                  dataIndex: "role",
                },
                {
                  id: "department",
                  label: t("dtColDepartment"),
                  dataIndex: "department",
                },
              ]}
              actions={{
                onEdit: (row) => console.log("edit", row),
                onDelete: async (row) => console.log("delete", row),
                deleteModalConfig: {
                  title: t("deleteConfirmTitle"),
                  description: t("deleteConfirmDescription"),
                  confirmLabel: t("actionDelete"),
                  cancelLabel: t("cancel"),
                },
              }}
            />
          </>
        }
        code={code}
      />
    </DemoPageShell>
  );
}
