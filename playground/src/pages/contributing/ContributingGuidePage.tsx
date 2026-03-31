import { Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Paragraph, Title } = Typography;
const REPO_URL = "https://github.com/Thabeut/react-data-kit.git";

export function ContributingGuidePage() {
  const { t } = useTranslation();

  return (
    <article className="docs-markdown">
      <Title level={2} style={{ marginTop: 0 }}>
        {t("contribTitle")}
      </Title>
      <Paragraph type="secondary" className="docs-markdown__lead">
        {t("contribSubtitle")}
      </Paragraph>

      <Paragraph className="docs-markdown__repo">
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          {REPO_URL}
        </a>
      </Paragraph>

      <section className="docs-markdown__section">
        <Title level={3}>{t("contribSectionWorkflow")}</Title>
        <ol>
          <li>{t("contribWorkflowFork")}</li>
          <li>{t("contribWorkflowClone")}</li>
          <li>{t("contribWorkflowBranch")}</li>
        </ol>
        <pre className="docs-install-snippet">
          <code>{`git clone https://github.com/Thabeut/react-data-kit.git
cd react-data-kit
git checkout -b feat/your-change-name`}</code>
        </pre>
      </section>

      <section className="docs-markdown__section">
        <Title level={3}>{t("contribSectionRun")}</Title>
        <Paragraph type="secondary">{t("contribRunIntro")}</Paragraph>
        <pre className="docs-install-snippet">
          <code>{`npm install
npm run playground:dev`}</code>
        </pre>
      </section>

      <section className="docs-markdown__section">
        <Title level={3}>{t("contribSectionChecks")}</Title>
        <Paragraph type="secondary">{t("contribChecksIntro")}</Paragraph>
        <pre className="docs-install-snippet">
          <code>{`npm run typecheck
npm run build
npm run playground:build`}</code>
        </pre>
      </section>

      <section className="docs-markdown__section">
        <Title level={3}>{t("contribSectionPr")}</Title>
        <ol>
          <li>{t("contribPrCommit")}</li>
          <li>{t("contribPrPush")}</li>
          <li>{t("contribPrOpen")}</li>
        </ol>
        <pre className="docs-install-snippet">
          <code>{`git add .
git commit -m "feat: short and clear summary"
git push origin feat/your-change-name`}</code>
        </pre>
      </section>

      <Paragraph type="secondary" className="docs-markdown__note">
        {t("contribFinalNote")}
      </Paragraph>
    </article>
  );
}

