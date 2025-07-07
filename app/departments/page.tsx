"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import AppWrapper from "../wrapper";
import useDepartments from "./_hooks/useDepartments";
import Table from "@/components/table";
import Button from "@/components/button";
import Modal from "@/components/modal";
import { Department } from "@/types/product";

interface DepartmentFormData {
  departmentName: string;
}

export default function DepartmentsPage() {
  const { departments, loading, error, createDepartment, updateDepartment, deleteDepartment } =
    useDepartments();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>({
    departmentName: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = [
    {
      key: "id" as keyof Department,
      header: "ID",
    },
    {
      key: "departmentName" as keyof Department,
      header: "Nombre del Departamento",
    },
    {
      key: "actions" as keyof Department,
      header: "Acciones",
      render: (_: unknown, item: Department) => (
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
    if (selectedRows.size === departments.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(departments.map((_, index) => index)));
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({ departmentName: department.departmentName });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este departamento?")) {
      await deleteDepartment(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentName.trim()) return;

    if (editingDepartment) {
      await updateDepartment(editingDepartment.id, formData);
    } else {
      await createDepartment(formData);
    }

    setShowForm(false);
    setEditingDepartment(null);
    setFormData({ departmentName: "" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDepartment(null);
    setFormData({ departmentName: "" });
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? departments.filter((_, index) => selectedRows.has(index))
      : departments;

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    // Set column widths to match header length
    ws["!cols"] = columns.map((col) => ({
      wch: col.header.length + 2, // +2 for padding
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Departments");

    const fileName = selectedOnly
      ? `departments_selected_${new Date().toISOString().split("T")[0]}.xlsx`
      : `departments_all_${new Date().toISOString().split("T")[0]}.xlsx`;

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
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Department[];

        // Process imported data
        jsonData.forEach(async (department) => {
          if (department.departmentName) {
            await createDepartment({
              departmentName: department.departmentName,
            });
          }
        });

        alert(`Importados ${jsonData.length} departamentos exitosamente`);
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Departamentos</h1>
          <div className="flex space-x-4">
            <Button variant="success" onClick={() => setShowForm(true)}>
              Agregar Departamento
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
        <Modal
          open={showForm}
          onClose={handleCancel}
          title={editingDepartment ? "Editar Departamento" : "Agregar Departamento"}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Departamento
              </label>
              <input
                type="text"
                id="departmentName"
                value={formData.departmentName}
                onChange={(e) => setFormData({ departmentName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {editingDepartment ? "Actualizar" : "Agregar"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Departments Table */}
        <div className="bg-white rounded-lg shadow">
          <Table
            data={departments}
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
