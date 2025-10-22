"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import { Search, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useTableData } from "@/hooks/useTableData";
import Pagination from "@/ui/pagination/pagination";

interface DataTableProps {
  tableName: string;
  handleEditRow?: (rowData: Record<string, unknown>) => void;
  handleDeleteRow?: (rowData: Record<string, unknown>) => void;
}

export default function DataTable({ tableName, handleEditRow, handleDeleteRow }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { data, loading, error, refetch, pageInfo } = useTableData({
    tableName,
    page: currentPage,
    pageSize: itemsPerPage,
  });

  // Reset page when table changes
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
  }, [tableName]);

  // Filter data based on search term (only for client-side filtering)
  const filteredData = searchTerm
    ? data.filter((item) =>
        Object.values(item).some((val) => val?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : data;

  // Calculate pagination info
  const totalPages = pageInfo?.totalPages || 1;

  const displayData = searchTerm ? filteredData : data;

  // Get column names from first data item
  const columns = displayData.length > 0 ? Object.keys(displayData[0]).filter((key) => key !== "__typename") : [];

  // Format cell value for display
  const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "✓" : "✗";

    const stringValue = String(value);
    const maxLength = 40;

    if (stringValue.length > maxLength) {
      return stringValue.substring(0, maxLength) + "...";
    }

    return stringValue;
  };

  // Loading state
  if (loading && data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error("DataTable error:", error);
    console.error("GraphQL errors:", error.graphQLErrors);
    console.error("Network error:", error.networkError);

    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{error.message}</p>
          {error.graphQLErrors && error.graphQLErrors.length > 0 && (
            <div className="text-sm text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">GraphQL Errors:</p>
              {error.graphQLErrors.map((err, idx) => (
                <pre key={idx} className="text-xs overflow-auto">
                  {JSON.stringify(err, null, 2)}
                </pre>
              ))}
            </div>
          )}
          {error.networkError && (
            <div className="text-sm text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Network Error:</p>
              <pre className="text-xs overflow-auto">{JSON.stringify(error.networkError, null, 2)}</pre>
            </div>
          )}
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en la tabla..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={clsx(
              "w-full pl-10 pr-4 py-2 rounded-lg",
              "bg-gray-50 dark:bg-layout-dark-700",
              "border-2 border-layout-light-200 dark:border-layout-dark-600",
              "text-gray-900 dark:text-white",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400",
              "transition-colors duration-200"
            )}
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {pageInfo ? `${pageInfo.totalCount} registros totales` : `${displayData.length} registros`}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg border-2 border-layout-light-200 dark:border-layout-dark-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-layout-dark-700 sticky top-0">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-layout-dark-800 divide-y divide-layout-light-200 dark:divide-layout-dark-700">
            {displayData.map((item, index) => (
              <motion.tr
                key={String(item.id) || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="hover:bg-gray-50 dark:hover:bg-layout-dark-700 transition-colors duration-150"
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className={clsx(
                      "px-4 py-3 text-sm",
                      column === "id" ? "text-gray-900 dark:text-white font-mono" : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {formatCellValue(item[column])}
                  </td>
                ))}
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Editar"
                      onClick={() => handleEditRow && handleEditRow(item)}
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Eliminar"
                      onClick={() => handleDeleteRow && handleDeleteRow(item)}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {displayData.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">No se encontraron resultados</p>
            <p className="text-sm mt-2">Intenta con otro término de búsqueda</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Empty State - No Data */}
      {data.length === 0 && !loading && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          ℹ️ No hay datos disponibles para <span className="font-mono font-semibold">{tableName}</span>
        </div>
      )}
    </div>
  );
}
