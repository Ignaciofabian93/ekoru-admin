"use client";
import { motion } from "motion/react";
import clsx from "clsx";
import { TableCategory, tableCategories } from "../_constants/data";
import { Filter } from "lucide-react";
import { Title } from "@/ui/text/title";
import { Text } from "@/ui/text/text";

interface CategoryFilterProps {
  selectedCategory: TableCategory | "all";
  onCategoryChange: (category: TableCategory | "all") => void;
  tableCounts: Record<string, number>;
}

const categoryIcons: Record<string, string> = {
  all: "🗂️",
  Administración: "👨‍💼",
  Ubicación: "📍",
  Usuarios: "👥",
  Catálogo: "📦",
  Productos: "🛍️",
  Servicios: "🔧",
  Transacciones: "💳",
  Pagos: "💰",
  Comunicación: "💬",
  Social: "❤️",
  Contenido: "📝",
  Sostenibilidad: "🌱",
  Tienda: "🏪",
};

export default function CategoryFilter({ selectedCategory, onCategoryChange, tableCounts }: CategoryFilterProps) {
  const allCategories = ["all" as const, ...tableCategories];

  return (
    <div className="mb-8 w-full">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-600 dark:text-gray-400" />
        <Title variant="h5" className="font-semibold">
          Filtrar por categoría
        </Title>
      </div>

      <div className="flex flex-wrap justify-evenly gap-2 mx-auto">
        {allCategories.map((category) => {
          const isActive = selectedCategory === category;
          const label = category === "all" ? "Todas" : category;
          const count =
            category === "all" ? Object.values(tableCounts).reduce((a, b) => a + b, 0) : tableCounts[category] || 0;

          return (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={clsx(
                "px-4 py-2 rounded-lg border-2",
                "font-medium text-sm min-w-[200px]",
                "transition-all duration-200",
                "flex items-center justify-between gap-2",
                isActive
                  ? "bg-gradient-to-r from-lime-600 to-lime-800 text-white border-lime-500 shadow-md"
                  : "bg-white dark:bg-layout-dark-800 border-layout-light-200 dark:border-layout-dark-700 hover:border-lime-300 dark:hover:border-lime-600"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <Text variant="p">{categoryIcons[category]}</Text>
                <Text
                  variant="label"
                  className={clsx({ "text-white": isActive, "text-stone-800 dark:text-white": !isActive })}
                >
                  {label}
                </Text>
              </div>
              <Text
                variant="span"
                className={clsx(
                  "px-2 py-0.5 rounded-full font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-layout-dark-700 text-gray-600 dark:text-gray-400"
                )}
              >
                {count}
              </Text>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
