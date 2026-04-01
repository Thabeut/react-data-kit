# QueryTable Guide

`QueryTable` is a bridge between your query hook and `DataTable`. It handles query arg mapping, request lifecycle integration, and table state updates in one place.

## 1) Install and import

```ts
import "@thabeut/react-data-kit/style.css";
import {
  QueryTable,
  type QueryTableProps,
  type QueryResultAdapter,
  type QueryTableQueryArgs,
  parseTableState,
  serializeTableState,
} from "@thabeut/react-data-kit";
```

## 2) Required inputs

- `tableId`, `rowKey`, `columnsInfo`
- `useQuery` hook (RTK-style hook signature)
- `tag` object
- `resultAdapter` with `selectItems` and optional `selectTotalItems`

`tableState` and `onTableStateChange` are optional:

- Pass both for controlled mode (URL sync, external state, deep-linking).
- Omit both for uncontrolled mode (QueryTable keeps state internally).

## 3) Basic example (uncontrolled)

```tsx
type UserRow = { id: number; name: string; email: string };
type UsersResponse = { data: UserRow[]; total: number };

const resultAdapter: QueryResultAdapter<UserRow, UsersResponse> = {
  selectItems: (raw) => raw?.data ?? [],
  selectTotalItems: (raw) => raw?.total ?? 0,
};

<QueryTable<UserRow, UsersResponse>
  tableId="users-query-table"
  rowKey="id"
  columnsInfo={columnsInfo}
  useQuery={useUsersQuery}
  tag={{ type: "Users" }}
  resultAdapter={resultAdapter}
  searchPlaceholder="Search users"
/>
```

## 4) Controlled mode (URL synchronization pattern)

```tsx
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const [searchParams, setSearchParams] = useSearchParams();

const tableState = useMemo(
  () => parseTableState(searchParams),
  [searchParams],
);

const onTableStateChange = (next: ReturnType<typeof parseTableState>) => {
  setSearchParams(new URLSearchParams(serializeTableState(next)));
};

<QueryTable<UserRow, UsersResponse>
  tableState={tableState}
  onTableStateChange={onTableStateChange}
  tableId="users-query-table"
  rowKey="id"
  columnsInfo={columnsInfo}
  useQuery={useUsersQuery}
  tag={{ type: "Users" }}
  resultAdapter={resultAdapter}
/>
```

## 5) Query mapping controls

You can customize backend query keys:

- `limitKey` (default: `limit`)
- `searchKey` (default: `search`)
- `sortKey` (default: `sort`)
- `filterQueryKeys` (map UI filter ids to backend keys)
- `serializeSort` (customize sort value shape sent to backend)
- `mapSortToQuery` (map sort into multiple query keys)

```tsx
<QueryTable
  // ...
  limitKey="pageSize"
  searchKey="q"
  sortKey="orderBy"
  filterQueryKeys={{ createdAt: "created_range", role: "roles" }}
/>
```

If your backend expects a string sort (instead of object), use `serializeSort`:

```tsx
<QueryTable
  // ...
  serializeSort={(sort) => `${sort.field}:${sort.direction}`}
/>
```

If your backend expects separate keys (for example `sort` + `order`), use `mapSortToQuery`:

```tsx
<QueryTable
  // ...
  mapSortToQuery={(sort) => ({
    sort: sort.field,
    order: sort.direction,
  })}
/>
```

## 6) Filters and sort behavior

- Multi filters become arrays.
- Date filters become `{ date_from, date_to }`.
- Sort maps to `{ field, direction }` by default.
- Use `serializeSort` to change sort shape (for example: `"field:direction"`).
- Use `mapSortToQuery` when sort must be spread into multiple payload keys.
- Search/filter/sort changes reset page to `1`.

## 7) Best practices

- Keep `columnsInfo`, `filters`, and `resultAdapter` stable via `useMemo`.
- Use controlled mode when URL sync/shareable links are needed.
- Use `extraQuery` for static query params (tenant id, organization id, etc.).
