export const iconNames = {
  Plus: "lucide:plus",
  Close: "lucide:x",
  User: "lucide:user",
  Camera: "lucide:camera",
  Upload: "lucide:upload",
} as const;

export type IconName = (typeof iconNames)[keyof typeof iconNames];
