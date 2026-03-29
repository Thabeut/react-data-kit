export const DATA_TABLE_I18N_KEYS = [
  "actionPreview",
  "actionEdit",
  "actionDelete",
  "actions",
  "back",
  "bookmark",
  "bookmarkAll",
  "refresh",
  "rowsPerPage",
  "searchByName",
  "toggleColumns",
  "noOptionsAvailable",
  "noSearchResults",
  "datatableSelectedRowsNone",
  "datatableSelectedRowsSome",
  "datatablePageOf",
] as const;

export type DataTableI18nKey = (typeof DATA_TABLE_I18N_KEYS)[number];
