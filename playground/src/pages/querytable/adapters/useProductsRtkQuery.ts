import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PRODUCTS_BASE_PATH = "/products";

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

export type PublicOptionsQueryPayload = {
  tag: { type: string };
  query: {
    page?: number;
    search?: string;
    country?: string;
  };
};

export type PublicOptionItem = {
  id: string;
  label: string;
};

export type PublicOptionsListResponse = {
  items: PublicOptionItem[];
  total: number;
  skip: number;
  limit: number;
};

type CountriesNowCityResponse = {
  error: boolean;
  msg: string;
  data: string[];
};

function paginateOptions(args: {
  source: PublicOptionItem[];
  page: number;
  limit: number;
  search: string;
}): PublicOptionsListResponse {
  const { source, page, limit, search } = args;
  const skip = (page - 1) * limit;
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = normalizedSearch
    ? source.filter((item) =>
        item.label.toLowerCase().includes(normalizedSearch),
      )
    : source;
  return {
    items: filtered.slice(skip, skip + limit),
    total: filtered.length,
    skip,
    limit,
  };
}

function buildProductsPath(args: ProductsQueryArgs): string {
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
    return `${PRODUCTS_BASE_PATH}/search?${params}`;
  }

  if (categorySlug) {
    return `${PRODUCTS_BASE_PATH}/category/${encodeURIComponent(categorySlug)}?${params}`;
  }

  return `${PRODUCTS_BASE_PATH}?${params}`;
}

type ProductsQueryPayload = {
  tag: { type: string };
  query: ProductsQueryArgs;
};

export const productsRtkApi = createApi({
  reducerPath: "querytableProductsRtk",
  // Public API for realistic RTK Query examples.
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com" }),
  tagTypes: ["products"],
  endpoints: (build) => ({
    list: build.query<DummyJsonListResponse, ProductsQueryPayload>({
      query: (payload) => buildProductsPath(payload.query),
      providesTags: [{ type: "products", id: "LIST" }],
    }),
    listInfinite: build.query<DummyJsonListResponse, ProductsQueryPayload>({
      query: (payload) => buildProductsPath(payload.query),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { query, tag } = queryArgs;
        const normalizedQuery: Record<string, unknown> =
          query && typeof query === "object"
            ? { ...(query as Record<string, unknown>) }
            : {};
        if ("page" in normalizedQuery) {
          delete normalizedQuery.page;
        }
        const queryString = JSON.stringify(normalizedQuery);
        const tagType = tag.type;
        return `${endpointName}-${queryString}-${tagType}`;
      },
      merge(currentCache, incoming, { arg }) {
        const page = Number(arg.query.page ?? 1) || 1;

        if (page <= 1 || !Array.isArray(currentCache.products)) {
          Object.assign(currentCache, incoming);
          return;
        }

        currentCache.products = [
          ...currentCache.products,
          ...incoming.products,
        ];
        currentCache.total = incoming.total;
        currentCache.skip = incoming.skip;
        currentCache.limit = incoming.limit;
      },
      forceRefetch({ currentArg, previousArg }) {
        if (!currentArg || !previousArg) return true;
        const currentPage = Number(currentArg.query.page ?? 1) || 1;
        const previousPage = Number(previousArg.query.page ?? 1) || 1;

        if (currentPage !== previousPage) return true;

        const clean = (q: ProductsQueryArgs | undefined) => {
          if (!q) return {};
          const { page, ...rest } = q;
          return rest;
        };

        return (
          JSON.stringify(clean(currentArg.query)) !==
          JSON.stringify(clean(previousArg.query))
        );
      },
      providesTags: [{ type: "products", id: "LIST" }],
    }),
    categories: build.query<DummyJsonCategory[], void>({
      query: () => `${PRODUCTS_BASE_PATH}/categories`,
    }),
    productCategoriesOptions: build.query<
      PublicOptionsListResponse,
      PublicOptionsQueryPayload
    >({
      async queryFn(payload) {
        const page = Number(payload.query.page ?? 1) || 1;
        const limit = 15;
        const search = String(payload.query.search ?? "");
        const response = await fetch(
          "https://dummyjson.com/products/categories",
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = (await response.json()) as
          | string[]
          | Array<{ slug?: string; name?: string }>;
        const source = (Array.isArray(json) ? json : [])
          .map((item) => {
            if (typeof item === "string") {
              return { id: item, label: item };
            }
            return {
              id: item.slug ?? item.name ?? "",
              label: item.name ?? item.slug ?? "",
            };
          })
          .filter((item) => item.id && item.label);
        return { data: paginateOptions({ source, page, limit, search }) };
      },
    }),
    countriesOptions: build.query<
      PublicOptionsListResponse,
      PublicOptionsQueryPayload
    >({
      async queryFn(payload) {
        const page = Number(payload.query.page ?? 1) || 1;
        const limit = 10;
        const search = String(payload.query.search ?? "");
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2",
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = (await response.json()) as Array<{
          name?: { common?: string };
          cca2?: string;
        }>;
        const source = json
          .map((item) => ({
            id: item.cca2 ?? item.name?.common ?? "",
            label: item.name?.common ?? "",
          }))
          .filter((item) => item.id && item.label)
          .sort((a, b) => a.label.localeCompare(b.label));
        return { data: paginateOptions({ source, page, limit, search }) };
      },
    }),
    citiesByCountryOptions: build.query<
      PublicOptionsListResponse,
      PublicOptionsQueryPayload
    >({
      async queryFn(payload) {
        const country = String(payload.query.country ?? "").trim();
        if (!country) {
          return { data: { items: [], total: 0, skip: 0, limit: 10 } };
        }
        const page = Number(payload.query.page ?? 1) || 1;
        const limit = 10;
        const search = String(payload.query.search ?? "");
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country }),
          },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = (await response.json()) as CountriesNowCityResponse;
        const source = (json.data ?? []).map((cityName) => ({
          id: cityName,
          label: cityName,
        }));
        return { data: paginateOptions({ source, page, limit, search }) };
      },
    }),
    addProduct: build.mutation<DummyJsonProduct, ProductMutationPayload>({
      query: (payload) => ({
        url: `${PRODUCTS_BASE_PATH}/add`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "products", id: "LIST" }],
    }),
    updateProduct: build.mutation<
      DummyJsonProduct,
      { id: number; data: ProductMutationPayload }
    >({
      query: (payload) => ({
        url: `${PRODUCTS_BASE_PATH}/${payload.id}`,
        method: "PUT",
        body: payload.data,
      }),
      invalidatesTags: [{ type: "products", id: "LIST" }],
    }),
    deleteProduct: build.mutation<DummyJsonDeleteResponse, { id: number }>({
      query: (payload) => ({
        url: `${PRODUCTS_BASE_PATH}/${payload.id}`,
        method: "DELETE",
      }),
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

export const {
  useListQuery: useProductsRtkQuery,
  useListInfiniteQuery: useInfiniteProductsRtkQuery,
  useCategoriesQuery: useProductsCategoriesQuery,
  useCountriesOptionsQuery: useCountriesOptionsRtkQuery,
  useCitiesByCountryOptionsQuery: useCitiesByCountryOptionsRtkQuery,
  useAddProductMutation: useProductsCreateMutation,
  useUpdateProductMutation: useProductsUpdateMutation,
  useDeleteProductMutation: useProductsDeleteMutation,
} = productsRtkApi;
