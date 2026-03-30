import { Divider, Table, Typography } from "antd";
import { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";

const { Title, Paragraph } = Typography;

type Row = {
  key: string;
  topic: string;
  details: string;
};

const rows: Row[] = [
  {
    key: "what",
    topic: "What it is",
    details:
      "`CrudManager` composes `QueryTable` and `DynamicForm` into one component for add/edit flows.",
  },
  {
    key: "why",
    topic: "Why",
    details:
      "Centralize table + form wiring in one reusable feature while still passing through QueryTable and DynamicForm props.",
  },
  {
    key: "workflow",
    topic: "Workflow",
    details:
      "Toolbar Add opens create form, row Edit opens prefilled form, submit dispatches create/update callbacks.",
  },
  {
    key: "surface",
    topic: "Form surface",
    details:
      "Supports `drawer`, `modal`, and `default` variants. Drawer is the default.",
  },
];

export function CrudManagerIntroPage() {
  const columns: ColumnsType<Row> = useMemo(
    () => [
      { title: "Topic", dataIndex: "topic", key: "topic", width: 180 },
      { title: "Details", dataIndex: "details", key: "details" },
    ],
    [],
  );

  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        CrudManager Overview
      </Title>
      <Paragraph type="secondary" style={{ maxWidth: 900 }}>
        Query-driven CRUD feature built from `QueryTable` and `DynamicForm` with
        add/edit orchestration and pass-through API flexibility.
      </Paragraph>

      <Title level={4} style={{ marginBottom: 0 }}>
        Install
      </Title>
      <pre className="docs-install-snippet">
        <code>{`npm install @thabeut/react-data-kit`}</code>
      </pre>

      <Divider />

      <Table<Row>
        className="docs-props-table"
        rowKey="key"
        size="small"
        columns={columns}
        dataSource={rows}
        pagination={false}
        scroll={{ x: true }}
      />
    </>
  );
}
