import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Tag, Typography } from "antd";
import { DataTable } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { buildLargeRows, type BasicRow } from "../../data";

const { Text } = Typography;

const SCROLL_ROWS = 48;

export function DataTableLayoutPage() {
  const { t } = useTranslation();
  const [lastClicked, setLastClicked] = useState<BasicRow | null>(null);
  const [hideColumnToggle, setHideColumnToggle] = useState(false);

  const allRows = useMemo(() => buildLargeRows(SCROLL_ROWS), []);

  const code = String.raw`import { useMemo, useState } from "react";
import { Tag } from "antd";
import { DataTable } from "@thabeut/react-data-kit";

type BasicRow = { id: number; name: string; email: string };

const rows: BasicRow[] = Array.from({ length: 48 }).map((_, i) => ({
  id: i + 1,
  name: \`User \${i + 1}\`,
  email: \`user\${i + 1}@example.com\`,
}));

export function DataTableLayoutExample() {
  const [hideColumnToggle, setHideColumnToggle] = useState(false);
  const [lastClicked, setLastClicked] = useState<BasicRow | null>(null);

  console.log(hideColumnToggle, lastClicked);

  return (
    <DataTable<BasicRow>
      tableId="playground-layout"
      rowKey="id"
      columnResize
      dataSource={rows}
      maxTableHeight="min(320px, 45vh)"
      disableSelectionAndBookmark
      hideColumnOptions={hideColumnToggle}
      pagination={{ pageSizeOptions: [10, 20, 50, 100], defaultPageSize: 50 }}
      onRowClick={(row) => setLastClicked(row)}
      renderToolbarLeft={<Tag color="processing">Left slot</Tag>}
      renderToolbarRight={<Tag color="default">Right slot</Tag>}
      columnsInfo={[
        { id: "name", label: "Name", dataIndex: "name" },
        { id: "email", label: "Email", dataIndex: "email" },
      ]}
    />
  );
}`;

  return (
    <DemoPageShell
      title={t("dtPageLayoutTitle")}
      description={t("dtPageLayoutDesc")}
      setup={t("dtPageLayoutSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <Switch
                  checked={hideColumnToggle}
                  onChange={setHideColumnToggle}
                  size="small"
                />
                <Text type="secondary">{t("dtLayoutHideColumnsToggle")}</Text>
              </label>
              {lastClicked ? (
                <Text type="secondary">
                  {t("dtLayoutLastClick")}:{" "}
                  <Text strong>
                    {lastClicked.name} (id {lastClicked.id})
                  </Text>
                </Text>
              ) : (
                <Text type="secondary">{t("dtLayoutClickHint")}</Text>
              )}
            </div>

            <DataTable<BasicRow>
              className="playground-datatable-layout"
              tableId="playground-layout"
              columnResize
              rowKey="id"
              dataSource={allRows}
              maxTableHeight="min(320px, 45vh)"
              disableSelectionAndBookmark
              hideColumnOptions={hideColumnToggle}
              pagination={{
                pageSizeOptions: [10, 20, 50, 100],
                defaultPageSize: 50,
              }}
              onRowClick={(row) => setLastClicked(row)}
              renderToolbarLeft={
                <Tag color="processing">{t("dtLayoutToolbarLeftSlot")}</Tag>
              }
              renderToolbarRight={
                <Tag color="default">{t("dtLayoutToolbarRightSlot")}</Tag>
              }
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
