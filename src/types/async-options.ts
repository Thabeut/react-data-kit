export interface AsyncOptionsParams {
  search?: string;
  page?: number;
  pageSize?: number;
  [key: string]: unknown;
}

export interface AsyncOptionsResult<TOption> {
  options: TOption[];
  hasMore?: boolean;
}

export type LoadOptions<TOption> = (
  params: AsyncOptionsParams,
) => Promise<AsyncOptionsResult<TOption>>;
