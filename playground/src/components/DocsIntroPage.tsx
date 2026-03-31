import type { ReactNode } from "react";
import { Divider, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";

const { Paragraph, Title } = Typography;

export type DocsIntroNextStep = {
  to: string;
  label: string;
  color?: string;
};

type DocsIntroSectionTable<T extends object> = {
  columns: ColumnsType<T>;
  rows: T[];
};

type DocsIntroPageProps<TProps extends object = Record<string, unknown>> = {
  title: string;
  description: ReactNode;
  installTitle: string;
  installSnippets: string[];
  propsTitle: string;
  propsIntro?: ReactNode;
  propsTable: DocsIntroSectionTable<TProps>;
  nextStepsTitle: string;
  nextSteps?: DocsIntroNextStep[];
};

export function DocsIntroPage<TProps extends object = Record<string, unknown>>({
  title,
  description,
  installTitle,
  installSnippets,
  propsTitle,
  propsIntro,
  propsTable,
  nextStepsTitle,
  nextSteps = [],
}: DocsIntroPageProps<TProps>) {
  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        {title}
      </Title>
      <Paragraph type="secondary" style={{ maxWidth: 900 }}>
        {description}
      </Paragraph>

      <Title level={4} style={{ marginBottom: 0 }}>
        {installTitle}
      </Title>
      {installSnippets.map((snippet) => (
        <pre key={snippet} className="docs-install-snippet">
          <code>{snippet}</code>
        </pre>
      ))}

      <Divider />
      <Title level={4} style={{ marginBottom: 0 }}>
        {propsTitle}
      </Title>
      {propsIntro ? (
        <Paragraph type="secondary" style={{ maxWidth: 900 }}>
          {propsIntro}
        </Paragraph>
      ) : null}
      <Table<TProps>
        className="docs-props-table"
        rowKey={(row) => String((row as { key?: unknown }).key ?? "")}
        size="small"
        columns={propsTable.columns}
        dataSource={propsTable.rows}
        pagination={false}
        scroll={{ x: true }}
      />

      <Divider />
      <Title level={4} style={{ marginBottom: 0 }}>
        {nextStepsTitle}
      </Title>
      <Space wrap style={{ marginTop: "8px" }}>
        {nextSteps.map((step) => (
          <Link key={`${step.to}-${step.label}`} to={step.to}>
            <Tag color={step.color}>{step.label}</Tag>
          </Link>
        ))}
      </Space>
    </>
  );
}
