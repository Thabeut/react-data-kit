import { Table, Typography } from "antd";
import { dynamicFormPropRows } from "./props-data";

const { Paragraph, Title } = Typography;

export function DynamicFormPropsPage() {
  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        Props reference
      </Title>
      <Paragraph type="secondary" style={{ maxWidth: 720 }}>
        Complete reference for the public `DynamicForm` API, including variants,
        field configuration, field-level validation, theming, and layout controls.
      </Paragraph>

      <Table
        className="docs-props-table"
        size="small"
        pagination={false}
        scroll={{ x: true }}
        rowKey="key"
        style={{ marginTop: 24 }}
        dataSource={dynamicFormPropRows}
        columns={[
          {
            title: "Prop",
            dataIndex: "prop",
            width: 220,
            fixed: "left",
            render: (v: string) => <code style={{ fontSize: 13 }}>{v}</code>,
          },
          {
            title: "Type",
            dataIndex: "type",
            width: 240,
            render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code>,
          },
          { title: "Required", dataIndex: "required", width: 120 },
          { title: "Description", dataIndex: "description" },
        ]}
      />
    </>
  );
}

