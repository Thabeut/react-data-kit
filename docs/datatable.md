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
      productsRtkApi.endpoints.productCategoriesOptionsInfinite.initiate(
        { tag: { type: "category-infinite" }, query: { page, search } },
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

### Custom action modal/drawer themed like package

Custom action UI is app-owned. You can still make it match package look by consuming the same `--rdk-*` CSS variables in your own styles.

To match package look, style your overlay content with `--rdk-*` variables.

Available variables:

| Variable | Purpose |
| --- | --- |
| `--rdk-primary` | Primary accent color |
| `--rdk-light-surface-bg` | Light surface/background |
| `--rdk-light-popover-bg` | Light popover/dropdown background |
| `--rdk-light-popover-option-hover` | Light hover surface |
| `--rdk-light-surface-border` | Light border color |
| `--rdk-light-text-primary` | Light primary text |
| `--rdk-light-text-secondary` | Light secondary text |
| `--rdk-light-row-hover` | Light row hover |
| `--rdk-light-row-selected` | Light row selected |
| `--rdk-light-group-row` | Light grouped row background |
| `--rdk-dark-surface-bg` | Dark surface/background |
| `--rdk-dark-popover-bg` | Dark popover/dropdown background |
| `--rdk-dark-popover-option-hover` | Dark hover surface |
| `--rdk-dark-surface-border` | Dark border color |
| `--rdk-dark-text-primary` | Dark primary text |
| `--rdk-dark-text-secondary` | Dark secondary text |
| `--rdk-dark-row-hover` | Dark row hover |
| `--rdk-dark-row-selected` | Dark row selected |
| `--rdk-dark-group-row` | Dark grouped row background |

Theme switch still depends on `data-theme` on `document.documentElement`.

```tsx
import { Drawer, Modal } from "antd";
import "./custom-action-overlay.css";

const [openModal, setOpenModal] = useState(false);
const [openDrawer, setOpenDrawer] = useState(false);

<DataTable<UserRow>
  // ...
  actions={{
    customActions: (row) => [
      {
        key: "open-modal",
        label: "Open modal",
        onClick: () => setOpenModal(true),
      },
      {
        key: "open-drawer",
        label: "Open drawer",
        onClick: () => setOpenDrawer(true),
      },
    ],
  }}
/>;

<Modal
  open={openModal}
  onCancel={() => setOpenModal(false)}
  footer={null}
  rootClassName="my-custom-action-modal"
>
  Modal content
</Modal>;

<Drawer
  open={openDrawer}
  onClose={() => setOpenDrawer(false)}
  rootClassName="my-custom-action-drawer"
>
  Drawer content
</Drawer>;
```

```css
.my-custom-action-modal .ant-modal-content,
.my-custom-action-drawer .ant-drawer-content {
  background: var(--rdk-light-surface-bg);
  border: 1px solid var(--rdk-light-surface-border);
  color: var(--rdk-light-text-primary);
}

:root[data-theme="dark"] .my-custom-action-modal .ant-modal-content,
:root[data-theme="dark"] .my-custom-action-drawer .ant-drawer-content {
  background: var(--rdk-dark-surface-bg);
  border-color: var(--rdk-dark-surface-border);
  color: var(--rdk-dark-text-primary);
}
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
