import { Table, Typography } from "antd";
import { crudManagerPropRows } from "./props-data";

const { Paragraph, Title } = Typography;

export function CrudManagerPropsPage() {
  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        Props reference
      </Title>
      <Paragraph type="secondary" style={{ maxWidth: 720 }}>
        Public `CrudManager` API with QueryTable pass-through, DynamicForm
        pass-through, and create/edit lifecycle props.
      </Paragraph>

      <Table
        className="docs-props-table"
        size="small"
        pagination={false}
        scroll={{ x: true }}
        rowKey="key"
        style={{ marginTop: 24 }}
        dataSource={crudManagerPropRows}
        columns={[
          {
            title: "Prop",
            dataIndex: "prop",
            width: 260,
            fixed: "left",
            render: (v: string) => <code style={{ fontSize: 13 }}>{v}</code>,
          },
          {
            title: "Type",
            dataIndex: "type",
            width: 260,
            render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code>,
          },
          { title: "Required", dataIndex: "required", width: 120 },
          { title: "Description", dataIndex: "description" },
        ]}
      />
    </>
  );
}
