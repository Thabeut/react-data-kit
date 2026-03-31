import "./async-select.scss";
import type { ReactElement, UIEvent } from "react";
import { Select } from "../select";
import type { SelectProps } from "../select/Select";
import { useAsyncOptions } from "../../hooks/useAsyncOptions";
import type { LoadOptions } from "../../types/async-options";

export interface AsyncSelectProps<TItem> extends Omit<
  SelectProps<string>,
  "options" | "onSearch" | "loading" | "onPopupScroll" | "filterOption"
> {
  options?: TItem[];
  loadOptions?: LoadOptions<TItem>;
  pageSize?: number;
  getOptionValue: (item: TItem) => string;
  getOptionLabel: (item: TItem) => string;
}

function AsyncSelectInner<TItem>(props: AsyncSelectProps<TItem>) {
  const {
    options: staticOptions,
    loadOptions,
    pageSize,
    getOptionLabel,
    getOptionValue,
    showSearch = true,
    className,
    ...rest
  } = props;

  const isStaticMode = Array.isArray(staticOptions);
  const asyncState = useAsyncOptions<TItem>({
    loadOptions,
    pageSize,
    enabled: !isStaticMode,
  });
  const items = isStaticMode ? staticOptions : asyncState.options;

  const handlePopupScroll: NonNullable<SelectProps<string>["onPopupScroll"]> = (
    event: UIEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLDivElement;
    if (
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 24 &&
      asyncState.hasMore &&
      !asyncState.isFetching
    ) {
      asyncState.loadMore();
    }
  };

  const options = items.map((item) => ({
    value: getOptionValue(item),
    label: getOptionLabel(item),
  }));

  return (
    <Select<string>
      {...rest}
      className={className}
      showSearch={showSearch}
      filterOption={isStaticMode ? true : false}
      onSearch={isStaticMode ? undefined : asyncState.setSearch}
      searchValue={isStaticMode ? undefined : asyncState.search}
      loading={isStaticMode ? false : asyncState.isLoading}
      options={options}
      onPopupScroll={handlePopupScroll}
    />
  );
}

export const AsyncSelect = AsyncSelectInner as <TItem>(
  props: AsyncSelectProps<TItem>,
) => ReactElement;
