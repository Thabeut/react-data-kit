# DynamicForm Guide

`DynamicForm` builds form UIs from a field configuration array using `react-hook-form` + `yup`.

## 1) Install and import

```ts
import "@thabeut/react-data-kit/style.css";
import {
  DynamicForm,
  DynamicFieldTypeEnum,
  type DynamicFormField,
} from "@thabeut/react-data-kit";
import * as yup from "yup";
```

## 2) Supported field types

- `input`
- `select`
- `textarea`
- `asyncSelect`
- `upload`
- `avatar`
- `color`
- `stringArray`
- `switch`
- `custom`

## 3) Build fields config

```tsx
const fields: DynamicFormField[] = [
  {
    name: "name",
    label: "Name",
    type: DynamicFieldTypeEnum.Input,
    placeholder: "Jane Doe",
    fieldSchema: yup.string().required("Name is required"),
  },
  {
    name: "role",
    label: "Role",
    type: DynamicFieldTypeEnum.Select,
    fieldProps: {
      options: [
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
      ],
    },
    fieldSchema: yup.string().required("Role is required"),
  },
  {
    name: "active",
    label: "Active",
    type: DynamicFieldTypeEnum.Switch,
  },
];
```

## 4) Default variant (inline form)

```tsx
<DynamicForm<Record<string, unknown>>
  fields={fields}
  submitLabel="Save"
  cancelLabel="Cancel"
  defaultValues={{ active: true }}
  onSubmit={async (values) => {
    await saveUser(values);
  }}
/>
```

## 5) Modal and drawer variants

```tsx
<DynamicForm
  variant="modal" // or "drawer"
  open={open}
  onClose={() => setOpen(false)}
  title="Edit user"
  description="Update user details"
  fields={fields}
  submitLabel="Save changes"
  onSubmit={handleSubmit}
/>
```

## 6) Validation model

- Validation schema is auto-composed from each field's `fieldSchema`.
- Required marker is inferred from schema tests or `required`.
- Errors are rendered under each field.

## 7) Custom field rendering

```tsx
{
  name: "customArea",
  label: "Custom",
  type: DynamicFieldTypeEnum.Custom,
  render: (form) => (
    <button type="button" onClick={() => form.setValue("name", "Preset")}>
      Fill preset
    </button>
  ),
}
```

## 8) Theme customization

Use `customColors` to override CSS variables for light/dark surfaces, borders, and text.

## 9) Production tips

- Keep `fields` memoized.
- Use explicit `defaultValues` for edit mode forms.
- Use `submitLoading` from your mutation state.
- Keep long forms in modal/drawer with `maxHeight` to avoid layout jumps.
