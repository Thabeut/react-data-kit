import "./async-select.scss";
import type { ReactElement, UIEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Select } from "../select";
import type { SelectProps } from "../select/Select";

export interface AsyncSelectProps<TItem, TData> extends Omit<
  SelectProps<string>,
  "options" | "onSearch" | "loading" | "onPopupScroll"
> {
  useQuery: unknown;
  buildParams: (state: { page: number; search: string }) => unknown;
  reformatData: (
    data: TData | undefined,
    previousItems: TItem[],
  ) => { items: TItem[]; hasMore: boolean };
  getOptionValue: (item: TItem) => string;
  getOptionLabel: (item: TItem) => string;
}

function AsyncSelectInner<TItem, TData>(props: AsyncSelectProps<TItem, TData>) {
  const {
    useQuery,
    buildParams,
    reformatData,
    getOptionLabel,
    getOptionValue,
    showSearch = true,
    className,
    ...rest
  } = props;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<TItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const params = useMemo(
    () => buildParams({ page, search }),
    [buildParams, page, search],
  );

  const { data, isLoading, isFetching } = (
    useQuery as (args: unknown) => {
      data?: TData;
      isLoading: boolean;
      isFetching?: boolean;
    }
  )(params);

  useEffect(() => {
    if (!data) return;
    setItems((prev) => {
      const result = reformatData(data, page === 1 ? [] : prev);
      setHasMore(result.hasMore);
      return result.items;
    });
  }, [data, page, reformatData]);

  const handlePopupScroll: NonNullable<SelectProps<string>["onPopupScroll"]> = (
    event: UIEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLDivElement;
    if (
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 24 &&
      !isFetching &&
      hasMore
    ) {
      setPage((prev) => prev + 1);
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
      filterOption={false}
      onSearch={(value) => {
        setSearch(value);
        setPage(1);
      }}
      loading={isLoading}
      options={options}
      onPopupScroll={handlePopupScroll}
    />
  );
}

export const AsyncSelect = AsyncSelectInner as <TItem, TData>(
  props: AsyncSelectProps<TItem, TData>,
) => ReactElement;
