import { Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { dataTablePropRows } from "./props-data";

const { Paragraph, Title } = Typography;

export function DataTablePropsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        {t("dtPagePropsTitle")}
      </Title>
      <Paragraph type="secondary" style={{ maxWidth: 720 }}>
        {t("dtPagePropsIntro")}
      </Paragraph>
      <Title level={4} style={{ marginBottom: 0 }}>
        {t("dtInstallTitle")}
      </Title>
      <pre className="docs-install-snippet">
        <code>{`npm install @thabeut/react-data-kit`}</code>
      </pre>
      <Paragraph type="secondary" style={{ maxWidth: 720 }}>
        {t("dtPagePropsSetup")}
      </Paragraph>
      <Table
        className="docs-props-table"
        size="small"
        pagination={false}
        scroll={{ x: true }}
        rowKey="key"
        style={{ marginTop: 24 }}
        dataSource={dataTablePropRows}
        columns={[
          {
            title: t("dtColProp"),
            dataIndex: "prop",
            width: 220,
            fixed: "left",
            render: (v: string) => (
              <code style={{ fontSize: 13 }}>{v}</code>
            ),
          },
          {
            title: t("dtColType"),
            dataIndex: "type",
            width: 200,
            render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code>,
          },
          {
            title: t("dtColRequired"),
            dataIndex: "required",
            width: 100,
          },
          {
            title: t("dtColDescription"),
            dataIndex: "description",
          },
        ]}
      />
    </>
  );
}
