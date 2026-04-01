import type { ReactNode } from "react";
import { Popover } from "antd";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { datatableIconNames } from "../../../../constants/datatable-icons";
import { Button } from "../../../../components/button";
import { Input } from "../../../../components/input";
import { OptionsPopover } from "../../../../components/options-popover";
import type {
  DataTableColumnInfo,
  DataTableFilterConfig,
} from "../../../../types/data-table";

export interface DataTableToolbarProps<T extends object> {
  showSearch: boolean;
  resolvedSearchValue: string;
  useInternalSearch: boolean;
  setSearchInternal: (value: string) => void;
  onSearch?: (value: string) => void;
  inputPlaceholder: string;
  renderToolbarLeft?: ReactNode;
  filters?: DataTableFilterConfig[];
  renderFilterContent: (filter: DataTableFilterConfig) => ReactNode;
  handleFilterToggle: (id: string) => void;
  isFilterActive: (filter: DataTableFilterConfig) => boolean;
  activeFilterIds: string[];
  openFilterId: string | null;
  setOpenFilterId: (id: string | null) => void;
  renderToolbarRight?: ReactNode;
  hideColumnOptions?: boolean;
  columnsInfo: DataTableColumnInfo<T>[];
  visibleColumnIds: string[];
  handleColumnToggle: (id: string) => void;
  toggleColumnsTitle: string;
  themeClassName?: string;
}

export function DataTableToolbar<T extends object>(
  props: DataTableToolbarProps<T>,
) {
  const {
    showSearch,
    resolvedSearchValue,
    useInternalSearch,
    setSearchInternal,
    onSearch,
    inputPlaceholder,
    renderToolbarLeft,
    filters,
    renderFilterContent,
    handleFilterToggle,
    isFilterActive,
    activeFilterIds,
    openFilterId,
    setOpenFilterId,
    renderToolbarRight,
    hideColumnOptions,
    columnsInfo,
    visibleColumnIds,
    handleColumnToggle,
    toggleColumnsTitle,
    themeClassName,
  } = props;

  return (
    <div className="datatable-filters">
      <div className="datatable-filters-left">
        {showSearch && (
          <Input
            className="datatable-toolbar-search"
            value={resolvedSearchValue}
            onChange={(event) => {
              if (useInternalSearch) {
                setSearchInternal(event.target.value);
              }
              onSearch?.(event.target.value);
            }}
            placeholder={inputPlaceholder}
          />
        )}
        {renderToolbarLeft}
        {filters?.map((filter) => {
          const hasPopover =
            (filter.type === "date" && filter.dateOptions) ||
            ((filter.type === "multi" || filter.type === "single") &&
              (filter.options ?? filter.loadOptions));
          const isActive = hasPopover
            ? isFilterActive(filter)
            : activeFilterIds.includes(filter.id);

          const triggerBtn = (
            <Button
              key={filter.id}
              variant="outlined"
              type="button"
              onClick={() =>
                !hasPopover ? handleFilterToggle(filter.id) : undefined
              }
              className={clsx(
                "datatable-filter-chip",
                isActive && "datatable-filter-chip-active",
              )}
            >
              <span className="datatable-filter-chip-icon">
                <Icon
                  icon={datatableIconNames.PlusCircle}
                  width={16}
                  height={16}
                />
              </span>
              <span className="datatable-filter-chip-label">
                {filter.label}
              </span>
            </Button>
          );

          if (hasPopover) {
            return (
              <Popover
                key={filter.id}
                open={openFilterId === filter.id}
                onOpenChange={(open) =>
                  setOpenFilterId(open ? filter.id : null)
                }
                trigger="click"
                placement="bottomLeft"
                rootClassName={clsx(
                  "rdk-theme-scope datatable-filter-popover",
                  themeClassName,
                )}
                content={renderFilterContent(filter)}
              >
                {triggerBtn}
              </Popover>
            );
          }

          return triggerBtn;
        })}
      </div>
      <div className="datatable-filters-right">
        {renderToolbarRight}
        {!hideColumnOptions && (
          <OptionsPopover
            title={toggleColumnsTitle}
            options={columnsInfo.map((info) => ({
              key: info.id,
              label: info.label,
            }))}
            value={visibleColumnIds}
            onChange={handleColumnToggle}
            multi
            placement="bottomRight"
            overlayClassName={themeClassName}
            trigger={
              <Button type="button">
                <Icon
                  icon={datatableIconNames.Filters}
                  width={18}
                  height={18}
                />
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
