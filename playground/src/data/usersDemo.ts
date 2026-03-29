export type UserDemoRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "away" | "offline";
  joinedAt: string;
  location: string;
  [key: string]: unknown;
};

/** Deterministic avatar (Dicebear SVG, no API key). */
export function userDemoAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
}

export const userDemoRows: UserDemoRow[] = [
  {
    id: 1,
    name: "Amelia Chen",
    email: "amelia.chen@example.com",
    role: "Staff engineer",
    department: "Engineering",
    status: "active",
    joinedAt: "2021-03-12",
    location: "Berlin",
  },
  {
    id: 2,
    name: "Jordan Blake",
    email: "jordan.blake@example.com",
    role: "Frontend lead",
    department: "Engineering",
    status: "active",
    joinedAt: "2020-08-01",
    location: "Toronto",
  },
  {
    id: 3,
    name: "Sam Rivera",
    email: "sam.rivera@example.com",
    role: "Backend engineer",
    department: "Engineering",
    status: "away",
    joinedAt: "2022-01-17",
    location: "Mexico City",
  },
  {
    id: 4,
    name: "Priya Nair",
    email: "priya.nair@example.com",
    role: "Design lead",
    department: "Design",
    status: "active",
    joinedAt: "2019-11-04",
    location: "Singapore",
  },
  {
    id: 5,
    name: "Leo Martins",
    email: "leo.martins@example.com",
    role: "Product designer",
    department: "Design",
    status: "active",
    joinedAt: "2023-05-22",
    location: "Lisbon",
  },
  {
    id: 6,
    name: "Noah Kim",
    email: "noah.kim@example.com",
    role: "UX researcher",
    department: "Design",
    status: "offline",
    joinedAt: "2022-09-30",
    location: "Seoul",
  },
  {
    id: 7,
    name: "Morgan Ellis",
    email: "morgan.ellis@example.com",
    role: "Product manager",
    department: "Product",
    status: "active",
    joinedAt: "2018-04-15",
    location: "Austin",
  },
  {
    id: 8,
    name: "Casey Wu",
    email: "casey.wu@example.com",
    role: "Product manager",
    department: "Product",
    status: "away",
    joinedAt: "2021-07-08",
    location: "Vancouver",
  },
  {
    id: 9,
    name: "Riley Brooks",
    email: "riley.brooks@example.com",
    role: "Program manager",
    department: "Product",
    status: "active",
    joinedAt: "2023-02-14",
    location: "Chicago",
  },
  {
    id: 10,
    name: "Taylor Reed",
    email: "taylor.reed@example.com",
    role: "DevOps",
    department: "Operations",
    status: "active",
    joinedAt: "2020-12-01",
    location: "Dublin",
  },
  {
    id: 11,
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "Support lead",
    department: "Operations",
    status: "active",
    joinedAt: "2019-06-20",
    location: "Portland",
  },
  {
    id: 12,
    name: "Quinn Park",
    email: "quinn.park@example.com",
    role: "Analytics",
    department: "Operations",
    status: "offline",
    joinedAt: "2024-01-09",
    location: "Tokyo",
  },
];
