"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { exportToExcel, exportToCSV, exportToJSON, exportTemplate } from "../_utils/export";
import { importFromExcel, ImportResult, ImportValidation } from "../_utils/import";
import { Title } from "@/ui/text/title";
import { Text } from "@/ui/text/text";
import clsx from "clsx";
import MainButton from "@/ui/buttons/mainButton";
import useAlert from "@/hooks/useAlert";

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
  const { notify, notifyError } = useAlert();
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
      notify(`Plantilla exportada: ${filename}`);
    } catch (error) {
      console.error("La exportación de la plantilla falló:", error);
      notifyError("Ocurrió un error al exportar la plantilla");
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
                  <div className="p-2 bg-gradient-to-br from-lime-500 to-teal-600 rounded-lg text-white">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <Title variant="h4" className="font-bold">
                      Exportar / Importar Datos
                    </Title>
                    <Text variant="p">{tableLabel}</Text>
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
                      ? "text-lime-600 dark:text-lime-400 border-b-2 border-lime-600 dark:border-lime-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Download size={18} className="inline mr-2" />
                  Exportar
                </button>
                <button
                  onClick={() => setActiveTab("import")}
                  className={clsx(
                    "flex-1 px-6 py-3 font-medium transition-colors",
                    activeTab === "import"
                      ? "text-lime-600 dark:text-lime-400 border-b-2 border-lime-600 dark:border-lime-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Upload size={18} className="inline mr-2" />
                  Importar
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === "export" ? (
                  <div className="space-y-6">
                    <div>
                      <Title variant="h5" className="font-semibold mb-3">
                        Selecciona el formato de exportación
                      </Title>
                      <div className="grid grid-cols-3 gap-3">
                        {(["excel", "csv", "json"] as ExportFormat[]).map((format) => (
                          <button
                            key={format}
                            onClick={() => setSelectedFormat(format)}
                            className={clsx(
                              "p-4 rounded-lg border-2 transition-all",
                              selectedFormat === format
                                ? "border-lime-600 dark:border-lime-400 bg-lime-50 dark:bg-lime-900/20"
                                : "border-gray-200 dark:border-layout-dark-700 hover:border-gray-300 dark:hover:border-layout-dark-600"
                            )}
                          >
                            <FileSpreadsheet size={24} className="mx-auto mb-2" />
                            <Text variant="p" className="font-medium uppercase">
                              {format}
                            </Text>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-lg p-4">
                      <Text variant="span">
                        <strong>{data.length} registros</strong> serán exportados desde <strong>{tableLabel}</strong>
                      </Text>
                    </div>

                    <div className="flex gap-3">
                      <MainButton
                        text={`Exportar como ${selectedFormat.toUpperCase()}`}
                        onClick={() => handleExport(selectedFormat)}
                        icon={Download}
                      />
                      <MainButton
                        variant="outline"
                        text="Descargar plantilla"
                        onClick={handleExportTemplate}
                        icon={Download}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <Title variant="h4" className="font-semibold mb-3">
                        Importar datos desde Excel
                      </Title>
                      <Text variant="p" className="mb-4">
                        Sube un archivo de Excel (.xlsx) para importar datos en bloque. Asegúrate de que tu archivo siga
                        el formato correcto.
                      </Text>

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
                        <Text variant="span" className="font-medium">
                          Click para seleccionar archivo Excel
                        </Text>
                        <Text variant="span">o arrastra y suelta</Text>
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
                      <div className="bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Loader2 size={20} className="animate-spin text-lime-600 dark:text-lime-400" />
                          <Text variant="span">Procesando datos...</Text>
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
                                <p className="font-medium text-green-900 dark:text-green-300">Importación exitosa!</p>
                                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                  {importResult.rowCount} registros importados con éxito.
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="font-medium text-red-900 dark:text-red-300">Importación fallida</p>
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
