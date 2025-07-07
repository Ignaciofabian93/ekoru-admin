"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import AppWrapper from "../wrapper";
import useDepartmentCategories from "./_hooks/useDepartmentCategories";
import Table from "@/components/table";
import Button from "@/components/button";
import { DepartmentCategory } from "@/types/product";

interface DepartmentCategoryFormData {
  departmentCategoryName: string;
  departmentId: number;
}

export default function DepartmentCategoriesPage() {
  const {
    departmentCategories,
    departments,
    loading,
    error,
    createDepartmentCategory,
    updateDepartmentCategory,
    deleteDepartmentCategory,
  } = useDepartmentCategories();

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DepartmentCategory | null>(null);
  const [formData, setFormData] = useState<DepartmentCategoryFormData>({
    departmentCategoryName: "",
    departmentId: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = [
    {
      key: "id" as keyof DepartmentCategory,
      header: "ID",
    },
    {
      key: "departmentCategoryName" as keyof DepartmentCategory,
      header: "Nombre de la Categoría",
    },
    {
      key: "department" as keyof DepartmentCategory,
      header: "Departamento",
      render: (_: DepartmentCategory[keyof DepartmentCategory], item: DepartmentCategory) =>
        item.department?.departmentName || "N/A",
    },
    {
      key: "actions" as keyof DepartmentCategory,
      header: "Acciones",
      render: (_: unknown, item: DepartmentCategory) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
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
    if (selectedRows.size === departmentCategories.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(departmentCategories.map((_, index) => index)));
    }
  };

  const handleEdit = (category: DepartmentCategory) => {
    setEditingCategory(category);
    setFormData({
      departmentCategoryName: category.departmentCategoryName,
      departmentId: category.departmentId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría de departamento?")) {
      await deleteDepartmentCategory(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentCategoryName.trim() || !formData.departmentId) return;

    if (editingCategory) {
      await updateDepartmentCategory(editingCategory.id, formData);
    } else {
      await createDepartmentCategory(formData);
    }

    setShowForm(false);
    setEditingCategory(null);
    setFormData({ departmentCategoryName: "", departmentId: 0 });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ departmentCategoryName: "", departmentId: 0 });
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? departmentCategories.filter((_, index) => selectedRows.has(index))
      : departmentCategories;

    // Transform data for export
    const exportData = dataToExport.map((category) => ({
      id: category.id,
      departmentCategoryName: category.departmentCategoryName,
      departmentId: category.departmentId,
      departmentName: category.department?.departmentName || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DepartmentCategories");

    const fileName = selectedOnly
      ? `department_categories_selected_${new Date().toISOString().split("T")[0]}.xlsx`
      : `department_categories_all_${new Date().toISOString().split("T")[0]}.xlsx`;

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
          departmentCategoryName?: string;
          departmentId?: number;
        }[];

        // Process imported data
        jsonData.forEach(async (category) => {
          if (category.departmentCategoryName && category.departmentId) {
            await createDepartmentCategory({
              departmentCategoryName: category.departmentCategoryName,
              departmentId: category.departmentId,
            });
          }
        });

        alert(`Importadas ${jsonData.length} categorías de departamento exitosamente`);
      } catch (error) {
        console.error("Error importing file:", error);
        alert("Error al importar el archivo. Verifica el formato.");
      }
    };
    reader.readAsArrayBuffer(file);

    // Reset file input
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías de Departamento</h1>
          <div className="flex space-x-4">
            <Button variant="success" onClick={() => setShowForm(true)}>
              Agregar Categoría
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}

        {/* Import/Export Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Exportar:</span>
              <Button variant="secondary" size="sm" onClick={() => exportToExcel(false)}>
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
              <span className="text-sm font-medium text-gray-700">Importar:</span>
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

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingCategory ? "Editar Categoría de Departamento" : "Agregar Categoría de Departamento"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="departmentCategoryName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre de la Categoría
                  </label>
                  <input
                    type="text"
                    id="departmentCategoryName"
                    value={formData.departmentCategoryName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        departmentCategoryName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <select
                    id="departmentId"
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        departmentId: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>Seleccionar departamento</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="secondary" onClick={handleCancel}>
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

        {/* Department Categories Table */}
        <div className="bg-white rounded-lg shadow">
          <Table
            data={departmentCategories}
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
