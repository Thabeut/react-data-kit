import { Link } from "react-router-dom";
import { Card, Col, Row, Typography } from "antd";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/react-data-kit-logo.png";

const { Paragraph, Title } = Typography;

type HomeFeature = {
  icon: string;
  titleKey: string;
  descriptionKey: string;
};

type HomeCta = {
  to: string;
  key: string;
  icon: string;
};

const FEATURES: HomeFeature[] = [
  {
    icon: "mdi:view-grid-outline",
    titleKey: "homeFeatureDataTableTitle",
    descriptionKey: "homeFeatureDataTableDesc",
  },
  {
    icon: "mdi:database-search-outline",
    titleKey: "homeFeatureQueryTableTitle",
    descriptionKey: "homeFeatureQueryTableDesc",
  },
  {
    icon: "mdi:form-select",
    titleKey: "homeFeatureDynamicFormTitle",
    descriptionKey: "homeFeatureDynamicFormDesc",
  },
  {
    icon: "mdi:infinity",
    titleKey: "homeFeatureInfiniteScrollTitle",
    descriptionKey: "homeFeatureInfiniteScrollDesc",
  },
];

const HOME_CTAS: HomeCta[] = [
  { to: "/datatable/overview", key: "homeCtaDataTable", icon: "mdi:view-grid-outline" },
  {
    to: "/querytable/overview",
    key: "homeCtaQueryTable",
    icon: "mdi:database-search-outline",
  },
  { to: "/dynamicform/overview", key: "homeCtaDynamicForm", icon: "mdi:form-select" },
  {
    to: "/infinite-scroll/overview",
    key: "homeCtaInfiniteScroll",
    icon: "mdi:infinity",
  },
  { to: "/crudmanager/overview", key: "homeCtaCrudManager", icon: "mdi:table-edit" },
];

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="docs-home">
      <section className="docs-home-hero">
        <img src={logo} alt={t("homeLogoAlt")} className="docs-home-hero__logo" />
        <div className="docs-home-hero__content">
          <Title level={1} className="docs-home-hero__title">
            {t("homeHeroTitle")}
          </Title>
          <Paragraph className="docs-home-hero__subtitle" type="secondary">
            {t("homeHeroSubtitle")}
          </Paragraph>
          <p className="docs-home-stack-note">{t("homeStackNote")}</p>
          <div className="docs-home-cta-grid">
            {HOME_CTAS.map((cta) => (
              <Link key={cta.key} to={cta.to} className="docs-home-cta-link">
                <Icon icon={cta.icon} width={18} height={18} aria-hidden />
                <span>{t(cta.key)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="docs-home-features">
        <Title level={3}>{t("homeFeaturesTitle")}</Title>
        <Row gutter={[16, 16]}>
          {FEATURES.map((feature) => (
            <Col key={feature.titleKey} xs={24} md={12}>
              <Card className="docs-home-feature-card" bordered>
                <div className="docs-home-feature-card__icon">
                  <Icon icon={feature.icon} width={20} height={20} />
                </div>
                <Title level={4} className="docs-home-feature-card__title">
                  {t(feature.titleKey)}
                </Title>
                <Paragraph type="secondary" className="docs-home-feature-card__desc">
                  {t(feature.descriptionKey)}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="docs-home-contrib">
        <Paragraph type="secondary" className="docs-home-contrib__text">
          {t("homeContribPrompt")}{" "}
          <Link to="/contributing" className="docs-home-contrib__link">
            {t("homeContribLink")}
          </Link>
        </Paragraph>
      </section>
    </div>
  );
}
