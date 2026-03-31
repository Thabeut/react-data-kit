import { Empty, Skeleton, Space, Spin, Typography } from "antd";
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
  const title = "Infinite products feed (React Query)";
  const description =
    "How to build an infinite products feed using React Query's useInfiniteQuery hook. This page focuses on the data side; you can plug it into InfiniteScrollList or any custom list.";

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
      setup="This example shows a useInfiniteQuery-powered InfiniteScrollList. Users can paste the snippet into their app and plug in their own API."
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
                emptyState={<Empty description="No products found" />}
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
                        Loading more products...
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
            How to make the React Query hook
          </Title>
          <Paragraph type="secondary" style={{ maxWidth: 900 }}>
            The core is <code>useInfiniteQuery</code> with a{" "}
            <code>getNextPageParam</code> that reads <code>skip</code> and{" "}
            <code>limit</code> from the API response. You can see the full
            library implementation in <code>useProductsReactQuery.ts</code>.
          </Paragraph>
        </Space>
      </Space>
    </DemoPageShell>
  );
}

