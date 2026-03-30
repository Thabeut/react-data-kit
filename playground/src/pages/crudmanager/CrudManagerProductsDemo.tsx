import { useCallback, useMemo } from "react";
import {
  Alert,
  Button as AntButton,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { useTranslation } from "react-i18next";
import {
  CrudManager,
  DynamicFieldTypeEnum,
  parseTableState,
  serializeTableState,
  type DynamicFormField,
  type QueryTableProps,
} from "@thabeut/react-data-kit";
import { useSearchParams } from "react-router-dom";
import type {
  DummyJsonListResponse,
  DummyJsonProduct,
} from "../querytable/adapters/useProductsRtkQuery";
import {
  useProductsCategoriesQuery,
  useProductsCreateMutation,
  useProductsDeleteMutation,
  useProductsUpdateMutation,
} from "../querytable/adapters/useProductsRtkQuery";

const { Paragraph } = Typography;

type ProductRow = {
  id: number;
  title: string;
  price: number;
  image: string;
  categoryName: string;
};

type ProductFormValues = {
  title: string;
  price: string;
  categoryName: string;
};

export type ProductsCrudUseQuery = QueryTableProps<
  ProductRow,
  DummyJsonListResponse
>["useQuery"];

type CrudManagerProductsDemoProps = {
  useQuery: ProductsCrudUseQuery;
  formVariant?: "drawer" | "modal";
};

function productToRow(p: DummyJsonProduct): ProductRow {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.thumbnail,
    categoryName: p.category,
  };
}

