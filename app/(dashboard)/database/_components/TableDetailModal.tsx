"use client";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Plus, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { DatabaseTable } from "../_constants/data";
import DataTable from "./DataTable";

interface TableDetailModalProps {
  table: DatabaseTable | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TableDetailModal({ table, isOpen, onClose }: TableDetailModalProps) {
  if (!table) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[95vw] max-w-7xl h-[90vh]",
              "bg-white dark:bg-layout-dark-800",
              "rounded-2xl shadow-2xl",
              "border-2 border-layout-light-200 dark:border-layout-dark-700",
              "flex flex-col",
              "z-50 overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-layout-light-200 dark:border-layout-dark-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-md">
                  <span className="text-2xl">🗄️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{table.label}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{table.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Action Buttons */}
                <motion.button
                  className={clsx(
                    "p-2 rounded-lg",
                    "bg-green-50 dark:bg-green-900/20",
                    "text-green-600 dark:text-green-400",
                    "hover:bg-green-100 dark:hover:bg-green-900/30",
                    "transition-colors duration-200"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Agregar registro"
                >
                  <Plus size={20} />
                </motion.button>

                <motion.button
                  className={clsx(
                    "p-2 rounded-lg",
                    "bg-blue-50 dark:bg-blue-900/20",
                    "text-blue-600 dark:text-blue-400",
                    "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                    "transition-colors duration-200"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Refrescar datos"
                >
                  <RefreshCw size={20} />
                </motion.button>

                <motion.button
                  className={clsx(
                    "p-2 rounded-lg",
                    "bg-purple-50 dark:bg-purple-900/20",
                    "text-purple-600 dark:text-purple-400",
                    "hover:bg-purple-100 dark:hover:bg-purple-900/30",
                    "transition-colors duration-200"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Exportar datos"
                >
                  <Download size={20} />
                </motion.button>

                <motion.button
                  onClick={onClose}
                  className={clsx(
                    "p-2 rounded-lg",
                    "bg-red-50 dark:bg-red-900/20",
                    "text-red-600 dark:text-red-400",
                    "hover:bg-red-100 dark:hover:bg-red-900/30",
                    "transition-colors duration-200"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-6">
              <DataTable tableName={table.name} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
