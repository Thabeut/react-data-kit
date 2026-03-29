import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Button, Space } from "antd";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import "./example-preview-code-flip.css";

type ExamplePreviewCodeFlipProps = {
  view: ReactNode;
  code: string;
  defaultShow?: "preview" | "code";
  viewLabel?: string;
  codeLabel?: string;
};

export function ExamplePreviewCodeFlip({
  view,
  code,
  defaultShow = "preview",
  viewLabel,
  codeLabel,
}: ExamplePreviewCodeFlipProps) {
  const { t } = useTranslation();
  const [showCode, setShowCode] = useState(defaultShow === "code");
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(() => code.trim(), [code]);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(snippet);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="dt-example-flip">
      <div className="dt-example-flip__toolbar">
        <Space size={8} wrap>
          <Button
            size="small"
            onClick={() => setShowCode((v) => !v)}
            className="dt-example-flip__toggle"
          >
            {showCode
              ? (viewLabel ?? t("dtExampleShowPreview"))
              : (codeLabel ?? t("dtExampleShowCode"))}
          </Button>
          <Button
            size="small"
            onClick={copyToClipboard}
            className={`dt-example-flip__copy${copied ? " dt-example-flip__copy--copied" : ""}`}
            icon={
              copied ? (
                <Icon icon="lucide:check" width={16} height={16} aria-hidden />
              ) : (
                <Icon icon="lucide:copy" width={16} height={16} aria-hidden />
              )
            }
            disabled={!snippet}
          >
            {t("dtExampleCopy")}
          </Button>
        </Space>
      </div>

      <div className="dt-example-flip__stage" aria-live="polite">
        <motion.div
          className="dt-example-flip__card"
          animate={{ rotateY: showCode ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="dt-example-flip__face dt-example-flip__face--front">
            {view}
          </div>
          <div className="dt-example-flip__face dt-example-flip__face--back">
            <div className="dt-example-flip__code-head">
              <span className="dt-example-flip__code-label">
                {t("dtExampleCode")}
              </span>
            </div>
            <pre className="dt-example-flip__code">
              <code>{snippet}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
