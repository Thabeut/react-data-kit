import type { ReactNode } from "react";
import { useMemo, useState, type UIEvent } from "react";
import { Checkbox } from "antd";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { RDK_I18N_DEFAULT_TEXT } from "../../constants/rdk-i18n-keys";
import { datatableIconNames } from "../../constants/datatable-icons";
import { Button } from "../button";
import { Input } from "../input";
import { Loader } from "../loader";
import { PopoverEmpty } from "../popover-empty";
import type {
  IOptionsQueryConfig,
  IMultiFilterOption,
} from "../../types/data-table";

export interface MultiFilterWithQueryProps {
  optionsQuery: IOptionsQueryConfig;
  value?: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  single?: boolean;
  searchPlaceholder?: string;
  renderFilterOption?: (option: IMultiFilterOption) => ReactNode;
}

export function MultiFilterWithQuery({
  optionsQuery,
  value = [],
  onChange,
  single = false,
  searchPlaceholder,
  renderFilterOption,
}: MultiFilterWithQueryProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { useQuery, tag, formatOptions } = optionsQuery;
  const queryArgs = useMemo(
    () => ({ tag, query: { page, search } }),
    [tag, page, search],
  );
  const { data, isLoading, isFetching } = useQuery(queryArgs);
  const formatted = useMemo(() => formatOptions(data), [data, formatOptions]);
  const items = formatted.items;
  const hasMore = formatted.hasMore;
  const selectedSet = useMemo(
    () => new Set(value.map((v) => String(v))),
    [value],
  );

  const handleListScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasMore || isFetching) return;
    const target = event.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 24) {
      setPage((prev) => prev + 1);
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

  if (isLoading === true) {
    return (
      <div
        className="datatable-multi-filter"
        style={{
          minHeight: 120,
          minWidth: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Loader />
      </div>
    );
  }

  if (items.length === 0 && !isLoading) {
    return (
      <div
        className="datatable-multi-filter"
        style={{
          minWidth: 220,
          padding: 12,
          fontSize: 14,
          lineHeight: "20px",
        }}
      >
        {t("noOptionsAvailable", {
          defaultValue: RDK_I18N_DEFAULT_TEXT.noOptionsAvailable,
        })}
      </div>
    );
  }

  return (
    <div className="datatable-multi-filter">
      {searchPlaceholder ? (
        <Input
          unstyled
          prefix={
            <Icon icon={datatableIconNames.Search} width={16} height={16} />
          }
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={searchPlaceholder}
        />
      ) : null}
      <div className="datatable-multi-filter-list" onScroll={handleListScroll}>
        {items.length === 0 ? (
          <PopoverEmpty variant={search.trim() ? "search" : "default"} />
        ) : (
          items.map((option) => {
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
