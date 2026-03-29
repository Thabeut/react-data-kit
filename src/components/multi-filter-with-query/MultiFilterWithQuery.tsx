import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "../loader";
import type { IOptionsQueryConfig, IMultiFilterOption } from "../../types/data-table";
import { MultiFilterPopover } from "../multi-filter-popover";

export interface MultiFilterWithQueryProps {
  optionsQuery: IOptionsQueryConfig;
  value?: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  searchPlaceholder?: string;
  renderFilterOption?: (option: IMultiFilterOption) => ReactNode;
}

export function MultiFilterWithQuery({
  optionsQuery,
  value = [],
  onChange,
  searchPlaceholder,
  renderFilterOption,
}: MultiFilterWithQueryProps) {
  const { t } = useTranslation();
  const { useQuery, tag, formatOptions } = optionsQuery;
  const { data, isLoading } = useQuery({ tag });
  const options = formatOptions(data);

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

  if (options.length === 0) {
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
        {t("noOptionsAvailable")}
      </div>
    );
  }

  return (
    <MultiFilterPopover
      options={options}
      value={value}
      onChange={onChange}
      searchPlaceholder={searchPlaceholder}
      renderFilterOption={renderFilterOption}
    />
  );
}
