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

export type DummyJsonDeleteResponse = {
  id: number;
  isDeleted: boolean;
  deletedOn?: string;
};

export type ProductsQueryArgs = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: { field?: string; direction?: "asc" | "desc" };
  category?: string[]; // multi-filter from QueryTable
  [key: string]: unknown;
};

export type ProductMutationPayload = {
  title: string;
  price?: number;
  category?: string;
};

type DummyJsonCategory = {
  slug: string;
  name: string;
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
  tagTypes: ["products"],
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
      providesTags: [{ type: "products", id: "LIST" }],
    }),
    categories: build.query<DummyJsonCategory[], void>({
      async queryFn() {
        const res = await fetch(`${BASE}/categories`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as DummyJsonCategory[];
        return { data: json };
      },
    }),
    addProduct: build.mutation<DummyJsonProduct, ProductMutationPayload>({
      async queryFn(payload) {
        const res = await fetch(`${BASE}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as DummyJsonProduct;
        return { data: json };
      },
      invalidatesTags: [{ type: "products", id: "LIST" }],
    }),
    updateProduct: build.mutation<
      DummyJsonProduct,
      { id: number; data: ProductMutationPayload }
    >({
      async queryFn(payload) {
        const res = await fetch(`${BASE}/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload.data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as DummyJsonProduct;
        return { data: json };
      },
      invalidatesTags: [{ type: "products", id: "LIST" }],
    }),
    deleteProduct: build.mutation<DummyJsonDeleteResponse, { id: number }>({
      async queryFn(payload) {
        const res = await fetch(`${BASE}/${payload.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as DummyJsonDeleteResponse;
        return { data: json };
      },
      invalidatesTags: [{ type: "products", id: "LIST" }],
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

export const useProductsCategoriesQuery = productsRtkApi.useCategoriesQuery;
export const useProductsCreateMutation = productsRtkApi.useAddProductMutation;
export const useProductsUpdateMutation =
  productsRtkApi.useUpdateProductMutation;
export const useProductsDeleteMutation =
  productsRtkApi.useDeleteProductMutation;
