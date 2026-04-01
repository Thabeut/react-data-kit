export type PropDocRow = {
  key: string;
  prop: string;
  type: string;
  required: string;
  description: string;
};

export const dynamicFormPropRows: PropDocRow[] = [
  {
    key: "variant",
    prop: "variant",
    type: `"default" | "modal" | "drawer"`,
    required: "no",
    description: "Render inline (default), in a Modal, or in a Drawer.",
  },
  {
    key: "open",
    prop: "open",
    type: "boolean",
    required: "modal/drawer",
    description: "Controls visibility for modal/drawer variants.",
  },
  {
    key: "onClose",
    prop: "onClose",
    type: "() => void",
    required: "modal/drawer",
    description: "Called when closing modal/drawer (cancel or after submit).",
  },
  {
    key: "title",
    prop: "title",
    type: "ReactNode",
    required: "no",
    description: "Header title.",
  },
  {
    key: "description",
    prop: "description",
    type: "ReactNode",
    required: "no",
    description: "Header description/subtitle.",
  },
  {
    key: "fields",
    prop: "fields",
    type: "DynamicFormField[]",
    required: "yes",
    description:
      "Array of field configs. Each item maps to a rendered form control and can include `fieldSchema` for validation.",
  },
  {
    key: "fields_depends_on",
    prop: "fields[].dependsOn",
    type: "DynamicFormDependencyRule | DynamicFormDependencyRule[]",
    required: "no",
    description:
      "Field dependency rules. Use `effect: \"show\"` to hide/show or `effect: \"disable\"` to disable when condition is not met. Supports custom `when(values)` predicates.",
  },
  {
    key: "fields_query_depends_on",
    prop: "fields[].queryDependsOn (asyncSelect only)",
    type: "DynamicFormQueryDependency",
    required: "no",
    description:
      "Map other field values into async query params via `buildParams`, and optionally reset dependent value when watched fields change.",
  },
  {
    key: "defaultValues",
    prop: "defaultValues",
    type: "TValues",
    required: "no",
    description:
      "Initial values. Modal/drawer resets to these values when opened/closed.",
  },
  {
    key: "submitLabel",
    prop: "submitLabel",
    type: "ReactNode",
    required: "yes",
    description: "Submit button label.",
  },
  {
    key: "cancelLabel",
    prop: "cancelLabel",
    type: "ReactNode",
    required: "no",
    description: "Cancel button label (default: \"Cancel\").",
  },
  {
    key: "onSubmit",
    prop: "onSubmit",
    type: "(values: TValues) => void | Promise<void>",
    required: "yes",
    description: "Called with validated values on submit.",
  },
  {
    key: "customColors",
    prop: "customColors",
    type: "{ primaryColor?, lightMode?, darkMode? }",
    required: "no",
    description:
      "Override primary + light/dark surface/border/text colors via CSS variables (same `--rdk-*` vars as DataTable).",
  },
  {
    key: "modalWidth",
    prop: "modalWidth",
    type: "number",
    required: "no",
    description: "Modal width (default: 480).",
  },
  {
    key: "drawerWidth",
    prop: "drawerWidth",
    type: "number",
    required: "no",
    description: "Drawer width (default: 460).",
  },
  {
    key: "maxFormHeight",
    prop: "maxFormHeight",
    type: "string",
    required: "no",
    description:
      "Max height for the fields area. If omitted, drawer/modal use viewport-safe defaults so actions remain visible.",
  },
  {
    key: "className",
    prop: "className",
    type: "string",
    required: "no",
    description: "Additional class on the form root.",
  },
];

