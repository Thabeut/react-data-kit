import { useMemo } from "react";
import { keepPreviousData, useQuery as useTanstackQuery } from "@tanstack/react-query";
import type { ProductsQueryArgs, DummyJsonListResponse } from "./useProductsRtkQuery";

const BASE = "https://dummyjson.com/products";

function buildProductsUrl(args: ProductsQueryArgs): string {
  const page = Number(args.page ?? 1) || 1;
  const pageSize = Number(args.limit ?? 10) || 10;
  const skip = (page - 1) * pageSize;

  const sort = args.sort;
  const field = sort?.field;
  const sortBy =
    field === "price" ? "price" : field === "categoryName" ? "category" : "title";
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

export function useProductsReactQuery(
  payload: ProductsQueryPayload,
): {
  data?: DummyJsonListResponse;
  isLoading: boolean;
  isFetching?: boolean;
  refetch: () => void;
} {
  const url = useMemo(() => buildProductsUrl(payload.query), [payload.query]);

  const res = useTanstackQuery<DummyJsonListResponse, Error, DummyJsonListResponse>({
    queryKey: ["querytable-products-react", payload.tag.type, url],
    queryFn: async () => {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return (await r.json()) as DummyJsonListResponse;
    },
    placeholderData: keepPreviousData,
  });

  return {
    data: res.data,
    isLoading: res.isLoading,
    isFetching: res.isFetching,
    refetch: () => {
      void res.refetch();
    },
  };
}

