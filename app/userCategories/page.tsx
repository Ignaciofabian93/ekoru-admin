"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import AppWrapper from "../wrapper";
import useUserCategories from "./_hooks/useUserCategories";
import Table from "@/components/table";
import Button from "@/components/button";
import { UserCategory } from "@/types/user";

interface UserCategoryFormData {
  name: string;
  level: number;
  categoryDiscountAmount: number;
  pointsThreshold: number;
}

export default function UserCategoriesPage() {
  const {
    userCategories,
    loading,
    error,
    createUserCategory,
    updateUserCategory,
    deleteUserCategory,
  } = useUserCategories();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<UserCategory | null>(
    null
  );
  const [formData, setFormData] = useState<UserCategoryFormData>({
    name: "",
    level: 0,
    categoryDiscountAmount: 0,
    pointsThreshold: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = [
    {
      key: "id" as keyof UserCategory,
      header: "ID",
    },
    {
      key: "name" as keyof UserCategory,
      header: "Nombre",
    },
    {
      key: "level" as keyof UserCategory,
      header: "Nivel",
    },
    {
      key: "categoryDiscountAmount" as keyof UserCategory,
      header: "Descuento (%)",
    },
    {
      key: "pointsThreshold" as keyof UserCategory,
      header: "Umbral de Puntos",
    },
    {
      key: "actions" as keyof UserCategory,
      header: "Acciones",
      render: (_: unknown, item: UserCategory) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(item)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(item.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === userCategories.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(userCategories.map((_, index) => index)));
    }
  };

  const handleEdit = (category: UserCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      level: category.level,
      categoryDiscountAmount: category.categoryDiscountAmount,
      pointsThreshold: category.pointsThreshold,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar esta categoría de usuario?"
      )
    ) {
      await deleteUserCategory(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      formData.level < 0 ||
      formData.categoryDiscountAmount < 0 ||
      formData.pointsThreshold < 0
    )
      return;

    if (editingCategory) {
      await updateUserCategory(editingCategory.id, formData);
    } else {
      await createUserCategory(formData);
    }

    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      level: 0,
      categoryDiscountAmount: 0,
      pointsThreshold: 0,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      level: 0,
      categoryDiscountAmount: 0,
      pointsThreshold: 0,
    });
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? userCategories.filter((_, index) => selectedRows.has(index))
      : userCategories;

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "UserCategories");

    const fileName = selectedOnly
      ? `user_categories_selected_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      : `user_categories_all_${new Date().toISOString().split("T")[0]}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as {
          name?: string;
          level?: number;
          categoryDiscountAmount?: number;
          pointsThreshold?: number;
        }[];

        jsonData.forEach(async (category) => {
          if (
            category.name &&
            category.level !== undefined &&
            category.categoryDiscountAmount !== undefined &&
            category.pointsThreshold !== undefined
          ) {
            await createUserCategory({
              name: category.name,
              level: category.level,
              categoryDiscountAmount: category.categoryDiscountAmount,
              pointsThreshold: category.pointsThreshold,
            });
          }
        });

        alert(
          `Importadas ${jsonData.length} categorías de usuario exitosamente`
        );
      } catch (error) {
        console.error("Error importing file:", error);
        alert("Error al importar el archivo. Verifica el formato.");
      }
    };
    reader.readAsArrayBuffer(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <AppWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Cargando...</div>
        </div>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Categorías de Usuario
          </h1>
          <div className="flex space-x-4">
            <Button variant="success" onClick={() => setShowForm(true)}>
              Agregar Categoría
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Exportar:
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportToExcel(false)}
              >
                Todos los datos
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportToExcel(true)}
                disabled={selectedRows.size === 0}
              >
                Filas seleccionadas ({selectedRows.size})
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Importar:
              </span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={importFromExcel}
                ref={fileInputRef}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="secondary" size="sm">
                  Desde Excel
                </Button>
              </label>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingCategory
                  ? "Editar Categoría de Usuario"
                  : "Agregar Categoría de Usuario"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre de la Categoría
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Ej: Bronce, Plata, Oro"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="level"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nivel
                  </label>
                  <input
                    type="number"
                    id="level"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        level: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    placeholder="1, 2, 3..."
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="categoryDiscountAmount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    id="categoryDiscountAmount"
                    value={formData.categoryDiscountAmount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryDiscountAmount: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="5, 10, 15..."
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="pointsThreshold"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Umbral de Puntos
                  </label>
                  <input
                    type="number"
                    id="pointsThreshold"
                    value={formData.pointsThreshold}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pointsThreshold: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    placeholder="100, 500, 1000..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingCategory ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <Table
            data={userCategories}
            columns={columns}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            showCheckboxes={true}
          />
        </div>
      </div>
    </AppWrapper>
  );
}
