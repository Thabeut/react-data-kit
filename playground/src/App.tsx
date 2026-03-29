import { Typography } from "antd";
import { REACT_DATA_KIT_VERSION } from "@thabeut/react-data-kit";
import "antd/dist/reset.css";

const { Title, Paragraph, Text } = Typography;

export default function App() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "3rem 1.5rem",
      }}
    >
      <Title level={2} style={{ marginTop: 0 }}>
        react-data-kit playground
      </Title>
      <Paragraph>
        Placeholder app for developing components. Library version from{" "}
        <Text code>@thabeut/react-data-kit</Text>:{" "}
        <Text strong>{REACT_DATA_KIT_VERSION}</Text>
      </Paragraph>
      <Paragraph type="secondary">
        Run the library watcher in another terminal with{" "}
        <Text code>npm run dev</Text> at the repo root while iterating on{" "}
        <Text code>src/</Text>.
      </Paragraph>
    </main>
  );
}
