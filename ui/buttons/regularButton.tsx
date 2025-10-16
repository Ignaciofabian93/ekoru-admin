"use client";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  disabled?: boolean;
  className?: string;
  selected?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function RegularButton({
  type = "button",
  text,
  disabled = false,
  className,
  selected = false,
  size = "md",
  onClick,
  ...restProps
}: Props) {
  const sizeClass = {
    sm: "text-sm py-2 px-2",
    md: "text-md py-3 px-4",
    lg: "text-lg py-3 px-5",
  }[size];
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      form={restProps.form}
      className={clsx(
        "w-full min-w-[100px]",
        "py-3 px-4 rounded-lg font-medium shadow-md transition-all duration-200",
        "flex items-center justify-center space-x-2 disabled:opacity-30",
        sizeClass,
        selected
          ? "bg-gray-700/80 text-gray-50 border border-gray-700"
          : "bg-white text-gray-700 border border-gray-700 hover:bg-gray-100",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center space-x-2"
        >
          <span>{text}</span>
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
