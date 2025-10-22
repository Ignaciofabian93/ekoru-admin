"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Plus, RefreshCw, Database } from "lucide-react";
import { useMutation, gql } from "@apollo/client";
import { DatabaseTable } from "../_constants/data";
import { Title } from "@/ui/text/title";
import { Text } from "@/ui/text/text";
import clsx from "clsx";
import DataTable from "./dataTable";
import ExportImportModal from "./exportImportModal";
import { useTableData } from "@/hooks/useTableData";
import NewRecordModal from "./newRecordModal";
import EditRecordModal from "./editRecordModal";
import DeleteRecordModal from "./deleteRecordModal";
import { getBulkImportMutation, hasBulkImportMutation } from "@/graphql/database/mutations";
import { BulkImportResult } from "@/types/bulk";
import useAlert from "@/hooks/useAlert";

// Dummy mutation as fallback for useMutation (never actually called)
const DUMMY_MUTATION = gql`
  mutation Dummy {
    __typename
  }
`;

interface TableDetailModalProps {
  table: DatabaseTable | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TableDetailModal({ table, isOpen, onClose }: TableDetailModalProps) {
  const [showExportImportModal, setShowExportImportModal] = useState<boolean>(false);
  const [showNewRecordModal, setShowNewRecordModal] = useState<boolean>(false);
  const [showEditRecordModal, setShowEditRecordModal] = useState<boolean>(false);
  const [showDeleteRecordModal, setShowDeleteRecordModal] = useState<boolean>(false);
  const [selectedRowData, setSelectedRowData] = useState<Record<string, unknown> | null>(null);
  const { notify, notifyError } = useAlert();

  console.log("Table: ", table);

  // Get bulk import mutation for this table (if available)
  // We need to call useMutation unconditionally, so we provide a dummy mutation as fallback
  const bulkImportMutation = table ? getBulkImportMutation(table.name) : null;
  const [executeBulkImport] = useMutation(bulkImportMutation || DUMMY_MUTATION);

  const handleEditRow = (rowData: Record<string, unknown>) => {
    console.log("Edit row: ", rowData);
    setSelectedRowData(rowData);
    setShowEditRecordModal(true);
  };

  const handleDeleteRow = (rowData: Record<string, unknown>) => {
    console.log("Delete row: ", rowData);
    setSelectedRowData(rowData);
    setShowDeleteRecordModal(true);
  };

  // Fetch all data for export with large page size
  const { data, loading, refetch } = useTableData({
    tableName: table?.name || "",
    page: 1,
    pageSize: 10000, // Get all data for export
  });

  if (!table) return null;

  // Get column names from data
  const columns = data.length > 0 ? Object.keys(data[0]).filter((key) => !key.startsWith("__")) : [];

  const handleImportComplete = async (importedData: Record<string, unknown>[]) => {
    console.log("Imported Data: ", importedData);

    // Check if bulk import is available for this table
    if (!hasBulkImportMutation(table.name)) {
      notifyError(`Bulk import not available for ${table.label}. Please contact support.`);
      return;
    }

    try {
      // Determine the variable name based on table name
      // Examples: ProductCategories -> categories, Departments -> departments
      const variableName =
        table.name === "ProductCategories"
          ? "categories"
          : table.name === "DepartmentCategory"
          ? "categories"
          : table.name === "Departments"
          ? "departments"
          : "data"; // fallback

      // Execute bulk import mutation
      const { data: result } = await executeBulkImport({
        variables: {
          [variableName]: importedData,
        },
      });

      // Extract result based on mutation name
      const mutationKey = Object.keys(result)[0];
      const importResult: BulkImportResult = result[mutationKey];

      console.log("Bulk Import Result:", importResult);

      // Show result to user
      if (importResult.success) {
        notify(`✅ Import completed! Created: ${importResult.created}, Failed: ${importResult.failed}`);

        // Show errors if any
        if (importResult.errors && importResult.errors.length > 0) {
          console.warn("Import errors:", importResult.errors);
          importResult.errors.forEach((err) => {
            console.error(`Row ${err.row}: ${err.error}`, err.data);
          });
        }
      } else {
        notifyError(`Import failed. Check console for details.`);
        console.error("Import errors:", importResult.errors);
      }

      // Refetch data after import
      await refetch();

      // Close the export/import modal
      setShowExportImportModal(false);
    } catch (error) {
      console.error("Bulk import error:", error);
      notifyError(`Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
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
                "flex flex-col"
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
                    onClick={() => setShowNewRecordModal(true)}
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
                <DataTable tableName={table.name} handleDeleteRow={handleDeleteRow} handleEditRow={handleEditRow} />
              </div>
            </motion.div>
          </div>

          {/* New Record Modal */}
          <NewRecordModal
            isOpen={showNewRecordModal}
            onClose={() => setShowNewRecordModal(false)}
            tableName={table.name}
            tableLabel={table.label}
            data={data}
            columns={columns}
            onRecordCreated={refetch} // Refresh table data after creating record
          />

          {/* Edit Record Modal */}
          <EditRecordModal
            isOpen={showEditRecordModal}
            onClose={() => {
              setShowEditRecordModal(false);
              setSelectedRowData(null);
            }}
            tableName={table.name}
            tableLabel={table.label}
            selectedRowData={selectedRowData}
            onRecordUpdated={refetch} // Refresh table data after updating record
          />

          {/* Delete Record Modal */}
          <DeleteRecordModal
            isOpen={showDeleteRecordModal}
            onClose={() => {
              setShowDeleteRecordModal(false);
              setSelectedRowData(null);
            }}
            tableName={table.name}
            tableLabel={table.label}
            selectedRowData={selectedRowData}
            onRecordDeleted={refetch} // Refresh table data after deleting record
          />

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
