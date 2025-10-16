import { ReactNode, forwardRef } from "react";
import clsx from "clsx";

type CardVariant = "default" | "elevated" | "outlined" | "interactive";
type CardSize = "sm" | "md" | "lg" | "xl";

type CardWrapperProps = {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  size?: CardSize;
  onClick?: () => void;
  hoverable?: boolean;
  role?: string;
  "aria-label"?: string;
};

const sizeClasses: Record<CardSize, string> = {
  sm: "p-3 min-h-[150px]",
  md: "p-5 min-h-[200px]",
  lg: "p-6 min-h-[250px]",
  xl: "p-8 min-h-[300px]",
};

const variantClasses: Record<CardVariant, string> = {
  default: clsx("bg-card-light-50 dark:bg-card-dark-900", "border-card-light-200 dark:border-card-dark-700"),
  elevated: clsx("bg-white dark:bg-stone-900", "border-transparent", "shadow-md dark:shadow-stone-950/50"),
  outlined: clsx("bg-transparent", "border-card-light-300 dark:border-card-dark-600", "border-2"),
  interactive: clsx("bg-white dark:bg-stone-800", "border-card-light-200 dark:border-card-dark-700"),
};

export const CardWrapper = forwardRef<HTMLDivElement, CardWrapperProps>(
  (
    { children, className, variant = "default", size = "md", onClick, hoverable = true, role, "aria-label": ariaLabel },
    ref
  ) => {
    const isInteractive = !!onClick || variant === "interactive";

    return (
      <div
        ref={ref}
        role={role || (isInteractive ? "button" : undefined)}
        aria-label={ariaLabel}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          isInteractive
            ? (e) => {
                if ((e.key === "Enter" || e.key === " ") && onClick) {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        className={clsx(
          // Base styles
          "relative rounded-xl border overflow-hidden",
          "transition-all duration-200 ease-in-out",
          "border-2 border-stone-200",
          "dark:border-stone-700",

          // Size
          sizeClasses[size],

          // Variant
          variantClasses[variant],

          // Hover states (only if hoverable)
          hoverable && [
            "hover:border-lime-400 dark:hover:border-lime-600",
            variant === "elevated"
              ? "hover:shadow-xl dark:hover:shadow-stone-950/70"
              : "hover:shadow-lg dark:hover:shadow-stone-950/30",
          ],

          // Interactive states
          isInteractive && [
            "cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2",
            "dark:focus:ring-lime-600 dark:focus:ring-offset-stone-900",
            "active:scale-[0.98]",
          ],

          // Custom classes
          className
        )}
      >
        {children}
      </div>
    );
  }
);

CardWrapper.displayName = "CardWrapper";
