import clsx from "clsx";
import { forwardRef } from "react";

type ColumnProps = {
  children: React.ReactNode;
  className?: string;
};

export const Column = forwardRef<HTMLDivElement, ColumnProps>(({ children, className }, ref) => {
  return (
    <div ref={ref} className={clsx(`flex flex-col items-start`, className)}>
      {children}
    </div>
  );
});

Column.displayName = "Column";
