"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import AppWrapper from "../wrapper";
import useMaterialImpactEstimate from "./_hooks/useMaterialImpactEstimate";
import Table from "@/components/table";
import Button from "@/components/button";
import { MaterialImpactEstimate } from "@/types/product";

interface MaterialImpactFormData {
  materialType: string;
  estimatedCo2SavingsKG: number;
  estimatedWaterSavingsLT: number;
}

export default function MaterialImpactEstimatePage() {
  const {
    materialImpacts,
    loading,
    error,
    createMaterialImpact,
    updateMaterialImpact,
    deleteMaterialImpact,
  } = useMaterialImpactEstimate();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingImpact, setEditingImpact] =
    useState<MaterialImpactEstimate | null>(null);
  const [formData, setFormData] = useState<MaterialImpactFormData>({
    materialType: "",
    estimatedCo2SavingsKG: 0,
    estimatedWaterSavingsLT: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = [
    {
      key: "id" as keyof MaterialImpactEstimate,
      header: "ID",
    },
    {
      key: "materialType" as keyof MaterialImpactEstimate,
      header: "Tipo de Material",
    },
    {
      key: "estimatedCo2SavingsKG" as keyof MaterialImpactEstimate,
      header: "Ahorro CO₂ (KG)",
      render: (value: MaterialImpactEstimate[keyof MaterialImpactEstimate]) =>
        `${value} kg`,
    },
    {
      key: "estimatedWaterSavingsLT" as keyof MaterialImpactEstimate,
      header: "Ahorro Agua (LT)",
      render: (value: MaterialImpactEstimate[keyof MaterialImpactEstimate]) =>
        `${value} lt`,
    },
    {
      key: "actions" as keyof MaterialImpactEstimate,
      header: "Acciones",
      render: (_: unknown, item: MaterialImpactEstimate) => (
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
    if (selectedRows.size === materialImpacts.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(materialImpacts.map((_, index) => index)));
    }
  };

  const handleEdit = (impact: MaterialImpactEstimate) => {
    setEditingImpact(impact);
    setFormData({
      materialType: impact.materialType,
      estimatedCo2SavingsKG: impact.estimatedCo2SavingsKG,
      estimatedWaterSavingsLT: impact.estimatedWaterSavingsLT,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este impacto de material?"
      )
    ) {
      await deleteMaterialImpact(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.materialType.trim() ||
      formData.estimatedCo2SavingsKG < 0 ||
      formData.estimatedWaterSavingsLT < 0
    )
      return;

    if (editingImpact) {
      await updateMaterialImpact(editingImpact.id, formData);
    } else {
      await createMaterialImpact(formData);
    }

    setShowForm(false);
    setEditingImpact(null);
    setFormData({
      materialType: "",
      estimatedCo2SavingsKG: 0,
      estimatedWaterSavingsLT: 0,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingImpact(null);
    setFormData({
      materialType: "",
      estimatedCo2SavingsKG: 0,
      estimatedWaterSavingsLT: 0,
    });
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? materialImpacts.filter((_, index) => selectedRows.has(index))
      : materialImpacts;

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MaterialImpacts");

    const fileName = selectedOnly
      ? `material_impacts_selected_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      : `material_impacts_all_${new Date().toISOString().split("T")[0]}.xlsx`;

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
          materialType?: string;
          estimatedCo2SavingsKG?: number;
          estimatedWaterSavingsLT?: number;
        }[];

        jsonData.forEach(async (impact) => {
          if (
            impact.materialType &&
            impact.estimatedCo2SavingsKG !== undefined &&
            impact.estimatedWaterSavingsLT !== undefined
          ) {
            await createMaterialImpact({
              materialType: impact.materialType,
              estimatedCo2SavingsKG: impact.estimatedCo2SavingsKG,
              estimatedWaterSavingsLT: impact.estimatedWaterSavingsLT,
            });
          }
        });

        alert(
          `Importados ${jsonData.length} impactos de material exitosamente`
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
            Gestión de Impactos de Material
          </h1>
          <div className="flex space-x-4">
            <Button variant="success" onClick={() => setShowForm(true)}>
              Agregar Impacto
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
                {editingImpact
                  ? "Editar Impacto de Material"
                  : "Agregar Impacto de Material"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="materialType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tipo de Material
                  </label>
                  <input
                    type="text"
                    id="materialType"
                    value={formData.materialType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        materialType: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Ej: Plástico, Papel, Metal"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="estimatedCo2SavingsKG"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ahorro Estimado de CO₂ (KG)
                  </label>
                  <input
                    type="number"
                    id="estimatedCo2SavingsKG"
                    value={formData.estimatedCo2SavingsKG}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        estimatedCo2SavingsKG: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.5, 1.2, 2.8..."
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="estimatedWaterSavingsLT"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ahorro Estimado de Agua (LT)
                  </label>
                  <input
                    type="number"
                    id="estimatedWaterSavingsLT"
                    value={formData.estimatedWaterSavingsLT}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        estimatedWaterSavingsLT: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                    placeholder="10, 25.5, 50..."
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
                    {editingImpact ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <Table
            data={materialImpacts}
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
