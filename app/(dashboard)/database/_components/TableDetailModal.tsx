"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Plus, RefreshCw, Database } from "lucide-react";
import { DatabaseTable } from "../_constants/data";
import { Title } from "@/ui/text/title";
import { Text } from "@/ui/text/text";
import clsx from "clsx";
import DataTable from "./DataTable";
import ExportImportModal from "./ExportImportModal";
import { useTableData } from "@/hooks/useTableData";

interface TableDetailModalProps {
  table: DatabaseTable | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TableDetailModal({ table, isOpen, onClose }: TableDetailModalProps) {
  const [showExportImportModal, setShowExportImportModal] = useState(false);

  // Fetch all data for export (without pagination)
  const { data, loading, refetch } = useTableData({
    tableName: table?.name || "",
    limit: 10000, // Get all data for export
    offset: 0,
  });

  if (!table) return null;

  // Get column names from data
  const columns = data.length > 0 ? Object.keys(data[0]).filter((key) => !key.startsWith("__")) : [];

  const handleImportComplete = async (importedData: Record<string, unknown>[]) => {
    // TODO: Call your backend bulk import mutation here
    console.log("Importing data:", importedData);

    // Example GraphQL mutation call:
    // await bulkImportMutation({
    //   variables: {
    //     tableName: table.name,
    //     data: importedData
    //   }
    // });

    // Refetch data after import
    await refetch();

    // Close the export/import modal
    setShowExportImportModal(false);
  };

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
            className="fixed top-0 left-0 inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                "w-full max-w-7xl h-[90vh]",
                "bg-white dark:bg-layout-dark-800",
                "rounded-2xl shadow-2xl",
                "border-2 border-layout-light-200 dark:border-layout-dark-700",
                "flex flex-col",
                "overflow-hidden"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-layout-light-200 dark:border-layout-dark-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg text-white shadow-md">
                    <Database size={24} />
                  </div>
                  <div>
                    <Title variant="h3" className="font-bold">
                      {table.label}
                    </Title>
                    <Text variant="span" className="font-semibold">
                      {table.description}
                    </Text>
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
                    onClick={() => refetch()}
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
                    disabled={loading}
                  >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                  </motion.button>

                  <motion.button
                    onClick={() => setShowExportImportModal(true)}
                    className={clsx(
                      "p-2 rounded-lg",
                      "bg-purple-50 dark:bg-purple-900/20",
                      "text-purple-600 dark:text-purple-400",
                      "hover:bg-purple-100 dark:hover:bg-purple-900/30",
                      "transition-colors duration-200"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Exportar / Importar datos"
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
          </div>

          {/* Export/Import Modal */}
          <ExportImportModal
            isOpen={showExportImportModal}
            onClose={() => setShowExportImportModal(false)}
            tableName={table.name}
            tableLabel={table.label}
            data={data}
            columns={columns}
            onImportComplete={handleImportComplete}
          />
        </>
      )}
    </AnimatePresence>
  );
}
