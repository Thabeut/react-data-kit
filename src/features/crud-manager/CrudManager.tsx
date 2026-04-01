import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { Space } from "antd";
import { Icon } from "@iconify/react";
import { Button } from "../../components/button";
import {
  DynamicForm,
  type DynamicFormCustomColors,
  type DynamicFormField,
  type DynamicFormProps,
} from "../dynamic-form";
import { QueryTable, type QueryTableProps } from "../queryTable";
import { datatableIconNames } from "../../constants/datatable-icons";

type CrudMode = "create" | "edit";

export interface CrudManagerProps<
  TItem extends object,
  TRaw,
  TValues extends Record<string, unknown>,
> extends Omit<QueryTableProps<TItem, TRaw>, "actions"> {
  // Flattened DynamicForm props
  fields: DynamicFormField[];
  description?: DynamicFormProps<TValues>["description"];
  cancelLabel?: DynamicFormProps<TValues>["cancelLabel"];
  modalWidth?: DynamicFormProps<TValues>["modalWidth"];
  drawerWidth?: DynamicFormProps<TValues>["drawerWidth"];
  maxFormHeight?: DynamicFormProps<TValues>["maxFormHeight"];
  formClassName?: string;
  formCustomColors?: DynamicFormCustomColors;

  // Dynamic form surface and labels
  formVariant?: DynamicFormProps<TValues>["variant"];
  addButtonLabel?: ReactNode;
  createTitle?: ReactNode;
  editTitle?: ReactNode;
  createSubmitLabel?: ReactNode;
  editSubmitLabel?: ReactNode;

  // Optional mapper for edit mode defaults. Create mode remains empty.
  editDefaultValues?: (item: TItem) => TValues;

  // CRUD handlers
  onCreate?: (values: TValues) => Promise<void> | void;
  onUpdate?: (item: TItem, values: TValues) => Promise<void> | void;
  onDelete?: (item: TItem) => Promise<void> | void;
  isCreating?: boolean;
  isEditing?: boolean;
  isDeleting?: boolean;
  actions?: QueryTableProps<TItem, TRaw>["actions"];
  onAfterSubmit?: (
    mode: CrudMode,
    values: TValues,
    record?: TItem,
  ) => Promise<void> | void;
}

export function CrudManager<
  TItem extends object,
  TRaw,
  TValues extends Record<string, unknown>,
