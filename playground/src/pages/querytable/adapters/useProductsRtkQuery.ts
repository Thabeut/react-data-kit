import { configureStore } from "@reduxjs/toolkit";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE = "https://dummyjson.com/products";

export type DummyJsonProduct = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
};

export type DummyJsonListResponse = {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductsQueryArgs = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: { field?: string; direction?: "asc" | "desc" };
  category?: string[]; // multi-filter from QueryTable
  [key: string]: unknown;
};

function buildProductsUrl(args: ProductsQueryArgs): string {
  const page = Number(args.page ?? 1) || 1;
  const pageSize = Number(args.limit ?? 10) || 10;
  const skip = (page - 1) * pageSize;

  const sort = args.sort;
  const field = sort?.field;
  const sortBy =
    field === "price"
      ? "price"
      : field === "categoryName"
        ? "category"
        : "title";
  const order = sort?.direction === "desc" ? "desc" : "asc";

  const params = new URLSearchParams({
    limit: String(pageSize),
    skip: String(skip),
    sortBy,
    order,
  });

  const q = typeof args.search === "string" ? args.search.trim() : "";
  const categorySlug =
    Array.isArray(args.category) && args.category.length > 0
      ? String(args.category[0])
      : undefined;

  if (q) {
    params.set("q", q);
    if (categorySlug) params.set("category", categorySlug);
    return `${BASE}/search?${params}`;
  }

  if (categorySlug) {
    return `${BASE}/category/${encodeURIComponent(categorySlug)}?${params}`;
  }

  return `${BASE}?${params}`;
}

type ProductsQueryPayload = {
  tag: { type: string };
  query: ProductsQueryArgs;
};

export const productsRtkApi = createApi({
  reducerPath: "querytableProductsRtk",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    list: build.query<DummyJsonListResponse, ProductsQueryPayload>({
      async queryFn(payload) {
        const url = buildProductsUrl(payload.query);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as DummyJsonListResponse;
        return { data: json };
      },
    }),
  }),
});

export function makeProductsRtkStore() {
  return configureStore({
    reducer: {
      [productsRtkApi.reducerPath]: productsRtkApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsRtkApi.middleware),
  });
}

export function useProductsRtkQuery(payload: ProductsQueryPayload): {
  data?: DummyJsonListResponse;
  isLoading: boolean;
  isFetching?: boolean;
  refetch: () => void;
} {
  // RTK Query provides the "useXyzQuery" hook.
  const res = productsRtkApi.useListQuery(payload);

  return {
    data: res.data,
    isLoading: res.isLoading,
    isFetching: res.isFetching,
    refetch: () => {
      void res.refetch();
    },
  };
}
