export type PropDocRow = {
  key: string;
  prop: string;
  type: string;
  required: string;
  description: string;
};

export const crudManagerPropRows: PropDocRow[] = [
  {
    key: "table-props",
    prop: "tableState, onTableStateChange, tableId, rowKey, columnsInfo, useQuery, tag, resultAdapter, ...",
    type: "QueryTable props (flattened)",
    required: "yes",
    description:
      "All needed QueryTable props are passed directly on CrudManager (no nested object).",
  },
  {
    key: "form-props",
    prop: "fields, cancelLabel, description, modalWidth, drawerWidth, maxFormHeight, formClassName, formCustomColors, ...",
    type: "DynamicForm props (flattened)",
    required: "yes",
    description:
      "DynamicForm configuration is also passed directly (no nested object).",
  },
  {
    key: "formVariant",
    prop: "formVariant",
    type: `"default" | "modal" | "drawer"`,
    required: "no",
    description: "Form surface variant. Default is `drawer`.",
  },
  {
    key: "editDefaultValues",
    prop: "editDefaultValues",
    type: "(item: TItem) => TValues",
    required: "for edit",
    description:
      "Maps selected row into form defaults for edit mode. Create mode starts empty.",
  },
  {
    key: "onCreate",
    prop: "onCreate",
    type: "(values: TValues) => void | Promise<void>",
    required: "for add",
    description: "Called on create submit.",
  },
  {
    key: "onUpdate",
    prop: "onUpdate",
    type: "(item: TItem, values: TValues) => void | Promise<void>",
    required: "for edit",
    description: "Called on edit submit.",
  },
  {
    key: "onDelete",
    prop: "onDelete",
    type: "(item: TItem) => void | Promise<void>",
    required: "no",
    description:
      "Handles row delete action. It is merged with `actions.onDelete` when both are provided.",
  },
  {
    key: "actions",
    prop: "actions",
    type: "QueryTable actions config",
    required: "no",
    description:
      "Optional pass-through table actions (permissions, delete modal config, custom actions). Custom action UI (modal/drawer) is app-owned.",
  },
  {
    key: "labels",
    prop: "addButtonLabel, createTitle, editTitle, createSubmitLabel, editSubmitLabel",
    type: "ReactNode",
    required: "no",
    description: "Text/labels customization for CRUD interactions.",
  },
  {
    key: "onAfterSubmit",
    prop: "onAfterSubmit",
    type: "(mode, values, record?) => void | Promise<void>",
    required: "no",
    description: "Optional callback after create/update, useful for refetching.",
  },
];
