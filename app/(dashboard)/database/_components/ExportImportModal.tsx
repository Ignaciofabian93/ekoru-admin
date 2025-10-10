"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import clsx from "clsx";
import { exportToExcel, exportToCSV, exportToJSON, exportTemplate } from "../_utils/export";
import { importFromExcel, ImportResult, ImportValidation } from "../_utils/import";

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  tableLabel: string;
  data: Record<string, unknown>[];
  columns: string[];
  onImportComplete?: (data: Record<string, unknown>[]) => Promise<void>;
  validation?: ImportValidation;
}

type ExportFormat = "excel" | "csv" | "json";

export default function ExportImportModal({
  isOpen,
  onClose,
  tableName,
  tableLabel,
  data,
  columns,
  onImportComplete,
  validation,
}: ExportImportModalProps) {
  const [activeTab, setActiveTab] = useState<"export" | "import">("export");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("excel");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async (format: ExportFormat) => {
    try {
      let filename = "";
      switch (format) {
        case "excel":
          filename = exportToExcel(data, tableName, columns);
          break;
        case "csv":
          filename = exportToCSV(data, tableName, columns);
          break;
        case "json":
          filename = exportToJSON(data, tableName);
          break;
      }
      console.log(`Exported to ${filename}`);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleExportTemplate = () => {
    try {
      const filename = exportTemplate(tableName, columns);
      console.log(`Template exported: ${filename}`);
    } catch (error) {
      console.error("Template export failed:", error);
      alert(`Template export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const result = await importFromExcel(file, validation);
      setImportResult(result);

      if (result.success && result.data && onImportComplete) {
        // Call the import completion handler (which should call the backend)
        await onImportComplete(result.data);
      }
    } catch (error) {
      setImportResult({
        success: false,
        errors: [error instanceof Error ? error.message : "Import failed"],
      });
    } finally {
      setImporting(false);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={clsx(
                "w-full max-w-2xl",
                "bg-white dark:bg-layout-dark-800",
                "rounded-2xl shadow-2xl",
                "border-2 border-layout-light-200 dark:border-layout-dark-700",
                "overflow-hidden"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-layout-light-200 dark:border-layout-dark-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Export / Import Data</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tableLabel}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-layout-dark-700 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-layout-light-200 dark:border-layout-dark-700">
                <button
                  onClick={() => setActiveTab("export")}
                  className={clsx(
                    "flex-1 px-6 py-3 font-medium transition-colors",
                    activeTab === "export"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Download size={18} className="inline mr-2" />
                  Export
                </button>
                <button
                  onClick={() => setActiveTab("import")}
                  className={clsx(
                    "flex-1 px-6 py-3 font-medium transition-colors",
                    activeTab === "import"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Upload size={18} className="inline mr-2" />
                  Import
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === "export" ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Select Export Format</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {(["excel", "csv", "json"] as ExportFormat[]).map((format) => (
                          <button
                            key={format}
                            onClick={() => setSelectedFormat(format)}
                            className={clsx(
                              "p-4 rounded-lg border-2 transition-all",
                              selectedFormat === format
                                ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-layout-dark-700 hover:border-gray-300 dark:hover:border-layout-dark-600"
                            )}
                          >
                            <FileSpreadsheet size={24} className="mx-auto mb-2" />
                            <p className="font-medium uppercase">{format}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-900 dark:text-blue-300">
                        <strong>{data.length} records</strong> will be exported from <strong>{tableLabel}</strong>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleExport(selectedFormat)}
                        className={clsx(
                          "flex-1 px-6 py-3 rounded-lg font-medium",
                          "bg-blue-600 hover:bg-blue-700 text-white",
                          "transition-colors duration-200",
                          "flex items-center justify-center gap-2"
                        )}
                      >
                        <Download size={20} />
                        Export as {selectedFormat.toUpperCase()}
                      </button>
                      <button
                        onClick={handleExportTemplate}
                        className={clsx(
                          "px-6 py-3 rounded-lg font-medium",
                          "bg-gray-100 dark:bg-layout-dark-700 hover:bg-gray-200 dark:hover:bg-layout-dark-600",
                          "text-gray-900 dark:text-white",
                          "transition-colors duration-200"
                        )}
                      >
                        Download Template
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Import Data from Excel</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Upload an Excel file (.xlsx) to bulk import data. Make sure your file follows the correct
                        format.
                      </p>

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={clsx(
                          "border-2 border-dashed rounded-lg p-8",
                          "border-gray-300 dark:border-layout-dark-600",
                          "hover:border-blue-500 dark:hover:border-blue-400",
                          "cursor-pointer transition-colors",
                          "flex flex-col items-center justify-center gap-3"
                        )}
                      >
                        <Upload size={48} className="text-gray-400" />
                        <p className="font-medium text-gray-900 dark:text-white">Click to select Excel file</p>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {importing && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Loader2 size={20} className="animate-spin text-blue-600 dark:text-blue-400" />
                          <p className="text-sm text-blue-900 dark:text-blue-300">Processing import...</p>
                        </div>
                      </div>
                    )}

                    {importResult && !importing && (
                      <div
                        className={clsx(
                          "border rounded-lg p-4",
                          importResult.success
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {importResult.success ? (
                            <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
                          ) : (
                            <AlertCircle size={20} className="text-red-600 dark:text-red-400 mt-0.5" />
                          )}
                          <div className="flex-1">
                            {importResult.success ? (
                              <>
                                <p className="font-medium text-green-900 dark:text-green-300">Import Successful!</p>
                                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                  {importResult.rowCount} records imported successfully.
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="font-medium text-red-900 dark:text-red-300">Import Failed</p>
                                <ul className="text-sm text-red-700 dark:text-red-400 mt-2 space-y-1">
                                  {importResult.errors?.map((error, index) => (
                                    <li key={index}>• {error}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
