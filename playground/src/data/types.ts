export type BasicRow = {
  id: number;
  name: string;
  email: string;
  [key: string]: unknown;
};

export type GroupedRow = {
  id: number;
  name: string;
  role: string;
  department: string;
  [key: string]: unknown;
};

export type FilterDemoRow = {
  id: number;
  title: string;
  status: string;
  category: string;
  updatedAt: string;
  [key: string]: unknown;
};
