"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Circle } from "lucide-react";
import clsx from "clsx";

type Option = {
  label: string;
  value: string | number;
  iconColor?: string;
};

import { LucideIcon, Lock } from "lucide-react";
import { Text } from "../text/text";

type SelectProps = {
  options?: Option[];
  className?: string;
  value?: string | number;
  name?: string;
  label?: string;
  placeholder?: string;
  onChange: (value: string | number) => void;
  size?: "sm" | "md" | "lg" | "full";
  disabled?: boolean;
  isRenderingColorIcon?: boolean;
  renderOption?: (option: Option, selected: boolean) => React.ReactNode;
  icon?: LucideIcon;
  hasIcon?: boolean;
  searchEnabled?: boolean;
  readOnly?: boolean;
  dropdownDirection?: "up" | "down";
};

export default function Select({
  name,
  label,
  placeholder = "Seleccione...",
  value,
  onChange,
  options = [],
  size = "full",
  disabled = false,
  isRenderingColorIcon = false,
  renderOption,
  className,
  icon: Icon = Lock,
  hasIcon = true,
  searchEnabled = true,
  readOnly = false,
  dropdownDirection = "down",
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = `${name}-listbox`;

  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen, search]);

  const sizeClass = {
    sm: "w-1/3",
    md: "w-1/2",
    lg: "w-2/3",
    full: "w-full",
  }[size];

  // Helper to render label with color icon
  const renderLabel = (option?: Option) => (
    <span className="flex items-center gap-2">
      {isRenderingColorIcon && option?.iconColor && (
        <Circle
          size={18}
          style={{
            color: option.iconColor,
            fill: option.iconColor,
            borderColor: option.iconColor === "#FFFFFF" ? "#888" : option.iconColor,
          }}
          className={clsx("rounded-full", {
            border: option.iconColor === "#FFFFFF" ? "#888" : null,
          })}
        />
      )}
      {option?.label || placeholder}
    </span>
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      setHighlightedIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((i) => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (filteredOptions[highlightedIndex]) {
        onChange(filteredOptions[highlightedIndex].value);
        setIsOpen(false);
        setSearch("");
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      e.preventDefault();
    }
  };

  return (
    <div className={clsx("space-y-2", sizeClass, className)} ref={containerRef}>
      {label && (
        <Text variant="label" htmlFor={name} className="font-medium">
          {label}
        </Text>
      )}
      <div className="relative w-full">
        <motion.div initial={false} transition={{ duration: 0.2 }} className="relative">
          {hasIcon && (
            <Icon
              className={clsx(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200",
                {
                  "text-primary": isFocused,
                  "text-gray-400": !isFocused,
                }
              )}
            />
          )}
          <button
            type="button"
            id={name}
            name={name}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            onClick={() => !readOnly && setIsOpen(!isOpen)}
            onFocus={() => !readOnly && setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className={clsx(
              "bg-select-light-50 dark:bg-select-dark-800",
              "w-full pr-12 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white text-left",
              "placeholder:text-gray-400",
              {
                "opacity-50 cursor-not-allowed": disabled || readOnly,
                "pl-10": hasIcon,
                "pl-3": !hasIcon,
              }
            )}
          >
            {renderLabel(selectedOption)}
            <ChevronDown
              size={18}
              className={clsx(
                "absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-200",
                isOpen && "rotate-180",
                {
                  "text-primary": isFocused,
                  "text-gray-400": !isFocused,
                }
              )}
            />
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                id={listboxId}
                role="listbox"
                aria-activedescendant={
                  highlightedIndex >= 0 && filteredOptions[highlightedIndex]
                    ? `${name}-option-${filteredOptions[highlightedIndex].value}`
                    : undefined
                }
                tabIndex={-1}
                className={clsx(
                  "absolute left-0 z-[9999]",
                  "w-full",
                  "bg-select-light-50",
                  "dark:bg-select-dark-800",
                  "border-2 border-primary",
                  "rounded-xl shadow-2xl overflow-hidden",
                  {
                    "bottom-full mb-1": dropdownDirection === "up",
                    "top-full mt-1": dropdownDirection === "down",
                  }
                )}
              >
                {searchEnabled && (
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className={clsx(
                      "bg-select-light-50 dark:bg-select-dark-800",
                      "w-full px-4 py-2 border-b border-primary outline-none text-base",
                      {
                        "text-gray-400": !isFocused,
                      }
                    )}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Buscar opciones"
                  />
                )}
                <ul className="max-h-60 overflow-y-auto w-full">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, idx) => (
                      <li
                        key={option.value}
                        id={`${name}-option-${option.value}`}
                        role="option"
                        aria-selected={option.value === value}
                        tabIndex={0}
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={clsx(
                          "px-4 py-2 w-full cursor-pointer hover:bg-primary/10 flex items-center gap-2",
                          option.value === value && "bg-primary/10 font-semibold",
                          highlightedIndex === idx && "bg-primary/20"
                        )}
                      >
                        {renderOption ? renderOption(option, option.value === value) : renderLabel(option)}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-sm text-gray-500 italic">No se encuentran resultados</li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