export function CrudManagerProductsDemo({
  useQuery,
  formVariant = "drawer",
}: CrudManagerProductsDemoProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tableState = useMemo(
    () => parseTableState(searchParams),
    [searchParams],
  );

  const {
    data,
    error: categoriesError,
    isLoading: isCategoriesLoading,
  } = useProductsCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] =
    useProductsCreateMutation();
  const [updateProduct, { isLoading: isUpdating }] =
    useProductsUpdateMutation();
  const [deleteProduct, { isLoading: isDeleting }] =
    useProductsDeleteMutation();
  const categoryOptions = useMemo(
    () => (data ?? []).map((cat) => ({ value: cat.slug, label: cat.name })),
    [data],
  );

  const columnsInfo = useMemo(() => {
    const moneyFmt = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
    return [
      {
        id: "title",
        label: t("crudManagerColumnProduct", { defaultValue: "Product" }),
        dataIndex: "title" as const,
        sortable: true,
        width: 360,
        render: (_value: unknown, record: unknown) => {
          const row = record as ProductRow;
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={row.image}
                alt=""
                width={48}
                height={48}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
              <span>{row.title}</span>
            </div>
          );
        },
      },
      {
        id: "price",
        label: t("crudManagerColumnPrice", { defaultValue: "Price" }),
        dataIndex: "price" as const,
        sortable: true,
        width: 120,
        render: (value: unknown) => moneyFmt.format(Number(value)),
      },
      {
        id: "categoryName",
        label: t("crudManagerColumnCategory", { defaultValue: "Category" }),
        dataIndex: "categoryName" as const,
        sortable: true,
        width: 200,
        render: (value: unknown) => <Tag>{String(value)}</Tag>,
      },
    ];
  }, [t]);

  const filters = useMemo(
    () => [
      {
        id: "category",
        label: t("crudManagerFilterCategory", { defaultValue: "Category" }),
        type: "multi" as const,
        options: categoryOptions,
        searchPlaceholder: t("crudManagerSearchCategories", {
          defaultValue: "Search categories",
        }),
      },
    ],
    [categoryOptions, t],
  );

  const fields = useMemo<DynamicFormField[]>(
    () => [
      {
        type: DynamicFieldTypeEnum.Input,
        name: "title",
        label: t("crudManagerFieldTitle", { defaultValue: "Title" }),
        placeholder: t("crudManagerFieldTitlePlaceholder", {
          defaultValue: "Enter product title",
        }),
      },
      {
        type: DynamicFieldTypeEnum.Input,
        name: "price",
        label: t("crudManagerFieldPrice", { defaultValue: "Price" }),
        placeholder: "99.99",
        fieldProps: { type: "number" },
      },
      {
        type: DynamicFieldTypeEnum.Select,
        name: "categoryName",
        label: t("crudManagerFieldCategory", { defaultValue: "Category" }),
        placeholder: t("crudManagerFieldCategoryPlaceholder", {
          defaultValue: "Select category",
        }),
        fieldProps: { options: categoryOptions },
      },
    ],
    [categoryOptions, t],
  );

  const handleCreate = useCallback(
    async (values: ProductFormValues) => {
      await createProduct({
        title: values.title,
        price: Number(values.price || 0),
        category: values.categoryName,
      }).unwrap();
      message.success(
        t("crudManagerCreatedSuccess", {
          defaultValue: "Created with RTK mutation",
        }),
      );
    },
    [createProduct, t],
  );

  const handleEdit = useCallback(
    async (record: ProductRow, values: ProductFormValues) => {
      await updateProduct({
        id: Number(record.id),
        data: {
          title: values.title,
          price: Number(values.price || 0),
          category: values.categoryName,
        },
      }).unwrap();
      message.success(
        t("crudManagerUpdatedSuccess", {
          defaultValue: "Updated with RTK mutation",
        }),
      );
    },
    [updateProduct, t],
  );

  const handleDelete = useCallback(
    async (record: ProductRow) => {
      await deleteProduct({ id: Number(record.id) }).unwrap();
      message.success(
        t("crudManagerDeletedSuccess", {
          defaultValue: "Deleted with RTK mutation",
        }),
      );
    },
    [deleteProduct, t],
  );

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Paragraph type="secondary" style={{ marginBottom: 0 }}>
        {t("crudManagerDemoDescription", {
          defaultValue: "Query-driven CRUD demo using RTK Query mutations.",
        })}
      </Paragraph>

      {categoriesError ? (
        <Alert
          type="error"
          showIcon
          message={t("crudManagerLoadCategoriesError", {
            defaultValue: "Could not load category filter options",
          })}
          description={
            (categoriesError as { message?: string } | undefined)?.message ??
            t("crudManagerUnknownError", { defaultValue: "Unknown error" })
          }
        />
      ) : null}

      <Space wrap>
        <Tag color="blue">variant={formVariant}</Tag>
        {isCreating || isUpdating || isDeleting ? (
          <Tag color="processing">
            {t("crudManagerMutationRunning", {
              defaultValue: "mutation running...",
            })}
          </Tag>
        ) : null}
        {isCategoriesLoading ? (
          <Tag color="default">
            {t("crudManagerCategoriesLoading", {
              defaultValue: "loading categories...",
            })}
          </Tag>
        ) : null}
        <AntButton
          size="small"
          onClick={() => {
            setSearchParams({});
          }}
        >
          {t("crudManagerResetDemo", { defaultValue: "Reset demo" })}
        </AntButton>
      </Space>

      <CrudManager<ProductRow, DummyJsonListResponse, ProductFormValues>
        tableState={tableState}
        onTableStateChange={(next) =>
          setSearchParams(new URLSearchParams(serializeTableState(next)))
        }
        tableId="crud-manager-products"
        rowKey="id"
        columnsInfo={columnsInfo as never}
        filters={filters}
        tag={{ type: "products", id: "LIST" }}
        useQuery={useQuery as never}
        resultAdapter={{
          selectItems: (data) => data?.products.map(productToRow) ?? [],
          selectTotalItems: (data) => data?.total ?? 0,
        }}
        pageSizeOptions={[10, 20, 50]}
        initialPageSize={10}
        searchPlaceholder={t("crudManagerSearchProducts", {
          defaultValue: "Search products",
        })}
        renderToolbarLeft={<Tag color="processing">CrudManager</Tag>}
        fields={fields}
        cancelLabel={t("crudManagerCancel", { defaultValue: "Cancel" })}
        description={t("crudManagerFormDescription", {
          defaultValue: "Add or edit a product from the table view.",
        })}
        formVariant={formVariant}
        addButtonLabel={t("crudManagerAddProduct", {
          defaultValue: "Add product",
        })}
        createTitle={t("crudManagerCreateTitle", {
          defaultValue: "Create product",
        })}
        createSubmitLabel={t("crudManagerCreateSubmit", {
          defaultValue: "Create",
        })}
        isCreating={isCreating}
        isEditing={isUpdating}
        isDeleting={isDeleting}
        actions={{
          deleteModalConfig: {
            title: t("crudManagerDeleteTitle", {
              defaultValue: "Delete product",
            }),
            description: t("crudManagerDeleteDescription", {
              defaultValue: "Are you sure you want to delete this product?",
            }),
            confirmLabel: t("crudManagerDeleteConfirm", {
              defaultValue: "Delete",
            }),
            cancelLabel: t("crudManagerCancel", { defaultValue: "Cancel" }),
          },
        }}
        onCreate={handleCreate}
        editTitle={t("crudManagerEditTitle", { defaultValue: "Edit product" })}
        editSubmitLabel={t("crudManagerEditSubmit", { defaultValue: "Save" })}
        editDefaultValues={(record) => ({
          title: String(record.title ?? ""),
          price: String(record.price ?? 0),
          categoryName: String(record.categoryName ?? ""),
        })}
        onUpdate={handleEdit}
        onDelete={handleDelete}
      />
    </Space>
  );
}
