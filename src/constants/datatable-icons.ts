export const datatableIconNames = {
  PlusCircle: "simple-line-icons:plus",
  Filters: "carbon:global-filters",
  MoreVertical: "lucide:more-vertical",
  Eye: "lucide:eye",
  Star: "bi:star",
  StarHalf: "bi:star-half",
  StarFilled: "bi:star-fill",
  RefreshCw: "lucide:refresh-cw",
  ChevronsLeft: "lucide:chevrons-left",
  ChevronLeft: "lucide:chevron-left",
  ChevronRight: "lucide:chevron-right",
  ChevronsRight: "lucide:chevrons-right",
  Search: "lucide:search",
  ArrowUpDown: "lucide:arrow-up-down",
  ArrowUp: "lucide:arrow-up",
  ArrowDown: "lucide:arrow-down",
  Check: "lucide:check",
  Edit: "lucide:edit",
  Trash2: "lucide:trash-2",
  Inbox: "lucide:inbox",
} as const;

export type DataTableIconName =
  (typeof datatableIconNames)[keyof typeof datatableIconNames];
