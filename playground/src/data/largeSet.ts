import type { BasicRow } from "./types";

const firstNames = [
  "Alex",
  "Blake",
  "Casey",
  "Drew",
  "Eden",
  "Finley",
  "Gray",
  "Harper",
  "Indigo",
  "Jules",
];
const lastNames = [
  "Smith",
  "Jones",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
  "Thomas",
];

export function buildLargeRows(count: number): BasicRow[] {
  const rows: BasicRow[] = [];
  for (let i = 1; i <= count; i++) {
    const fn = firstNames[(i - 1) % firstNames.length];
    const ln = lastNames[(i - 1) % lastNames.length];
    rows.push({
      id: i,
      name: `${fn} ${ln} ${i}`,
      email: `user${i}@example.com`,
    });
  }
  return rows;
}

export const serverDemoTotal = 500;
