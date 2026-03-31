export const RDK_I18N_KEYS = [
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

export type RdkI18nKey = (typeof RDK_I18N_KEYS)[number];

export const RDK_I18N_DEFAULT_TEXT: Record<RdkI18nKey, string> = {
  actionPreview: "Preview",
  actionEdit: "Edit",
  actionDelete: "Delete",
  actions: "Actions",
  back: "Back",
  bookmark: "Bookmark",
  bookmarkAll: "Bookmark all",
  refresh: "Refresh",
  rowsPerPage: "Rows per page",
  searchByName: "Search",
  toggleColumns: "Toggle columns",
  noOptionsAvailable: "No options available",
  noSearchResults: "No matching options",
  datatableSelectedRowsNone: "No rows selected ({{total}} total)",
  datatableSelectedRowsSome: "{{selected}} of {{total}} rows selected",
  datatablePageOf: "Page {{page}} of {{totalPages}}",
};
