import type { ReactNode } from "react";
import { useMemo, type UIEvent } from "react";
import { Checkbox } from "antd";
import { Icon } from "@iconify/react";
import { datatableIconNames } from "../../constants/datatable-icons";
import { Button } from "../button";
import { Input } from "../input";
import { Loader } from "../loader";
import { PopoverEmpty } from "../popover-empty";
import type { IMultiFilterOption } from "../../types/data-table";
import { useAsyncOptions } from "../../hooks/useAsyncOptions";
import type { LoadOptions } from "../../types/async-options";

export interface MultiFilterWithQueryProps {
  options?: IMultiFilterOption[];
  loadOptions?: LoadOptions<IMultiFilterOption>;
  pageSize?: number;
  value?: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  single?: boolean;
  searchPlaceholder?: string;
  renderFilterOption?: (option: IMultiFilterOption) => ReactNode;
}

export function MultiFilterWithQuery({
  options: staticOptions,
  loadOptions,
  pageSize,
  value = [],
  onChange,
  single = false,
  searchPlaceholder,
  renderFilterOption,
}: MultiFilterWithQueryProps) {
  const isStaticMode = Array.isArray(staticOptions);
  const asyncState = useAsyncOptions<IMultiFilterOption>({
    loadOptions,
    pageSize,
    enabled: !isStaticMode,
  });
  const items = isStaticMode ? staticOptions : asyncState.options;
  const visibleItems = useMemo(() => {
    if (!isStaticMode) return items;
    const needle = asyncState.search.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => item.label.toLowerCase().includes(needle));
  }, [asyncState.search, isStaticMode, items]);
  const selectedSet = useMemo(
    () => new Set(value.map((v) => String(v))),
    [value],
  );

  const handleListScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!asyncState.hasMore || asyncState.isFetching) return;
    const target = event.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 24) {
      asyncState.loadMore();
    }
  };

  const handleToggle = (optValue: string | number) => {
    const next = single
      ? selectedSet.has(String(optValue))
        ? []
        : [optValue]
      : selectedSet.has(String(optValue))
        ? value.filter((v) => String(v) !== String(optValue))
        : [...value, optValue];
    onChange(next);
  };

  return (
    <div className="datatable-multi-filter">
      {searchPlaceholder ? (
        <Input
          unstyled
          prefix={
            <Icon icon={datatableIconNames.Search} width={16} height={16} />
          }
          value={asyncState.search}
          onChange={(e) => {
            asyncState.setSearch(e.target.value);
          }}
          placeholder={searchPlaceholder}
        />
      ) : null}
      <div className="datatable-multi-filter-list" onScroll={handleListScroll}>
        {!isStaticMode && asyncState.isLoading ? (
          <div
            style={{
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <Loader />
          </div>
        ) : visibleItems.length === 0 ? (
          <PopoverEmpty
            variant={asyncState.search.trim() ? "search" : "default"}
          />
        ) : (
          visibleItems.map((option) => {
            const isChecked = selectedSet.has(String(option.value));
            return (
              <Button
                unstyled
                key={String(option.value)}
                type="button"
                onClick={() => handleToggle(option.value)}
                className="datatable-multi-filter-item"
              >
                <Checkbox
                  checked={isChecked}
                  className="pointer-events-none"
                  style={{ flexShrink: 0 }}
                />
                {renderFilterOption ? (
                  renderFilterOption(option)
                ) : (
                  <span
                    style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {option.label}
                  </span>
                )}
              </Button>
            );
          })
        )}
      </div>
    </div>
  );
}
