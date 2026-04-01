# DataTable Guide

`DataTable` is the base table component for local or server-driven lists with search, filters, sorting, pagination, selection/bookmarks, grouping, and row actions.

## 1) Install and import

```bash
npm install @thabeut/react-data-kit
```

```ts
import "@thabeut/react-data-kit/style.css";
import {
  DataTable,
  DataTableFilterTypeEnum,
  type DataTableColumnInfo,
} from "@thabeut/react-data-kit";
```

## 2) Define row type and columns

```tsx
type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

const columnsInfo: DataTableColumnInfo<UserRow>[] = [
  { id: "name", label: "Name", dataIndex: "name", sortable: true },
  { id: "email", label: "Email", dataIndex: "email" },
  { id: "role", label: "Role", dataIndex: "role", sortable: true },
  { id: "createdAt", label: "Created At", dataIndex: "createdAt", sortable: true },
];
```

## 3) Minimal working table

```tsx
<DataTable<UserRow>
  tableId="users"
  rowKey="id"
  columnsInfo={columnsInfo}
  dataSource={rows}
  pagination={{ pageSizeOptions: [10, 20, 50], defaultPageSize: 10 }}
/>
```

## 4) Server mode setup

Use external state for page, page size, search, filters, and sort.

```tsx
<DataTable<UserRow>
  tableId="users"
  rowKey="id"
  columnsInfo={columnsInfo}
  dataSource={rows}
  serverMode
  loading={isLoading}
  pagination={{
    pageSizeOptions: [10, 20, 50],
    defaultPageSize: 10,
    totalItems: total,
  }}
  paginationState={{ page, pageSize }}
  onPageChange={(nextPage, nextPageSize) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
  }}
  searchValue={search}
  onSearch={setSearch}
  sortState={sortState}
  onSortChange={setSortState}
/>
```

## 5) Filters

The component supports:

- `type: DataTableFilterTypeEnum.Single` for one selected option
- `type: DataTableFilterTypeEnum.Multi` for multiple selected options
- `type: DataTableFilterTypeEnum.Date` for date range

```tsx
const filters = [
  {
    id: "role",
    label: "Role",
    type: DataTableFilterTypeEnum.Single,
    options: [
      { value: "admin", label: "Admin" },
      { value: "editor", label: "Editor" },
    ],
  },
  {
    id: "createdAt",
    label: "Created",
    type: DataTableFilterTypeEnum.Date,
    dateOptions: [{ value: "custom", label: "Custom range" }],
  },
];
```

### Async filter options with `loadOptions`

For `single` / `multi` filters, you can provide either:

- `options`: static array (uses the classic static popover UI)
- `loadOptions`: async loader (`initial + search + infinite scroll`)

```tsx
import type { LoadOptions, IMultiFilterOption } from "@thabeut/react-data-kit";

const loadCategoryOptions: LoadOptions<IMultiFilterOption> = async ({
  page = 1,
  search = "",
}) => {
  const result = await myApi.getCategories({ page, search }); // your adapter
  return {
    options: result.items.map((item) => ({ value: item.id, label: item.label })),
    hasMore: result.skip + result.limit < result.total,
  };
};

const filters = [
  {
    id: "category",
    label: "Category",
    type: DataTableFilterTypeEnum.Multi,
    loadOptions: loadCategoryOptions,
    searchPlaceholder: "Search category",
  },
];
```

#### RTK Query adapter pattern (inside component)

```tsx
const dispatch = useDispatch<AppDispatch>();

const loadCategoryOptions = useMemo<LoadOptions<IMultiFilterOption>>(
  () => async ({ page = 1, search = "" }) => {
    const data = await dispatch(
      productsRtkApi.endpoints.productCategoriesOptions.initiate(
        { tag: { type: "category-options" }, query: { page, search } },
        { subscribe: false },
      ),
    ).unwrap();

    return {
      options: data.items.map((item) => ({ value: item.id, label: item.label })),
      hasMore: data.skip + data.limit < data.total,
    };
  },
  [dispatch],
);
```

Use non-infinite endpoints for `loadOptions` and let the component handle appending pages internally. Reserve `useInfiniteQuery`/infinite RTK endpoints for the dedicated `InfiniteScroll` components.

#### React Query adapter pattern (inside component)

```tsx
const queryClient = useQueryClient();

const loadCategoryOptions = useMemo<LoadOptions<IMultiFilterOption>>(
  () => async ({ page = 1, search = "" }) => {
    const data = await queryClient.fetchQuery({
      queryKey: ["categories", { page, search }],
      queryFn: () => api.getCategories({ page, search }),
      staleTime: 30_000,
    });

    return {
      options: data.items.map((item) => ({ value: item.id, label: item.label })),
      hasMore: data.skip + data.limit < data.total,
    };
  },
  [queryClient],
);
```

Do not call `useQuery` hooks inside `loadOptions`; hooks must stay at component top level.

## 6) Grouping

```tsx
groupConfig={{
  getGroupLabel: (row) => row.role,
  order: ["admin", "editor", "viewer"],
}}
```

## 7) Actions (preview/edit/delete/custom)

```tsx
actions={{
  onPreview: (row) => console.log("preview", row.id),
  onEdit: (row) => console.log("edit", row.id),
  onDelete: async (row) => deleteRow(row.id),
  deleteModalConfig: {
    title: "Delete user",
    description: "This action cannot be undone.",
    confirmLabel: "Delete",
  },
  customActions: (row) => [
    { key: "impersonate", label: "Impersonate", onClick: () => act(row.id) },
  ],
}}
```

## 8) Selection / bookmark callbacks

```tsx
onSelectionChange={(keys, selectedRows) => {
  console.log(keys, selectedRows);
}}
onBookmarkChange={(keys, bookmarkedRows) => {
  console.log(keys, bookmarkedRows);
}}
```

## 9) URL state helpers

Optional: use `serializeTableState` and `parseTableState` when you run `DataTable` in controlled/server mode and want deep-linkable URL state (page, pageSize, search, filters, sort).

If you use `QueryTable`, this pattern is already the standard integration there, so you usually apply it at the page level with `QueryTable`.

## 10) i18n keys (what to override)

`DataTable` uses i18next keys internally. The package exports `RDK_I18N_KEYS` so you can discover all supported keys.
Add these keys to your app locale JSON files (for example `en.json`, `fr.json`, `ar.json`) to customize labels.
If your app does not provide translations for these keys, React Data Kit falls back to built-in English defaults.

| Key | Default text (en) |
| --- | --- |
| `actionPreview` | `Preview` |
| `actionEdit` | `Edit` |
| `actionDelete` | `Delete` |
| `actions` | `Actions` |
| `back` | `Back` |
| `bookmark` | `Bookmark` |
| `bookmarkAll` | `Bookmark all` |
| `refresh` | `Refresh` |
| `rowsPerPage` | `Rows per page` |
| `searchByName` | `Search` |
| `toggleColumns` | `Toggle columns` |
| `noOptionsAvailable` | `No options available` |
| `noSearchResults` | `No matching options` |
| `datatableSelectedRowsNone` | `No rows selected ({{total}} total)` |
| `datatableSelectedRowsSome` | `{{selected}} of {{total}} rows selected` |
| `datatablePageOf` | `Page {{page}} of {{totalPages}}` |

## 11) Common production checklist

- Give `tableId` a stable value.
- Keep `columnsInfo` memoized.
- In server mode, reset page to `1` when search/filter/sort changes.
- Pass `totalItems` for correct pagination.
- Debounce search before requests if your backend needs it.
