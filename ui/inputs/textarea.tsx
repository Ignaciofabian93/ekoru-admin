import clsx from "clsx";
import { motion } from "motion/react";

type Props = React.HTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  placeholder?: string;
  value: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  minLength?: number;
  className?: string;
};

export default function TextArea({
  label,
  placeholder,
  value,
  name,
  onChange,
  maxLength,
  minLength,
  className,
  ...props
}: Props) {
  return (
    <div className={clsx("space-y-2 w-full")}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative w-full">
        <motion.div initial={false} transition={{ duration: 0.2 }} className="relative w-full">
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            minLength={minLength}
            maxLength={maxLength}
            className={clsx(
              "border border-gray-300",
              "rounded-lg outline-0",
              "transition-all duration-200",
              "bg-input-light-100 focus:bg-white",
              "focus:ring-1 focus:ring-primary focus:border-primary",
              "dark:bg-input-dark-800 dark:focus:bg-input-dark-900",
              "placeholder:text-gray-400",
              "w-full pl-3 pr-3 py-3",
              "resize-none min-h-[200px]",
              className
            )}
            placeholder={placeholder}
            {...props}
          />
        </motion.div>
      </div>
    </div>
  );
}
