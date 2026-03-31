# DynamicForm Guide

`DynamicForm` builds form UIs from a field configuration array using `react-hook-form` + `yup`.

## 1) Install and import

```ts
import "@thabeut/react-data-kit/style.css";
import {
  DynamicForm,
  DynamicFieldTypeEnum,
  defineAsyncSelectField,
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

## 10) Field dependencies (`dependsOn`)

Use `dependsOn` on any field to control visibility or disabled state based on other field values.

```tsx
{
  name: "cityId",
  label: "City",
  type: DynamicFieldTypeEnum.AsyncSelect,
  dependsOn: { field: "country", effect: "show", resetOnHide: true },
}
```

- `effect: "show"`: field is hidden until condition passes.
- `effect: "disable"`: field stays visible but disabled until condition passes.
- `when(values)`: optional custom predicate.
- `resetOnHide`: optional, clears field value when it becomes hidden.

You can pass an array to combine rules (for example one `show` rule + one `disable` rule).

## 11) Cross-field query params (`queryDependsOn`, asyncSelect)

Use `queryDependsOn` to feed values from other fields into async query params.

```tsx
{
  name: "cityId",
  type: DynamicFieldTypeEnum.AsyncSelect,
  queryDependsOn: {
    fields: "country",
    resetOnChange: true,
    buildParams: ({ values, state, baseParams }) => ({
      ...baseParams,
      query: {
        ...(baseParams as any).query,
        country: values.country,
        page: state.page,
        search: state.search,
      },
    }),
  },
  fieldProps: {
    useQuery: useCitiesQuery,
    buildParams: ({ page, search }) => ({ query: { page, search } }),
    // ...
  },
}
```

- `fields`: watched fields that influence query params.
- `buildParams`: returns final params for the async query hook.
- `resetOnChange` (default true): clears current field value when dependency fields change.

## 12) Typed async field helper (`defineAsyncSelectField`)

For strict typing (no `any` / `unknown` in app code), use `defineAsyncSelectField`:

```tsx
const countryField = defineAsyncSelectField<CountryOption, PublicOptionsListResponse, CountriesQueryPayload>({
  type: DynamicFieldTypeEnum.AsyncSelect,
  name: "country",
  label: "Country",
  fieldProps: {
    useQuery: useCountriesOptionsRtkQuery,
    buildParams: ({ page, search }) => ({
      tag: { type: "dynamicform-countries" },
      query: { page, search },
    }),
    formatData: (data) => {
      const items = data?.items ?? [];
      return { items, hasMore: Boolean(data && data.skip + data.limit < data.total) };
    },
    getOptionLabel: (item) => item.label,
    getOptionValue: (item) => item.id,
  },
});
```

Generic params map to:

- `TItem` (`CountryOption` above): one option item shape used by `getOptionLabel` and `getOptionValue`.
- `TData` (`PublicOptionsListResponse`): raw response shape returned by your query hook (`useQuery`).
- `TArgs` (`CountriesQueryPayload`): argument shape accepted by your query hook and produced by `buildParams`.

Quick mental model:

- `useQuery(args: TArgs) -> { data?: TData }`
- `formatData(data: TData) -> { items: TItem[]; hasMore: boolean }`
- `getOptionLabel(item: TItem)` and `getOptionValue(item: TItem)`

Always pass explicit generics with `defineAsyncSelectField<TItem, TData, TArgs>(...)` to keep callback parameters strongly typed and avoid inference gaps in `formatData` / label-value callbacks.
