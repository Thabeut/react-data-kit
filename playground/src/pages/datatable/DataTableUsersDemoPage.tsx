import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Tag, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import { Icon } from "@iconify/react";
import {
  DataTable,
  DataTableFilterTypeEnum,
  type InternalRow,
} from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { ICONS } from "../../constants/icons";
import {
  userDemoAvatarUrl,
  userDemoRows,
  type UserDemoRow,
} from "../../data/usersDemo";
import "./users-demo-page.scss";

dayjs.extend(relativeTime);

const ROLE_TAG_COLORS: Record<string, string> = {
  "Staff engineer": "blue",
  "Frontend lead": "geekblue",
  "Backend engineer": "cyan",
  "Design lead": "magenta",
  "Product designer": "purple",
  "UX researcher": "volcano",
  "Product manager": "processing",
  "Program manager": "gold",
  DevOps: "orange",
  "Support lead": "lime",
  Analytics: "green",
};

function roleTagColor(role: string): string {
  return ROLE_TAG_COLORS[role] ?? "default";
}

export function DataTableUsersDemoPage() {
  const { t, i18n } = useTranslation();
  const data = useMemo(() => userDemoRows, []);
  const filters = useMemo(
    () => [
      {
        id: "status",
        label: t("dtColStatus"),
        type: DataTableFilterTypeEnum.Multi,
        options: [
          { value: "active", label: t("dtUserStatus_active") },
          { value: "away", label: t("dtUserStatus_away") },
          { value: "offline", label: t("dtUserStatus_offline") },
        ],
      },
      {
        id: "department",
        label: t("dtColDepartment"),
        type: DataTableFilterTypeEnum.Multi,
        options: Array.from(new Set(data.map((row) => row.department))).map(
          (value) => ({
            value,
            label: value,
          }),
        ),
      },
      {
        id: "role",
        label: t("dtColRole"),
        type: DataTableFilterTypeEnum.Multi,
        options: Array.from(new Set(data.map((row) => row.role))).map(
          (value) => ({
            value,
            label: value,
          }),
        ),
      },
    ],
    [data, t],
  );

  const columnsInfo = useMemo(
    () => [
      {
        id: "member",
        label: t("dtUsersColMember"),
        dataIndex: "name",
        width: 280,
        render: (_value: unknown, record: InternalRow<UserDemoRow>) => {
          const row = record as UserDemoRow;
          return (
            <div className="users-demo-user-cell">
              <Avatar size={44} src={userDemoAvatarUrl(row.name)} alt="" />
              <div className="users-demo-user-cell__text">
                <span className="users-demo-user-cell__name">{row.name}</span>
                <Tooltip title={row.email}>
                  <span className="users-demo-user-cell__email">
                    {row.email}
                  </span>
                </Tooltip>
              </div>
            </div>
          );
        },
        sortable: true,
      },
      {
        id: "role",
        label: t("dtColRole"),
        dataIndex: "role",
        width: 180,
        render: (value: unknown) => (
          <Tag
            className="users-demo-role-tag"
            color={roleTagColor(String(value))}
          >
            {String(value)}
          </Tag>
        ),
      },
      {
        id: "location",
        label: t("dtUsersColLocation"),
        dataIndex: "location",
        width: 160,
        render: (value: unknown) => (
          <span className="users-demo-location">
            <Icon icon={ICONS.mapPin} width={16} height={16} aria-hidden />
            {String(value)}
          </span>
        ),
      },
      {
        id: "status",
        label: t("dtColStatus"),
        dataIndex: "status",
        width: 120,
        render: (value: unknown) => {
          const s = String(value) as UserDemoRow["status"];
          const color =
            s === "active" ? "success" : s === "away" ? "warning" : "default";
          return (
            <Tag color={color} style={{ margin: 0, borderRadius: 6 }}>
              {t(`dtUserStatus_${s}`)}
            </Tag>
          );
        },
      },
      {
        id: "joinedAt",
        label: t("dtUsersColJoined"),
        dataIndex: "joinedAt",
        width: 200,
        render: (value: unknown) => {
          const lang = i18n.language;
          const locale = lang.startsWith("fr")
            ? "fr"
            : lang.startsWith("ar")
              ? "ar"
              : "en";
          const d = dayjs(String(value)).locale(locale);
          return (
            <div className="users-demo-joined">
              <span>{d.format("MMM D, YYYY")}</span>
              <span className="users-demo-joined__rel">{d.fromNow()}</span>
            </div>
          );
        },
        sortable: true,
      },
      {
        id: "department",
        label: t("dtColDepartment"),
        dataIndex: "department",
        width: 140,
        render: (value: unknown) => (
          <Typography.Text type="secondary">{String(value)}</Typography.Text>
        ),
      },
    ],
    [t, i18n.language],
  );

  const code = String.raw`import { useMemo, useState } from "react";
import { Avatar, Tag, Tooltip, Typography } from "antd";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { DataTable, DataTableFilterTypeEnum, type InternalRow, type DataTableColumnInfo } from "@thabeut/react-data-kit";
import { ICONS } from "../../constants/icons";

dayjs.extend(relativeTime);

type UserDemoRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "away" | "offline";
  joinedAt: string;
  location: string;
};

const users: UserDemoRow[] = [
  { id: 1, name: "Amelia Chen", email: "amelia.chen@example.com", role: "Staff engineer", department: "Engineering", status: "active", joinedAt: "2021-03-12", location: "Berlin" },
  { id: 2, name: "Jordan Blake", email: "jordan.blake@example.com", role: "Frontend lead", department: "Engineering", status: "active", joinedAt: "2020-08-01", location: "Toronto" },
  { id: 3, name: "Priya Nair", email: "priya.nair@example.com", role: "Design lead", department: "Design", status: "away", joinedAt: "2019-11-04", location: "Singapore" },
];

const columnsInfo: DataTableColumnInfo<UserDemoRow>[] = [
  {
    id: "member",
    label: "Member",
    dataIndex: "name",
    render: (_value, record: InternalRow<UserDemoRow>) => {
      const row = record as UserDemoRow;
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar size={36} src={avatarUrl(row.name)} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <strong>{row.name}</strong>
            <Tooltip title={row.email}>
              <span>{row.email}</span>
            </Tooltip>
          </div>
        </div>
      );
    },
  },
  {
    id: "role",
    label: "Role",
    dataIndex: "role",
    render: (value) => <Tag color="blue">{String(value)}</Tag>,
  },
  {
    id: "location",
    label: "Location",
    dataIndex: "location",
    render: (value) => (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <Icon icon={ICONS.mapPin} width={16} height={16} />
        {String(value)}
      </span>
    ),
  },
  {
    id: "status",
    label: "Status",
    dataIndex: "status",
    render: (value) => {
      const v = String(value);
      const color = v === "active" ? "success" : v === "away" ? "warning" : "default";
      return <Tag color={color}>{v}</Tag>;
    },
  },
  {
    id: "joinedAt",
    label: "Joined",
    dataIndex: "joinedAt",
    render: (value) => {
      const d = dayjs(String(value));
      return (
        <div>
          <span>{d.format("MMM D, YYYY")}</span>
          <br />
          <Typography.Text type="secondary">{d.fromNow()}</Typography.Text>
        </div>
      );
    },
  },
  {
    id: "department",
    label: "Department",
    dataIndex: "department",
    render: (value) => (
      <Typography.Text type="secondary">{String(value)}</Typography.Text>
    ),
  },
];

const pagination = {
  pageSizeOptions: [10, 20, 50],
  defaultPageSize: 10,
};

const filters = [
  {
    id: "status",
    label: "Status",
    type: DataTableFilterTypeEnum.Multi,
    options: [
      { value: "active", label: "Active" },
      { value: "away", label: "Away" },
      { value: "offline", label: "Offline" },
    ],
  },
  {
    id: "department",
    label: "Department",
    type: DataTableFilterTypeEnum.Multi,
    options: [
      { value: "Engineering", label: "Engineering" },
      { value: "Design", label: "Design" },
      { value: "Operations", label: "Operations" },
      { value: "Product", label: "Product" },
      { value: "Support", label: "Support" },
      { value: "Data", label: "Data" },
    ],
  },
];

function avatarUrl(seed: string) {
  return \`https://api.dicebear.com/7.x/notionists/svg?seed=\${encodeURIComponent(seed)}\`;
}

export function DataTableUsersExample() {
  const data = useMemo(() => users, []);

  return (
    <DataTable<UserDemoRow>
      tableId="playground-users-demo"
      rowKey="id"
      columnResize
      dataSource={data}
      filters={filters}
      searchPlaceholder="Search users"
      pagination={pagination}
      columnsInfo={columnsInfo}
      actions={{
        onEdit: (row) => console.log("edit", row),
        onDelete: async (row) => console.log("delete", row),
        deleteModalConfig: {
          title: "Delete user?",
          description: "This action cannot be undone.",
          confirmLabel: "Delete",
          cancelLabel: "Cancel",
        },
      }}
      onBookmarkChange={(bookmarkedRowKeys, rows) => {
        console.log(bookmarkedRowKeys, rows);
      }}
      onRefresh={() => {
        console.log("refresh");
      }}
    />
  );
}`;

  return (
    <DemoPageShell
      title={t("dtPageUsersDemoTitle")}
      description={t("dtPageUsersDemoDesc")}
      setup={t("dtPageUsersDemoSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <DataTable<UserDemoRow>
            tableId="playground-users-demo"
            columnResize
            rowKey="id"
            dataSource={data}
            filters={filters}
            searchPlaceholder={t("searchByName")}
            pagination={{
              pageSizeOptions: [10, 20, 50],
              defaultPageSize: 10,
            }}
            columnsInfo={columnsInfo}
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
            onBookmarkChange={(bookmarkedRowKeys, rows) => {
              console.log(bookmarkedRowKeys, rows);
            }}
            onRefresh={() => {
              console.log("refresh");
            }}
          />
        }
        code={code}
      />
    </DemoPageShell>
  );
}
