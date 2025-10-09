"use client";
import { motion } from "motion/react";
import { Database, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { DatabaseTable } from "../_constants/data";

interface TableCardProps {
  table: DatabaseTable;
  onClick: () => void;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Administración: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
  Ubicación: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  Usuarios: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
  },
  Catálogo: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
  },
  Productos: {
    bg: "bg-pink-50 dark:bg-pink-900/20",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-800",
  },
  Servicios: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
  },
  Transacciones: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-800",
  },
  Pagos: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  Comunicación: {
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-800",
  },
  Social: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
  },
  Contenido: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
  },
  Sostenibilidad: {
    bg: "bg-lime-50 dark:bg-lime-900/20",
    text: "text-lime-700 dark:text-lime-300",
    border: "border-lime-200 dark:border-lime-800",
  },
};

export default function TableCard({ table, onClick }: TableCardProps) {
  const colors = categoryColors[table.category] || categoryColors.Catálogo;

  return (
    <motion.div
      onClick={onClick}
      className={clsx(
        "relative p-5 rounded-xl border-2",
        "bg-white dark:bg-layout-dark-800",
        "border-layout-light-200 dark:border-layout-dark-700",
        "hover:border-blue-300 dark:hover:border-blue-600",
        "cursor-pointer group",
        "transition-all duration-200",
        "shadow-sm hover:shadow-lg dark:shadow-layout-dark-900/50"
      )}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={clsx("px-3 py-1 rounded-full text-xs font-semibold border", colors.bg, colors.text, colors.border)}
        >
          {table.category}
        </span>
        <motion.div
          className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400"
          animate={{ x: 0 }}
          whileHover={{ x: 4 }}
        >
          <ChevronRight size={20} />
        </motion.div>
      </div>

      {/* Icon & Title */}
      <div className="flex items-start gap-3 mb-3">
        <div className={clsx("p-2 rounded-lg", "bg-gradient-to-br from-blue-500 to-blue-600", "text-white shadow-md")}>
          <Database size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{table.label}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{table.name}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{table.description}</p>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        initial={false}
      />
    </motion.div>
  );
}
