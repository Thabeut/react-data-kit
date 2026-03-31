import { useMemo } from "react";
import * as yup from "yup";
import type { UploadFile } from "antd";
import { useDispatch } from "react-redux";
import type {
  AsyncOptionsParams,
  AsyncOptionsResult,
  DynamicFormField,
  LoadOptions,
} from "@thabeut/react-data-kit";
import {
  productsRtkApi,
  type DummyJsonListResponse,
  type PublicOptionsListResponse,
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
type CityOption = { id: string; label: string };

type CountryOptionItem = { id: string; label: string };

export function useDynamicFormFields() {
  const dispatch = useDispatch<any>();
  const loadCountryOptions: LoadOptions<CountryOptionItem> = useMemo(
    () =>
      async (
        params: AsyncOptionsParams,
      ): Promise<AsyncOptionsResult<CountryOptionItem>> => {
        const page = params.page ?? 1;
        const search = params.search ?? "";
        const data = (await dispatch(
          productsRtkApi.endpoints.countriesOptionsInfinite.initiate(
            {
              tag: { type: "dynamicform-countries" },
              query: { page, search },
            },
            { subscribe: false },
          ),
        ).unwrap()) as PublicOptionsListResponse;
        return {
          options: (data.items ?? []).map((item) => ({
            id: item.id,
            label: item.label,
          })),
          hasMore: data.skip + data.limit < data.total,
        };
      },
    [dispatch],
  );
  const loadCityOptions = useMemo(
    () =>
      async (
        params: AsyncOptionsParams,
      ): Promise<AsyncOptionsResult<CityOption>> => {
        const page = params.page ?? 1;
        const search = params.search ?? "";
        const country =
          typeof params.country === "string" ? params.country : undefined;
        if (!country) {
          return { options: [], hasMore: false };
        }
        const data = (await dispatch(
          productsRtkApi.endpoints.citiesByCountryOptionsInfinite.initiate(
            {
              tag: { type: "dynamicform-cities" },
              query: { page, search, country },
            },
            { subscribe: false },
          ),
        ).unwrap()) as PublicOptionsListResponse;
        return {
          options: (data.items ?? []).map((item) => ({
            id: item.id,
            label: item.label,
          })),
          hasMore: data.skip + data.limit < data.total,
        };
      },
    [dispatch],
  );
  const loadProductOptions = useMemo(
    () =>
      async (
        params: AsyncOptionsParams,
      ): Promise<AsyncOptionsResult<ProductOption>> => {
        const page = params.page ?? 1;
        const search = params.search ?? "";
        const pageSize = params.pageSize ?? 10;
        const data = (await dispatch(
          productsRtkApi.endpoints.listInfinite.initiate(
            {
              tag: { type: "dynamicform-products" },
              query: { page, limit: pageSize, search },
            },
            { subscribe: false },
          ),
        ).unwrap()) as DummyJsonListResponse;
        const items = (data.products ?? []).map((p) => ({
          id: p.id,
          title: p.title,
        }));
        return {
          options: items,
          hasMore: data.skip + data.limit < data.total,
        };
      },
    [dispatch],
  );
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
      {
        type: "asyncSelect",
        name: "country",
        label: "Country (public API)",
        placeholder: "Search country",
        fieldSchema: yup.string().required("Country is required"),
        fieldProps: {
          loadOptions: loadCountryOptions,
          getOptionLabel: (item) =>
            (item as { id: string; label: string }).label,
          getOptionValue: (item) =>
            (item as { id: string; label: string }).label,
        },
      },
      {
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
          buildParams: ({ values, params }) => {
            return {
              ...params,
              country: values.country,
            };
          },
        },
        fieldSchema: yup.string().required("City is required"),
        fieldProps: {
          loadOptions: loadCityOptions,
          getOptionLabel: (item) => (item as CityOption).label,
          getOptionValue: (item) => (item as CityOption).id,
          placeholder: "Pick country first, then search city",
        },
      },
      {
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
          loadOptions: loadProductOptions,
          getOptionLabel: (item) => (item as ProductOption).title,
          getOptionValue: (item) => String((item as ProductOption).id),
          placeholder: "Type to search products…",
        },
      },
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
    [loadCityOptions, loadCountryOptions, loadProductOptions],
  );
}
