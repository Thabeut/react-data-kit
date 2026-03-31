import { useMemo } from "react";
import { Empty, Skeleton, Space, Spin, Typography } from "antd";
import {
  InfiniteScrollRTK,
  type InfiniteScrollQueryArgs,
} from "@thabeut/react-data-kit";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { DemoPageShell } from "../../components/DemoPageShell";
import type {
  DummyJsonListResponse,
  ProductsQueryArgs,
} from "../querytable/adapters/useProductsRtkQuery";
import { useInfiniteProductsRtkQuery } from "../querytable/adapters/useProductsRtkQuery";
import { ProductCard, ProductCardModel, rtkResultSelectors } from "./productsShared";

const { Paragraph, Title } = Typography;

export function InfiniteScrollProductsDemoPage() {
  const title = "Infinite products feed (RTK Query)";
  const description =
    "Real-world infinite scroll built with RTK Query and the InfiniteScrollList helper. As you reach the bottom, the next page loads and cards are appended.";

  const resultSelectors = useMemo(() => rtkResultSelectors, []);

  const rtkSnippet = String.raw`import { InfiniteScrollRTK } from "@thabeut/react-data-kit";
import { useInfiniteProductsRtkQuery } from "./services/productsRtk";

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

type ProductsQueryArgs = {
  page?: number;
  limit?: number;
};

type ProductsQueryPayload = {
  tag: { type: string };
  query: ProductsQueryArgs;
};

function buildInfiniteQueryArgs(page: number) {
  return {
    tag: { type: "products-infinite-rtk" },
    query: { page, limit: 8 },
  };
}

const resultSelectors = {
  selectItems: (data?: DummyJsonListResponse) => data?.products ?? [],
  selectHasNext: (data?: DummyJsonListResponse) => {
    if (!data) return false;
    return data.skip + data.products.length < data.total;
  },
};

export function ProductsInfiniteScroll() {
  return (
    <InfiniteScrollRTK<ProductCardModel, DummyJsonListResponse>
      heightClass="infinite-scroll-demo-height"
      useQuery={(args) =>
        useInfiniteProductsRtkQuery({
          tag: args.tag,
          query: args.query as ProductsQueryArgs,
        })
      }
      buildQueryArgs={buildInfiniteQueryArgs}
      selectItems={resultSelectors.selectItems}
      selectHasNext={resultSelectors.selectHasNext}
      getKey={(item) => String(item.id)}
      emptyState={<div>No products found</div>}
      renderItem={(item) => <div>{item.title}</div>}
    />
  );
}`;

  function buildInfiniteQueryArgs(page: number): InfiniteScrollQueryArgs {
    return {
      tag: { type: "products-infinite-rtk" },
      query: {
        page,
        limit: 8,
        sort: { field: "title", direction: "asc" },
      },
    };
  }

  return (
    <DemoPageShell
      title={title}
      description={description}
      setup="Scroll inside the panel to trigger loading of the next page. React Query manages caching; InfiniteScrollList handles scroll + append."
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
              <InfiniteScrollRTK<ProductCardModel, DummyJsonListResponse>
                heightClass="infinite-scroll-demo-height"
                useQuery={(args: InfiniteScrollQueryArgs) =>
                  useInfiniteProductsRtkQuery({
                    tag: args.tag,
                    query: args.query as ProductsQueryArgs,
                  })
                }
                buildQueryArgs={buildInfiniteQueryArgs}
                selectItems={resultSelectors.selectItems}
                selectHasNext={resultSelectors.selectHasNext}
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
          code={rtkSnippet}
        />

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4} style={{ marginBottom: 0 }}>
            How to make the RTK Query API
          </Title>
          <Paragraph type="secondary" style={{ maxWidth: 900 }}>
            In plain RTK Query you create an infinite endpoint with <code>createApi</code>, wiring{" "}
            <code>serializeQueryArgs</code>, <code>merge</code>, and <code>forceRefetch</code> so that all
            pages for the same query key are appended into one cache entry.
            See the <code>listInfinite</code> endpoint in <code>useProductsRtkQuery.ts</code> for the full implementation.
          </Paragraph>
        </Space>
      </Space>
    </DemoPageShell>
  );
}
