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
              "w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg outline-0 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all duration-200 bg-gray-50 focus:bg-white",
              "placeholder:text-gray-400",
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