>(props: CrudManagerProps<TItem, TRaw, TValues>) {
  const {
    // QueryTable props (flattened)
    tableState,
    onTableStateChange,
    tableId,
    rowKey,
    columnsInfo,
    useQuery,
    tag,
    extraQuery,
    resultAdapter,
    pageSizeOptions,
    initialPageSize,
    className,
    customColors,
    filters,
    groupConfig,
    renderToolbarLeft,
    renderToolbarRight,
    searchPlaceholder,
    disableSelectionAndBookmark,
    hideColumnOptions,
    onSelectionChange,
    onBookmarkChange,
    onRowClick,
    limitKey,
    searchKey,
    sortKey,
    filterQueryKeys,
    serializeSort,
    mapSortToQuery,
    maxTableHeight,
    // DynamicForm props (flattened)
    fields,
    cancelLabel,
    description,
    modalWidth,
    drawerWidth,
    maxFormHeight,
    formClassName,
    formCustomColors,
    formVariant = "drawer",
    addButtonLabel = "Add",
    createTitle = "Create item",
    editTitle = "Edit item",
    createSubmitLabel = "Create",
    editSubmitLabel = "Save changes",
    editDefaultValues,
    onCreate,
    onUpdate,
    onDelete,
    isCreating = false,
    isEditing = false,
    isDeleting = false,
    actions: providedActions,
    onAfterSubmit,
  } = props;
  const resolvedFormCustomColors = formCustomColors ?? customColors;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<CrudMode>("create");
  const [activeRecord, setActiveRecord] = useState<TItem | undefined>(
    undefined,
  );

  const canAdd = !!onCreate;
  const canEdit = !!onUpdate;
  const canDelete = !!onDelete;

  const closeForm = useCallback(() => {
    setOpen(false);
    setMode("create");
    setActiveRecord(undefined);
  }, []);

  const openCreate = useCallback(() => {
    if (!canAdd) return;
    setMode("create");
    setActiveRecord(undefined);
    setOpen(true);
  }, [canAdd]);

  const openEdit = useCallback(
    (record: TItem) => {
      if (!canEdit) return;
      setMode("edit");
      setActiveRecord(record);
      setOpen(true);
    },
    [canEdit],
  );

  const defaultValues = useMemo(() => {
    if (mode === "create") return undefined;
    if (!activeRecord) return undefined;
    return editDefaultValues?.(activeRecord);
  }, [mode, activeRecord, editDefaultValues]);

  const onSubmit = useCallback(
    async (values: TValues) => {
      if (mode === "create") {
        if (!canAdd || !onCreate) return;
        await onCreate(values);
        await onAfterSubmit?.("create", values);
        return;
      }
      if (!canEdit || !onUpdate || !activeRecord) return;
      await onUpdate(activeRecord, values);
      await onAfterSubmit?.("edit", values, activeRecord);
    },
    [mode, canAdd, onCreate, onAfterSubmit, canEdit, onUpdate, activeRecord],
  );

  const actions = useMemo(() => {
    if (!canEdit && !canDelete) return providedActions;
    return {
      ...providedActions,
      deleteModalConfig: providedActions?.deleteModalConfig
        ? {
            ...providedActions.deleteModalConfig,
            isLoading: isDeleting,
          }
        : providedActions?.deleteModalConfig,
      onEdit: canEdit
        ? (record: TItem) => {
            providedActions?.onEdit?.(record);
            openEdit(record);
          }
        : providedActions?.onEdit,
      onDelete: canDelete
        ? async (record: TItem) => {
            if (providedActions?.onDelete) {
              await providedActions.onDelete(record);
            }
            await onDelete(record);
          }
        : providedActions?.onDelete,
    };
  }, [canEdit, canDelete, isDeleting, openEdit, onDelete, providedActions]);

  const mergedToolbarRight = useMemo(() => {
    if (!canAdd) return renderToolbarRight;
    return (
      <Space size={8} wrap>
        {renderToolbarRight}
        <Button
          variant="primary"
          icon={
            <Icon icon={datatableIconNames.PlusCircle} width={16} height={16} />
          }
          onClick={openCreate}
        >
          {addButtonLabel}
        </Button>
      </Space>
    );
  }, [canAdd, renderToolbarRight, openCreate, addButtonLabel]);

  return (
    <>
      <QueryTable<TItem, TRaw>
        className={className}
        tableState={tableState}
        onTableStateChange={onTableStateChange}
        tableId={tableId}
        rowKey={rowKey}
        columnsInfo={columnsInfo}
        useQuery={useQuery}
        tag={tag}
        extraQuery={extraQuery}
        resultAdapter={resultAdapter}
        pageSizeOptions={pageSizeOptions}
        initialPageSize={initialPageSize}
        customColors={customColors}
        filters={filters}
        groupConfig={groupConfig}
        searchPlaceholder={searchPlaceholder}
        disableSelectionAndBookmark={disableSelectionAndBookmark}
        hideColumnOptions={hideColumnOptions}
        onSelectionChange={onSelectionChange}
        onBookmarkChange={onBookmarkChange}
        onRowClick={onRowClick}
        limitKey={limitKey}
        searchKey={searchKey}
        sortKey={sortKey}
        filterQueryKeys={filterQueryKeys}
        serializeSort={serializeSort}
        mapSortToQuery={mapSortToQuery}
        actions={actions}
        renderToolbarLeft={renderToolbarLeft}
        renderToolbarRight={mergedToolbarRight}
        maxTableHeight={maxTableHeight}
      />
      <DynamicForm<TValues>
        key={mode}
        className={formClassName}
        variant={formVariant}
        open={open}
        onClose={closeForm}
        onSubmit={onSubmit}
        submitLoading={mode === "create" ? isCreating : isEditing}
        defaultValues={defaultValues}
        title={mode === "create" ? createTitle : editTitle}
        submitLabel={mode === "create" ? createSubmitLabel : editSubmitLabel}
        fields={fields}
        cancelLabel={cancelLabel}
        description={description}
        customColors={resolvedFormCustomColors}
        modalWidth={modalWidth}
        drawerWidth={drawerWidth}
        maxFormHeight={maxFormHeight}
      />
    </>
  );
}
