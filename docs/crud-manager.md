# CrudManager Guide

`CrudManager` composes `QueryTable` + `DynamicForm` so you can build full CRUD screens faster with one component.

## 1) Install and import

```ts
import "@thabeut/react-data-kit/style.css";
import {
  CrudManager,
  DynamicFieldTypeEnum,
  type DynamicFormField,
  type CrudManagerProps,
} from "@thabeut/react-data-kit";
import * as yup from "yup";
```

## 2) What CrudManager handles

- Table listing (query, sort, filters, pagination)
- Add button in toolbar
- Create/Edit form in modal or drawer
- Delete action integration
- Default action wiring (`onEdit`, `onDelete`) with optional custom actions

## 3) Required setup

- All main `QueryTable` props (`tableState`, `useQuery`, `resultAdapter`, etc.)
- Form `fields`
- CRUD handlers (`onCreate`, `onUpdate`, optional `onDelete`)

## 4) Basic example

```tsx
const fields: DynamicFormField[] = [
  {
    name: "name",
    label: "Name",
    type: DynamicFieldTypeEnum.Input,
    fieldSchema: yup.string().required(),
  },
  {
    name: "email",
    label: "Email",
    type: DynamicFieldTypeEnum.Input,
    fieldSchema: yup.string().email().required(),
  },
];

<CrudManager<UserRow, UsersResponse, UserFormValues>
  tableState={tableState}
  onTableStateChange={setTableState}
  tableId="users-crud"
  rowKey="id"
  columnsInfo={columnsInfo}
  useQuery={useUsersQuery}
  tag={{ type: "Users" }}
  resultAdapter={{
    selectItems: (d) => d?.data ?? [],
    selectTotalItems: (d) => d?.total ?? 0,
  }}
  fields={fields}
  formVariant="drawer"
  createTitle="Create user"
  editTitle="Edit user"
  submitLabel="Save"
  onCreate={createUser}
  onUpdate={(row, values) => updateUser(row.id, values)}
  onDelete={(row) => deleteUser(row.id)}
  editDefaultValues={(row) => ({ name: row.name, email: row.email })}
/>
```

## 5) Form mode and labels

Customize:

- `formVariant`: `"default" | "modal" | "drawer"`
- `addButtonLabel`
- `createTitle`, `editTitle`
- `createSubmitLabel`, `editSubmitLabel`

## 6) Loading states

Map mutation loading states:

- `isCreating`
- `isEditing`
- `isDeleting`

These states are reflected in form submit and delete modal UI.

## 7) Post-submit hooks

Use `onAfterSubmit(mode, values, record?)` to run side effects (toast, analytics, refetch, route updates).

## 8) Production tips

- Keep table state in URL if deep-linking matters.
- Use `editDefaultValues` to avoid uncontrolled form behavior.
- Keep `fields` and query adapters memoized.
