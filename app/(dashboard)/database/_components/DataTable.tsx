"use client";
import { useState } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import { Search, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from "lucide-react";

interface DataTableProps {
  tableName: string;
}

// Placeholder component - will be replaced with actual data fetching
export default function DataTable({ tableName }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Placeholder data - replace with actual GraphQL query
  const placeholderData = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    column1: `Dato ${i + 1}`,
    column2: `Valor ${i + 1}`,
    column3: `Info ${i + 1}`,
  }));

  const filteredData = placeholderData.filter((item) =>
    Object.values(item).some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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
        <div className="text-sm text-gray-600 dark:text-gray-400">{filteredData.length} registros</div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg border-2 border-layout-light-200 dark:border-layout-dark-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-layout-dark-700 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Columna 1
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Columna 2
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Columna 3
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-layout-dark-800 divide-y divide-layout-light-200 dark:divide-layout-dark-700">
            {paginatedData.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="hover:bg-gray-50 dark:hover:bg-layout-dark-700 transition-colors duration-150"
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{item.id}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.column1}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.column2}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.column3}</td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Ver"
                    >
                      <Eye size={16} />
                    </motion.button>
                    <motion.button
                      className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">No se encontraron resultados</p>
            <p className="text-sm mt-2">Intenta con otro término de búsqueda</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={clsx(
                "p-2 rounded-lg flex items-center gap-2",
                "transition-colors duration-200",
                currentPage === 1
                  ? "bg-gray-100 dark:bg-layout-dark-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              )}
              whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
              whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
            >
              <ChevronLeft size={16} />
              Anterior
            </motion.button>
            <motion.button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={clsx(
                "p-2 rounded-lg flex items-center gap-2",
                "transition-colors duration-200",
                currentPage === totalPages
                  ? "bg-gray-100 dark:bg-layout-dark-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              )}
              whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
              whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
            >
              Siguiente
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        ℹ️ Datos de ejemplo. Conectar con GraphQL para mostrar datos reales de{" "}
        <span className="font-mono font-semibold">{tableName}</span>
      </div>
    </div>
  );
}
