import { Empty, Skeleton, Space, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { InfiniteScrollRQ } from "@thabeut/react-data-kit";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { DemoPageShell } from "../../components/DemoPageShell";
import type { DummyJsonListResponse } from "../querytable/adapters/useProductsRtkQuery";
import { useInfiniteProductsReactQuery } from "../querytable/adapters/useProductsReactQuery";
import {
  ProductCard,
  ProductCardModel,
  rtkResultSelectors,
} from "./productsShared";

const { Title, Paragraph } = Typography;

export function InfiniteScrollProductsReactQueryPage() {
  const { t } = useTranslation();
  const title = t("isReactPageTitle");
  const description = t("isReactPageDescription");

  const reactQuerySnippet = String.raw`import { InfiniteScrollRQ } from "@thabeut/react-data-kit";
import { useInfiniteProductsReactQuery } from "./services/productsReact";

type ProductCardModel = {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  category: string;
};

type DummyJsonListResponse = {
  products: ProductCardModel[];
  total: number;
  skip: number;
  limit: number;
};

export function ProductsInfiniteScrollReactQuery() {
  const infiniteResult = useInfiniteProductsReactQuery({
    limit: 8,
    sort: { field: "title", direction: "asc" },
  });

  return (
    <InfiniteScrollRQ<ProductCardModel, DummyJsonListResponse>
      heightClass="infinite-scroll-demo-height"
      useInfiniteQuery={() => infiniteResult}
      selectItemsFromPage={(page) => page.products}
      getKey={(item) => String(item.id)}
      emptyState={<div>No products found</div>}
      renderItem={(item) => <div>{item.title}</div>}
    />
  );
}`;

  const resultSelectors = rtkResultSelectors;

  return (
    <DemoPageShell
      title={title}
      description={description}
      setup={t("isReactPageSetup")}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <ExamplePreviewCodeFlip
          defaultShow="preview"
          view={
            <div
              style={{
                border: "1px solid var(--ant-color-border)",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <InfiniteScrollRQ<ProductCardModel, DummyJsonListResponse>
                heightClass="infinite-scroll-demo-height"
                useInfiniteQuery={() =>
                  useInfiniteProductsReactQuery({
                    limit: 8,
                    sort: { field: "title", direction: "asc" },
                  })
                }
                selectItemsFromPage={resultSelectors.selectItems}
                getKey={(item) => String(item.id)}
                emptyState={<Empty description={t("isNoProductsFound")} />}
                renderItem={(item) => <ProductCard product={item} />}
                renderInitialLoader={
                  <div style={{ padding: 12 }}>
                    <Skeleton active paragraph={{ rows: 4 }} />
                    <Skeleton active paragraph={{ rows: 4 }} />
                  </div>
                }
                renderFetchingLoader={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingBottom: 12,
                    }}
                  >
                    <Space>
                      <Spin size="small" />
                      <Paragraph style={{ marginBottom: 0 }}>
                        {t("isLoadingMoreProducts")}
                      </Paragraph>
                    </Space>
                  </div>
                }
              />
            </div>
          }
          code={reactQuerySnippet}
        />

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4} style={{ marginBottom: 0 }}>
            {t("isReactHowToTitle")}
          </Title>
          <Paragraph type="secondary" style={{ maxWidth: 900 }}>
            {t("isReactHowToDesc")}
          </Paragraph>
        </Space>
      </Space>
    </DemoPageShell>
  );
}

