"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { redirect } from "next/navigation";
import { Title } from "@/ui/text/title";
import { Text } from "@/ui/text/text";
import { DatabaseTable } from "./_constants/data";
import { databaseTables, TableCategory } from "./_constants/data";
import CategoryFilter from "./_ui/categoryFilter";
import TableDetailModal from "./_ui/tableDetailModal";
import TableCard from "./_ui/tableCard";
import MainLayout from "@/ui/layout/mainLayout";
import useAdminType from "@/hooks/useAdminType";

export default function DatabasePage() {
  const { isPlatformAdmin } = useAdminType();

  useEffect(() => {
    if (!isPlatformAdmin) {
      redirect("/home");
    }
  }, [isPlatformAdmin]);

  const [selectedCategory, setSelectedCategory] = useState<TableCategory | "all">("all");
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter tables based on selected category
  const filteredTables = useMemo(() => {
    if (selectedCategory === "all") return databaseTables;
    return databaseTables.filter((table) => table.category === selectedCategory);
  }, [selectedCategory]);

  // Count tables per category
  const tableCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    databaseTables.forEach((table) => {
      counts[table.category] = (counts[table.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleTableClick = (table: DatabaseTable) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTable(null), 200);
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <Title variant="h2">Base de datos</Title>
        <Text variant="p" className="mt-2">
          Gestiona y visualiza todas las tablas de tu base de datos. Selecciona una tabla para realizar operaciones
          CRUD.
        </Text>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          className="p-6 rounded-xl bg-gradient-to-br from-lime-600 to-lime-900 text-white shadow-lg"
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="text-3xl font-bold">{databaseTables.length}</div>
          <Text variant="p" className="text-white">
            Tablas totales
          </Text>
        </motion.div>
        <motion.div
          className="p-6 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 text-white shadow-lg"
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="text-3xl font-bold">{Object.keys(tableCounts).length}</div>
          <Text variant="p" className="text-white">
            Categorías
          </Text>
        </motion.div>
        <motion.div
          className="p-6 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-white shadow-lg"
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="text-3xl font-bold">{filteredTables.length}</div>
          <Text variant="p" className="text-white">
            Tablas filtradas
          </Text>
        </motion.div>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        tableCounts={tableCounts}
      />

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
        {filteredTables.map((table, index) => (
          <motion.div
            key={table.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <TableCard table={table} onClick={() => handleTableClick(table)} />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTables.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No se encontraron tablas</h3>
          <p className="text-gray-600 dark:text-gray-400">No hay tablas en esta categoría</p>
        </motion.div>
      )}

      {/* Table Detail Modal */}
      <TableDetailModal table={selectedTable} isOpen={isModalOpen} onClose={handleCloseModal} />
    </MainLayout>
  );
}
