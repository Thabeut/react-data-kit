import "./multi-filter-popover.scss";
import { useMemo, useState, type ReactNode } from "react";
import { Checkbox } from "antd";
import { Icon } from "@iconify/react";
import { datatableIconNames } from "../../constants/datatable-icons";
import { Button } from "../button";
import { Input } from "../input";
import { PopoverEmpty } from "../popover-empty";
import type { IMultiFilterOption } from "../../types/data-table";

export interface MultiFilterPopoverProps {
  options: IMultiFilterOption[];
  value?: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  searchPlaceholder?: string;
  renderFilterOption?: (option: IMultiFilterOption) => ReactNode;
}

export function MultiFilterPopover({
  options,
  value = [],
  onChange,
  searchPlaceholder,
  renderFilterOption,
}: MultiFilterPopoverProps) {
  const [search, setSearch] = useState("");

  const selectedSet = useMemo(
    () => new Set(value.map((v) => String(v))),
    [value],
  );

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter(
      (opt) =>
        String(opt.label).toLowerCase().includes(q) ||
        String(opt.value).toLowerCase().includes(q),
    );
  }, [options, search]);

  const handleToggle = (optValue: string | number) => {
    const next = selectedSet.has(String(optValue))
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
            <Icon
              icon={datatableIconNames.Search}
              width={16}
              height={16}
            />
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
        />
      ) : null}
      <div className="datatable-multi-filter-list">
        {filteredOptions.length === 0 ? (
          <PopoverEmpty
            variant={
              options.length > 0 && search.trim() ? "search" : "default"
            }
          />
        ) : (
          filteredOptions.map((option) => {
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
