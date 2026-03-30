import { useMemo } from "react";
import * as yup from "yup";
import type { UploadFile } from "antd";
import type { DynamicFormField } from "@thabeut/react-data-kit";
import { useProductsReactQuery } from "../querytable/adapters/useProductsReactQuery";
import type { DummyJsonListResponse } from "../querytable/adapters/useProductsRtkQuery";

export type FormValues = {
  name: string | undefined;
  bio: string | undefined;
  status: string | undefined;
  color: string | undefined;
  avatar: UploadFile[];
  tags: string[];
  featured: boolean;
  attachments: UploadFile[];
  productId: string | undefined;
};

type ProductOption = { id: number; title: string };

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
      {
        type: "asyncSelect",
        name: "productId",
        label: "Product (async)",
        fieldSchema: yup.string().required("Product is required"),
        fieldProps: {
          useQuery: useProductsReactQuery,
          buildParams: ({ page, search }: any) => ({
            tag: { type: "dynamicform-products" },
            query: { page, limit: 10, search },
          }),
          reformatData: (data: DummyJsonListResponse | undefined, previous: ProductOption[]) => {
            const prev = Array.isArray(previous) ? previous : [];
            const next = (data?.products ?? []).map((p) => ({ id: p.id, title: p.title }));
            const merged = Array.from(
              new Map([...prev, ...next].map((p) => [String(p.id), p])).values(),
            );
            const total = data?.total ?? 0;
            const skip = data?.skip ?? 0;
            const limit = data?.limit ?? 10;
            const hasMore = skip + limit < total;
            return { items: merged, hasMore };
          },
          getOptionLabel: (item: ProductOption) => item.title,
          getOptionValue: (item: ProductOption) => String(item.id),
          placeholder: "Type to search products…",
        } as any,
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
    [],
  );
}
