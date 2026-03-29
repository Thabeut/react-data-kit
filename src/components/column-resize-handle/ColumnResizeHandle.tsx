import { useCallback, useRef } from "react";

export interface ColumnResizeHandleProps {
  onResize: (deltaPx: number) => void;
  onResizeEnd: () => void;
}

export function ColumnResizeHandle({
  onResize,
  onResizeEnd,
}: ColumnResizeHandleProps) {
  const lastRef = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      lastRef.current = e.clientX;
      const onMove = (ev: MouseEvent) => {
        onResize(ev.clientX - lastRef.current);
        lastRef.current = ev.clientX;
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        onResizeEnd();
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [onResize, onResizeEnd],
  );

  return (
    <span
      className="datatable-col-resize"
      onMouseDown={onMouseDown}
      role="separator"
      aria-orientation="vertical"
      aria-hidden
    />
  );
}
