import { useMemo, useState } from "react";
import { Button, Input, Space, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { DataTable } from "@thabeut/react-data-kit";
import type { DataTableCustomColors } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { buildLargeRows, type BasicRow } from "../../data";

const { Text } = Typography;

type ColorRow = BasicRow & {
  status: "Active" | "Away" | "Offline";
  category: "Core" | "Billing" | "Security";
  updatedAt: string;
};

type ColorState = {
  primary: string;
  lightSurfaceBg: string;
  lightPopoverBg: string;
  lightPopoverOptionHover: string;
  lightSurfaceBorder: string;
  lightTextPrimary: string;
  lightRowHover: string;
  lightRowSelected: string;
  lightGroupRow: string;
  darkSurfaceBg: string;
  darkPopoverBg: string;
  darkPopoverOptionHover: string;
  darkSurfaceBorder: string;
  darkTextPrimary: string;
  darkRowHover: string;
  darkRowSelected: string;
  darkGroupRow: string;
};

const defaults: ColorState = {
  primary: "#0ea5e9",
  lightSurfaceBg: "#f0f9ff",
  lightPopoverBg: "#ecfeff",
  lightPopoverOptionHover: "#eff6ff",
  lightSurfaceBorder: "#7dd3fc",
  lightTextPrimary: "#0f172a",
  lightRowHover: "#e0f2fe",
  lightRowSelected: "#bae6fd",
  lightGroupRow: "#f0f9ff",
  darkSurfaceBg: "#0b2537",
  darkPopoverBg: "#0f3348",
  darkPopoverOptionHover: "#1a4158",
  darkSurfaceBorder: "#0284c7",
  darkTextPrimary: "#e0f2fe",
  darkRowHover: "#0f3348",
  darkRowSelected: "#155e75",
  darkGroupRow: "#0b2537",
};

export function DataTableColorsPage() {
  const { t } = useTranslation();
  const [colors, setColors] = useState<ColorState>(defaults);
  const rows = useMemo<ColorRow[]>(
    () =>
      buildLargeRows(120).map((row, i) => ({
        ...row,
        status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Away" : "Offline",
        category: i % 3 === 0 ? "Core" : i % 3 === 1 ? "Billing" : "Security",
        updatedAt: `2025-01-${String((i % 28) + 1).padStart(2, "0")}`,
      })),
    [],
  );

  const customColors = useMemo<DataTableCustomColors>(
    () => ({
      primaryColor: colors.primary,
      lightMode: {
        surfaceBg: colors.lightSurfaceBg,
        popoverBg: colors.lightPopoverBg,
        popoverOptionHoverBg: colors.lightPopoverOptionHover,
        surfaceBorder: colors.lightSurfaceBorder,
        textPrimary: colors.lightTextPrimary,
        rowHoverBg: colors.lightRowHover,
        rowSelectedBg: colors.lightRowSelected,
        groupRowBg: colors.lightGroupRow,
      },
      darkMode: {
        surfaceBg: colors.darkSurfaceBg,
        popoverBg: colors.darkPopoverBg,
        popoverOptionHoverBg: colors.darkPopoverOptionHover,
        surfaceBorder: colors.darkSurfaceBorder,
        textPrimary: colors.darkTextPrimary,
        rowHoverBg: colors.darkRowHover,
        rowSelectedBg: colors.darkRowSelected,
        groupRowBg: colors.darkGroupRow,
      },
    }),
    [colors],
  );

  const code = String.raw`import { useMemo, useState } from "react";
import { Tag } from "antd";
import {
  DataTable,
  type DataTableCustomColors,
  type DataTableFilterConfig,
  type DataTableColumnInfo,
  type IMultiFilterOption,
  type IDateFilterOption,
} from "@thabeut/react-data-kit";

type Row = {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Away" | "Offline";
  category: "Core" | "Billing" | "Security";
  updatedAt: string;
};

const rows: Row[] = Array.from({ length: 120 }).map((_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
  status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Away" : "Offline",
  category: i % 3 === 0 ? "Core" : i % 3 === 1 ? "Billing" : "Security",
  updatedAt: \`2025-01-\${String((i % 28) + 1).padStart(2, "0")}\`,
}));

const statusOptions: IMultiFilterOption[] = [
  { value: "Active", label: "Active" },
  { value: "Away", label: "Away" },
  { value: "Offline", label: "Offline" },
];

const categoryOptions: IMultiFilterOption[] = [
  { value: "Core", label: "Core" },
  { value: "Billing", label: "Billing" },
  { value: "Security", label: "Security" },
];

const dateOptions: IDateFilterOption[] = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "custom", label: "Custom range" },
];

const filters: DataTableFilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "multi",
    options: statusOptions,
  },
  {
    id: "category",
    label: "Category",
    type: "multi",
    options: categoryOptions,
  },
  {
    id: "updatedAt",
    label: "Updated",
    type: "date",
    dateOptions,
  },
];

const columnsInfo: DataTableColumnInfo<Row>[] = [
  { id: "name", label: "Name", dataIndex: "name" },
  { id: "email", label: "Email", dataIndex: "email" },
  { id: "status", label: "Status", dataIndex: "status" },
  { id: "category", label: "Category", dataIndex: "category" },
  { id: "updatedAt", label: "Updated", dataIndex: "updatedAt" },
];

const pagination = {
  pageSizeOptions: [10, 20, 50],
  defaultPageSize: 10,
};

export function DataTableColorsExample() {
  const [primary, setPrimary] = useState("#0ea5e9");
  const [lightBg, setLightBg] = useState("#f0f9ff");
  const [lightPopoverBg, setLightPopoverBg] = useState("#ecfeff");
  const [darkBg, setDarkBg] = useState("#0b2537");
  const [darkPopoverBg, setDarkPopoverBg] = useState("#0f3348");
  const customColors = useMemo<DataTableCustomColors>(
    () => ({
      primaryColor: primary,
      lightMode: { surfaceBg: lightBg, popoverBg: lightPopoverBg },
      darkMode: { surfaceBg: darkBg, popoverBg: darkPopoverBg },
    }),
    [primary, lightBg, lightPopoverBg, darkBg, darkPopoverBg],
  );

  return (
    <>
      <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} />
      <DataTable<Row>
        tableId="colors-example"
        columnResize
        rowKey="id"
        dataSource={rows}
        customColors={customColors}
        maxTableHeight="380px"
        filters={filters}
        searchPlaceholder="Search users"
        onRefresh={() => console.log("refresh")}
        renderToolbarLeft={
          <Tag
            style={{
              borderColor: primary,
              color: primary,
              background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
            }}
          >
            Theme test
          </Tag>
        }
        onRowClick={(row) => console.log("click", row.id)}
        pagination={pagination}
        columnsInfo={columnsInfo}
      />
    </>
  );
}`;

  return (
    <DemoPageShell
      title={t("dtPageColorsTitle")}
      description={t("dtPageColorsDesc")}
      setup={t("dtPageColorsSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <Space
              wrap
              size={12}
              style={{ marginBottom: 16, alignItems: "end" }}
            >
              <label>
                <Text>{t("dtColorsPrimary")}</Text>
                <Input
                  type="color"
                  value={colors.primary}
                  onChange={(e) =>
                    setColors((prev) => ({ ...prev, primary: e.target.value }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsLightBg")}</Text>
                <Input
                  type="color"
                  value={colors.lightSurfaceBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightSurfaceBg: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsLightPopoverBg")}</Text>
                <Input
                  type="color"
                  value={colors.lightPopoverBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightPopoverBg: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsLightPopoverHover")}</Text>
                <Input
                  type="color"
                  value={colors.lightPopoverOptionHover}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightPopoverOptionHover: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsLightBorder")}</Text>
                <Input
                  type="color"
                  value={colors.lightSurfaceBorder}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightSurfaceBorder: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsLightText")}</Text>
                <Input
                  type="color"
                  value={colors.lightTextPrimary}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightTextPrimary: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsLightRowHover")}</Text>
                <Input
                  type="color"
                  value={colors.lightRowHover}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightRowHover: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsLightRowSelected")}</Text>
                <Input
                  type="color"
                  value={colors.lightRowSelected}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightRowSelected: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsLightGroupRow")}</Text>
                <Input
                  type="color"
                  value={colors.lightGroupRow}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightGroupRow: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsDarkBg")}</Text>
                <Input
                  type="color"
                  value={colors.darkSurfaceBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkSurfaceBg: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsDarkRowHover")}</Text>
                <Input
                  type="color"
                  value={colors.darkRowHover}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkRowHover: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsDarkRowSelected")}</Text>
                <Input
                  type="color"
                  value={colors.darkRowSelected}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkRowSelected: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsDarkGroupRow")}</Text>
                <Input
                  type="color"
                  value={colors.darkGroupRow}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkGroupRow: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsDarkPopoverBg")}</Text>
                <Input
                  type="color"
                  value={colors.darkPopoverBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkPopoverBg: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsDarkPopoverHover")}</Text>
                <Input
                  type="color"
                  value={colors.darkPopoverOptionHover}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkPopoverOptionHover: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsDarkBorder")}</Text>
                <Input
                  type="color"
                  value={colors.darkSurfaceBorder}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkSurfaceBorder: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>{t("dtColorsDarkText")}</Text>
                <Input
                  type="color"
                  value={colors.darkTextPrimary}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkTextPrimary: e.target.value,
                    }))
                  }
                />
              </label>
              <Button onClick={() => setColors(defaults)}>
                {t("dtColorsReset")}
              </Button>
            </Space>
            <DataTable<ColorRow>
              columnResize
              tableId="playground-colors"
              rowKey="id"
              dataSource={rows}
              customColors={customColors}
              maxTableHeight="380px"
              filters={[
                {
                  id: "status",
                  label: t("dtFilterStatus"),
                  type: "multi",
                  options: [
                    { value: "Active", label: "Active" },
                    { value: "Away", label: "Away" },
                    { value: "Offline", label: "Offline" },
                  ],
                },
                {
                  id: "category",
                  label: t("dtFilterCategory"),
                  type: "multi",
                  options: [
                    { value: "Core", label: "Core" },
                    { value: "Billing", label: "Billing" },
                    { value: "Security", label: "Security" },
                  ],
                },
                {
                  id: "updatedAt",
                  label: t("dtFilterPeriod"),
                  type: "date",
                  dateOptions: [
                    { value: "today", label: t("dtDateToday") },
                    { value: "last_7_days", label: t("dtDateLast7") },
                    { value: "custom", label: t("dtDateCustomRange") },
                  ],
                },
              ]}
              searchPlaceholder={t("searchByName")}
              onRefresh={() => console.log("refresh")}
              renderToolbarLeft={
                <Tag
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    background:
                      "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                  }}
                >
                  {t("dtPageColorsTitle")}
                </Tag>
              }
              onRowClick={(row) => console.log("click", row)}
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
              pagination={{
                pageSizeOptions: [10, 20, 50],
                defaultPageSize: 10,
              }}
              columnsInfo={[
                { id: "name", label: t("Name"), dataIndex: "name" },
                { id: "email", label: t("Email"), dataIndex: "email" },
                { id: "status", label: t("dtColStatus"), dataIndex: "status" },
                {
                  id: "category",
                  label: t("dtColCategory"),
                  dataIndex: "category",
                },
                {
                  id: "updatedAt",
                  label: t("dtColUpdated"),
                  dataIndex: "updatedAt",
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
