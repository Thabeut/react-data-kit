import { useMemo } from "react";
import * as yup from "yup";
import type { UploadFile } from "antd";
import {
  defineAsyncSelectField,
  type DynamicFormField,
} from "@thabeut/react-data-kit";
import {
  useCountriesOptionsInfiniteRtkQuery,
  useCitiesByCountryOptionsInfiniteRtkQuery,
  useInfiniteProductsRtkQuery,
  type DummyJsonListResponse,
} from "../querytable/adapters/useProductsRtkQuery";

export type FormValues = {
  name: string | undefined;
  bio: string | undefined;
  status: string | undefined;
  country: string | undefined;
  cityId: string | undefined;
  color: string | undefined;
  avatar: UploadFile[];
  tags: string[];
  featured: boolean;
  attachments: UploadFile[];
  productId: string | undefined;
};

type ProductOption = { id: number; title: string };
type CountryOption = { id: string; label: string };
type CityOption = { id: string; label: string };

type CountriesQueryPayload = {
  query: { page: number; search: string };
};

type CityQueryPayload = {
  query: { page: number; search: string; country?: string };
};

function useCountriesOptionsQuery(payload: CountriesQueryPayload): {
  data?: { items: CountryOption[]; total: number; skip: number; limit: number };
  isLoading: boolean;
  isFetching?: boolean;
} {
  const { data, isLoading, isFetching } = useCountriesOptionsInfiniteRtkQuery({
    tag: { type: "dynamicform-countries" },
    query: payload.query,
  });
  return { data, isLoading, isFetching };
}

function useCityOptionsQuery(payload: CityQueryPayload): {
  data?: { items: CityOption[]; total: number; skip: number; limit: number };
  isLoading: boolean;
  isFetching?: boolean;
} {
  const { data, isLoading, isFetching } =
    useCitiesByCountryOptionsInfiniteRtkQuery({
    tag: { type: "dynamicform-cities" },
    query: payload.query,
  });
  return { data, isLoading, isFetching };
}

function useProductsInfiniteQuery(payload: {
  tag: { type: string };
  query: { page: number; limit: number; search: string };
}): {
  data?: DummyJsonListResponse;
  isLoading: boolean;
  isFetching?: boolean;
} {
  const { data, isLoading, isFetching } = useInfiniteProductsRtkQuery(payload);
  return { data, isLoading, isFetching };
}

