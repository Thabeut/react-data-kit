import type { FilterDemoRow } from "./types";

export const filterDemoRows: FilterDemoRow[] = [
  {
    id: 1,
    title: "Invoice #1042",
    status: "open",
    category: "billing",
    updatedAt: "2026-01-10",
  },
  {
    id: 2,
    title: "Refund request",
    status: "pending",
    category: "support",
    updatedAt: "2026-01-12",
  },
  {
    id: 3,
    title: "Contract renewal",
    status: "closed",
    category: "sales",
    updatedAt: "2026-01-08",
  },
  {
    id: 4,
    title: "API outage",
    status: "open",
    category: "support",
    updatedAt: "2026-01-14",
  },
  {
    id: 5,
    title: "Q1 planning",
    status: "pending",
    category: "sales",
    updatedAt: "2026-01-11",
  },
];

export const statusOptions = [
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "closed", label: "Closed" },
];

export const categoryOptions = [
  { value: "billing", label: "Billing" },
  { value: "support", label: "Support" },
  { value: "sales", label: "Sales" },
];
