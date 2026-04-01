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
  dependsOn: {
    field: ["status", "name"],
    effect: "disable",
    when: (values) => values.status === "active",
  },
  render: (form, { disabled, values }) => (
    <div style={{ opacity: disabled ? 0.55 : 1 }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => form.setValue("name", "Preset")}
      >
        Fill preset
      </button>
      <div>Live name: {String(values.name ?? "-")}</div>
      <div>Live status: {String(values.status ?? "-")}</div>
    </div>
  ),
}
```

- `render` receives `(form, context)`.
- `context.disabled`: resolved dependency disabled state for this custom field.
- `context.values`: current form values snapshot (useful for live previews).

## 8) Field dependencies (`dependsOn`)

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
- For `custom` fields, apply `context.disabled` in your rendered UI (for example button/input disabled state).

You can pass an array to combine rules (for example one `show` rule + one `disable` rule).

## 9) AsyncSelect with `loadOptions`

`asyncSelect` is library-agnostic and accepts:

- `options` for static mode
- `loadOptions` for async mode (`initial + search + infinite scroll`)

```tsx
const countryField: DynamicFormField = {
  type: DynamicFieldTypeEnum.AsyncSelect,
  name: "country",
  label: "Country",
  fieldProps: {
    loadOptions: async ({ page = 1, search = "" }) => {
      const data = await api.getCountries({ page, search });
      return {
        options: data.items,
        hasMore: data.skip + data.limit < data.total,
      };
    },
    getOptionLabel: (item) => item.label,
    getOptionValue: (item) => item.id,
  },
};
```

## 10) Cross-field async params (`queryDependsOn`)

Use `queryDependsOn` to inject other form values into `loadOptions` params.

```tsx
{
  name: "cityId",
  type: DynamicFieldTypeEnum.AsyncSelect,
  queryDependsOn: {
    fields: "country",
    resetOnChange: true,
    buildParams: ({ values, params }) => ({
      ...params,
      country: values.country,
    }),
  },
  fieldProps: {
    loadOptions: loadCityOptions,
    getOptionLabel: (item) => item.label,
    getOptionValue: (item) => item.id,
  },
}
```

- `fields`: watched fields that affect request params.
- `buildParams`: returns final params passed to your `loadOptions`.
- `resetOnChange` (default true): clears field value when dependency fields change.

## 11) RTK Query adapter for `loadOptions`

```tsx
const dispatch = useDispatch<AppDispatch>();

const loadCountryOptions = useMemo(
  () => async ({ page = 1, search = "" }) => {
    const data = await dispatch(
      productsRtkApi.endpoints.countriesOptions.initiate(
        { tag: { type: "dynamicform-countries" }, query: { page, search } },
        { subscribe: false },
      ),
    ).unwrap();

    return {
      options: data.items.map((item) => ({ id: item.id, label: item.label })),
      hasMore: data.skip + data.limit < data.total,
    };
  },
  [dispatch],
);
```

## 12) React Query adapter for `loadOptions`

```tsx
const queryClient = useQueryClient();

const loadCountryOptions = useMemo(
  () => async ({ page = 1, search = "" }) => {
    const data = await queryClient.fetchQuery({
      queryKey: ["countries", { page, search }],
      queryFn: () => api.getCountries({ page, search }),
      staleTime: 30_000,
    });

    return {
      options: data.items,
      hasMore: data.skip + data.limit < data.total,
    };
  },
  [queryClient],
);
```

Do not call `useQuery` directly inside `loadOptions`; use imperative client APIs (`dispatch(...initiate)` or `queryClient.fetchQuery`) in the adapter.

## 13) Theme customization

Use `customColors` to override CSS variables for light/dark surfaces, borders, and text.

## 14) Production tips

- Keep `fields` memoized.
- Use explicit `defaultValues` for edit mode forms.
- Use `submitLoading` from your mutation state.
- Keep long forms in modal/drawer with `maxFormHeight` to avoid layout jumps.
