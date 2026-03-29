import type { ReactNode } from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

type DemoPageShellProps = {
  title: string;
  description: string;
  setup?: string;
  children: ReactNode;
};

export function DemoPageShell({
  title,
  description,
  setup,
  children,
}: DemoPageShellProps) {
  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        {title}
      </Title>
      <Paragraph type="secondary" style={{ maxWidth: 720 }}>
        {description}
      </Paragraph>
      {setup ? (
        <Paragraph
          type="secondary"
          style={{ maxWidth: 720, fontFamily: "ui-monospace, monospace" }}
        >
          {setup}
        </Paragraph>
      ) : null}
      <div style={{ marginTop: 24 }}>{children}</div>
    </>
  );
}
