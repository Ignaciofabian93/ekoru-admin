import clsx from "clsx";
import { forwardRef } from "react";

type RowProps = {
  children: React.ReactNode;
  className?: string;
};

export const Row = forwardRef<HTMLDivElement, RowProps>(({ children, className }, ref) => {
  return (
    <div ref={ref} className={clsx(`flex flex-row items-center`, className)}>
      {children}
    </div>
  );
});

Row.displayName = "Row";
