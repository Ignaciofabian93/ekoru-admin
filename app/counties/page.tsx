"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import AppWrapper from "../wrapper";
import useCounties from "./_hooks/useCounties";
import Table from "@/components/table";
import Button from "@/components/button";
import { County } from "@/types/location";

interface CountyFormData {
  county: string;
  cityId: number;
}

export default function CountiesPage() {
  const {
    counties,
    cities,
    loading,
    error,
    createCounty,
    updateCounty,
    deleteCounty,
  } = useCounties();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCounty, setEditingCounty] = useState<County | null>(null);
  const [formData, setFormData] = useState<CountyFormData>({
    county: "",
    cityId: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = [
    {
      key: "id" as keyof County,
      header: "ID",
    },
    {
      key: "county" as keyof County,
      header: "Condado",
    },
    {
      key: "cityId" as keyof County,
      header: "Ciudad",
      render: (_: County[keyof County], item: County) => {
        const city = cities.find((c) => c.id === item.cityId);
        return city?.city || "N/A";
      },
    },
    {
      key: "actions" as keyof County,
      header: "Acciones",
      render: (_: unknown, item: County) => (
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
    if (selectedRows.size === counties.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(counties.map((_, index) => index)));
    }
  };

  const handleEdit = (county: County) => {
    setEditingCounty(county);
    setFormData({ county: county.county, cityId: county.cityId });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este condado?")) {
      await deleteCounty(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.county.trim() || !formData.cityId) return;

    if (editingCounty) {
      await updateCounty(editingCounty.id, formData);
    } else {
      await createCounty(formData);
    }

    setShowForm(false);
    setEditingCounty(null);
    setFormData({ county: "", cityId: 0 });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCounty(null);
    setFormData({ county: "", cityId: 0 });
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? counties.filter((_, index) => selectedRows.has(index))
      : counties;

    const exportData = dataToExport.map((county) => ({
      id: county.id,
      county: county.county,
      cityId: county.cityId,
      cityName: cities.find((c) => c.id === county.cityId)?.city || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Counties");

    const fileName = selectedOnly
      ? `counties_selected_${new Date().toISOString().split("T")[0]}.xlsx`
      : `counties_all_${new Date().toISOString().split("T")[0]}.xlsx`;

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
          county?: string;
          cityId?: number;
        }[];

        jsonData.forEach(async (county) => {
          if (county.county && county.cityId) {
            await createCounty({
              county: county.county,
              cityId: county.cityId,
            });
          }
        });

        alert(`Importados ${jsonData.length} condados exitosamente`);
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
            Gestión de Condados
          </h1>
          <div className="flex space-x-4">
            <Button variant="success" onClick={() => setShowForm(true)}>
              Agregar Condado
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
                {editingCounty ? "Editar Condado" : "Agregar Condado"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="county"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre del Condado
                  </label>
                  <input
                    type="text"
                    id="county"
                    value={formData.county}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        county: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Ej: Las Condes, Providencia"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="cityId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ciudad
                  </label>
                  <select
                    id="cityId"
                    value={formData.cityId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cityId: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>Seleccionar ciudad</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.city}
                      </option>
                    ))}
                  </select>
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
                    {editingCounty ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <Table
            data={counties}
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
