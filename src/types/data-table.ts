import type { ReactNode } from "react";
import type { ColumnType, TableProps } from "antd/es/table";
import type { LoadOptions } from "./async-options";

export type DataTableKey = string | number;
export type DataTableSortOrder = "ascend" | "descend";
export const DataTableFilterTypeEnum = {
  Date: "date",
  Multi: "multi",
  Single: "single",
} as const;
export type DataTableFilterType =
  (typeof DataTableFilterTypeEnum)[keyof typeof DataTableFilterTypeEnum];

export interface DataTableSortState {
  columnId: string;
  order: DataTableSortOrder;
}

export interface InternalGroupRow {
  __group: true;
  __groupKey: string;
}

export type InternalRow<T> = T | InternalGroupRow;

export interface IDateFilterOption {
  value: string;
  label: string;
}

export interface IMultiFilterOption {
  value: string | number;
  label: string;
  [key: string]: unknown;
}

export interface DataTableFilterConfig {
  id: string;
  label: string;

  type?: DataTableFilterType;
  dateOptions?: IDateFilterOption[];
  options?: IMultiFilterOption[];
  loadOptions?: LoadOptions<IMultiFilterOption>;
  searchPlaceholder?: string;
  renderFilterOption?: (option: IMultiFilterOption) => ReactNode;
}

export interface DataTableGroupConfig<T> {
  getGroupLabel: (record: T) => string;

  order?: string[];
  groupIcon?: string;
}

export interface DataTablePaginationConfig {
  pageSizeOptions: number[];
  defaultPageSize: number;

  totalItems?: number;
}

export interface DeleteModalConfig {
  title: string;
  description: string;
  confirmLabel: string;

  cancelLabel?: string;
  isLoading?: boolean;
}

export interface ActionItem<T = unknown> {
  key: string;
  label: string;
  onClick: (record: T) => void;

  icon?: string;
  danger?: boolean;
}

export interface DataTableActionsConfig<T> {
  onPreview?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void | Promise<void>;
  canPreview?: (record: T) => boolean;
  canEdit?: (record: T) => boolean;
  canDelete?: (record: T) => boolean;
  canShowActions?: (record: T) => boolean;
  deleteModalConfig?: DeleteModalConfig;
  customActions?: ActionItem<T>[] | ((record: T) => ActionItem<T>[]);
}

export type DataTableColumnInfo<T extends object> = Omit<
  ColumnType<InternalRow<T>>,
  "title"
> & {
  id: string;
  label: string;
  sortable?: boolean;

  defaultVisible?: boolean;
  minWidthClassName?: string;
  maxWidthClassName?: string;
};

export interface DataTablePaginationState {
  page: number;
  pageSize: number;
}

export interface DataTableModeColors {
  surfaceBg: string;
  popoverBg: string;
  popoverOptionHoverBg: string;
  surfaceBorder: string;
  textPrimary: string;
  rowHoverBg: string;
  rowSelectedBg: string;
  groupRowBg: string;
}

export interface DataTableCustomColors {
  primaryColor?: string;
  lightMode?: Partial<DataTableModeColors>;
  darkMode?: Partial<DataTableModeColors>;
}

export interface DataTableProps<T extends { [key: string]: unknown }> {
  tableId: string;
  rowKey: TableProps<T>["rowKey"];
  columnsInfo: DataTableColumnInfo<T>[];
  dataSource: T[];
  pagination: DataTablePaginationConfig;

  className?: string;
  serverMode?: boolean;
  customColors?: DataTableCustomColors;
  columnResize?: boolean;
  filters?: DataTableFilterConfig[];
  filterValues?: Record<string, unknown>;
  onFilterChange?: (filterId: string, value: unknown) => void;
  groupConfig?: DataTableGroupConfig<T>;
  paginationState?: DataTablePaginationState;
  loading?: boolean;
  onRefresh?: () => void;
  onFiltersChange?: (activeFilterIds: string[]) => void;
  onVisibleColumnsChange?: (visibleColumnIds: string[]) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  sortState?: DataTableSortState | null;
  onSortChange?: (sort: DataTableSortState | null) => void;
  renderToolbarRight?: ReactNode;
  renderToolbarLeft?: ReactNode;
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  onSelectionChange?: (selectedRowKeys: DataTableKey[], rows: T[]) => void;
  onBookmarkChange?: (bookmarkedRowKeys: DataTableKey[], rows: T[]) => void;
  actions?: DataTableActionsConfig<T>;
  disableSelectionAndBookmark?: boolean;
  hideColumnOptions?: boolean;
  onRowClick?: (record: T) => void;
  maxTableHeight?: string;
}
