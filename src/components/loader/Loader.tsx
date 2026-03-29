import { Spin } from "antd";

export interface LoaderProps {
  className?: string;
}

export function Loader({ className }: LoaderProps) {
  return (
    <div className={className}>
      <Spin size="small" />
    </div>
  );
}
