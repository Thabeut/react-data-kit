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
      "`DynamicForm` renders a form from a `fields[]` config, validates with Yup + React Hook Form, and can render inline, in a Modal, or in a Drawer.",
  },
  {
    key: "why",
    topic: "Why",
    details:
      "Centralize form layout, validation wiring, required indicators, and variant containers (default/modal/drawer) so your pages stay thin.",
  },
  {
    key: "validation",
    topic: "Validation",
    details:
      "Define validation with `fieldSchema` on each field. DynamicForm generates the Yup object schema from these per-field rules.",
  },
  {
    key: "fields",
    topic: "Field types",
    details:
      "input, select, textarea, asyncSelect, upload (UploadFile[]), avatar, color, stringArray, switch, and custom render slots.",
  },
  {
    key: "theming",
    topic: "Light/dark + colors",
    details:
      "The playground toggles `html.dark` / `data-theme`. Use `customColors` to override surface/border/text/primary for both modes.",
  },
];

export function DynamicFormIntroPage() {
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
        DynamicForm Overview
      </Title>
      <Paragraph type="secondary" style={{ maxWidth: 900 }}>
        Build package-ready forms from typed field definitions, run validation from
        each field's `fieldSchema`, and render consistently in inline, modal, and
        drawer views.
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