export function useDynamicFormFields() {
  return useMemo<DynamicFormField[]>(
    () => [
      {
        type: "avatar",
        name: "avatar",
        label: "Avatar",
        fieldSchema: yup.array().max(1, "Avatar allows one image only"),
        fieldProps: {
          size: 88,
          accept: "image/*",
        },
      },
      {
        type: "input",
        name: "name",
        label: "Name",
        placeholder: "Enter a name",
        fieldSchema: yup.string().required("Name is required"),
      },
      {
        type: "textarea",
        name: "bio",
        label: "Bio",
        placeholder: "Tell us something…",
        fieldSchema: yup
          .string()
          .min(10, "Bio must be at least 10 chars")
          .required("Bio is required"),
      },
      {
        type: "select",
        name: "status",
        label: "Status",
        placeholder: "Pick status",
        fieldSchema: yup.string().required("Status is required"),
        fieldProps: {
          options: [
            { value: "active", label: "Active" },
            { value: "paused", label: "Paused" },
            { value: "archived", label: "Archived" },
          ],
        },
      },
      defineAsyncSelectField({
        type: "asyncSelect",
        name: "country",
        label: "Country (public API)",
        placeholder: "Search country",
        fieldSchema: yup.string().required("Country is required"),
        fieldProps: {
          useQuery: useCountriesOptionsQuery,
          buildParams: ({ page, search }) => ({
            query: { page, search },
          }),
          formatData: (data) => {
            const merged = data?.items ?? [];
            const total = data?.total ?? 0;
            const skip = data?.skip ?? 0;
            const limit = data?.limit ?? 10;
            return { items: merged, hasMore: skip + limit < total };
          },
          getOptionLabel: (item) => item.label,
          getOptionValue: (item) => item.label,
        },
      }),
      defineAsyncSelectField<
        CityOption,
        { items: CityOption[]; total: number; skip: number; limit: number },
        CityQueryPayload
      >({
        type: "asyncSelect",
        name: "cityId",
        label: "City (depends on Country)",
        dependsOn: {
          field: "country",
          effect: "disable",
          resetOnHide: true,
        },
        queryDependsOn: {
          fields: "country",
          resetOnChange: true,
          buildParams: ({ values, state, baseParams }) => {
            const base =
              typeof baseParams === "object" && baseParams ? baseParams : {};
            const baseWithQuery = base as { query?: object };
            return {
              ...base,
              query: {
                ...(typeof baseWithQuery.query === "object" &&
                baseWithQuery.query
                  ? (baseWithQuery.query as object)
                  : {}),
                country: values.country,
                page: state.page,
                search: state.search,
              },
            };
          },
        },
        fieldSchema: yup.string().required("City is required"),
        fieldProps: {
          useQuery: useCityOptionsQuery,
          buildParams: ({ page, search }) => ({
            query: { page, search },
          }),
          formatData: (data) => {
            const merged = data?.items ?? [];
            const total = data?.total ?? 0;
            const skip = data?.skip ?? 0;
            const limit = data?.limit ?? 10;
            return { items: merged, hasMore: skip + limit < total };
          },
          getOptionLabel: (item) => item.label,
          getOptionValue: (item) => item.id,
          placeholder: "Pick country first, then search city",
        },
      }),
      defineAsyncSelectField<
        ProductOption,
        DummyJsonListResponse,
        {
          tag: { type: string };
          query: { page: number; limit: number; search: string };
        }
      >({
        type: "asyncSelect",
        name: "productId",
        label: "Product (async)",
        dependsOn: {
          field: "status",
          effect: "disable",
          when: (values) => values.status !== "archived",
        },
        fieldSchema: yup.string().required("Product is required"),
        fieldProps: {
          useQuery: useProductsInfiniteQuery,
          buildParams: ({ page, search }) => ({
            tag: { type: "dynamicform-products" },
            query: { page, limit: 10, search },
          }),
          formatData: (data) => {
            const merged = (data?.products ?? []).map((p) => ({
              id: p.id,
              title: p.title,
            }));
            const total = data?.total ?? 0;
            const skip = data?.skip ?? 0;
            const limit = data?.limit ?? 10;
            const hasMore = skip + limit < total;
            return { items: merged, hasMore };
          },
          getOptionLabel: (item) => item.title,
          getOptionValue: (item) => String(item.id),
          placeholder: "Type to search products…",
        },
      }),
      {
        type: "upload",
        name: "attachments",
        label: "Attachments",
        fieldSchema: yup
          .array()
          .min(1, "At least one file is required")
          .required(),
        fieldProps: {
          multiple: true,
          accept: ".png,.jpg,.pdf",
          title: "Upload files",
        },
      },
      {
        type: "color",
        name: "color",
        label: "Color",
        fieldSchema: yup.string().required("Color is required"),
      },
      {
        type: "stringArray",
        name: "tags",
        label: "Tags",
        placeholder: "Write a tag",
        fieldSchema: yup
          .array()
          .of(yup.string().required())
          .min(1, "Add at least one tag"),
        fieldProps: {
          addLabel: "Add tag",
        },
      },
      {
        type: "switch",
        name: "featured",
        label: "Featured",
        fieldSchema: yup.boolean().required(),
        fieldProps: {
          checkedLabel: "Yes",
          uncheckedLabel: "No",
        },
      },
      {
        type: "custom",
        name: "customNote",
        label: "Custom",
        render: () => (
          <div style={{ fontSize: 13, opacity: 0.8 }}>
            Custom field slot (render anything here).
          </div>
        ),
      },
    ],
    [],
  );
}
