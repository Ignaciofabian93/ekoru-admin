"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import AppWrapper from "../wrapper";
import useCities from "./_hooks/useCities";
import Table from "@/components/table";
import Button from "@/components/button";
import { City } from "@/types/location";

interface CityFormData {
  city: string;
  regionId: number;
}

export default function CitiesPage() {
  const {
    cities,
    regions,
    loading,
    error,
    createCity,
    updateCity,
    deleteCity,
  } = useCities();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState<CityFormData>({
    city: "",
    regionId: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = [
    {
      key: "id" as keyof City,
      header: "ID",
    },
    {
      key: "city" as keyof City,
      header: "Ciudad",
    },
    {
      key: "regionId" as keyof City,
      header: "Región",
      render: (_: City[keyof City], item: City) => {
        const region = regions.find((r) => r.id === item.regionId);
        return region?.region || "N/A";
      },
    },
    {
      key: "actions" as keyof City,
      header: "Acciones",
      render: (_: unknown, item: City) => (
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
    if (selectedRows.size === cities.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(cities.map((_, index) => index)));
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({ city: city.city, regionId: city.regionId });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta ciudad?")) {
      await deleteCity(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city.trim() || !formData.regionId) return;

    if (editingCity) {
      await updateCity(editingCity.id, formData);
    } else {
      await createCity(formData);
    }

    setShowForm(false);
    setEditingCity(null);
    setFormData({ city: "", regionId: 0 });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCity(null);
    setFormData({ city: "", regionId: 0 });
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? cities.filter((_, index) => selectedRows.has(index))
      : cities;

    const exportData = dataToExport.map((city) => ({
      id: city.id,
      city: city.city,
      regionId: city.regionId,
      regionName: regions.find((r) => r.id === city.regionId)?.region || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cities");

    const fileName = selectedOnly
      ? `cities_selected_${new Date().toISOString().split("T")[0]}.xlsx`
      : `cities_all_${new Date().toISOString().split("T")[0]}.xlsx`;

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
          city?: string;
          regionId?: number;
        }[];

        jsonData.forEach(async (city) => {
          if (city.city && city.regionId) {
            await createCity({ city: city.city, regionId: city.regionId });
          }
        });

        alert(`Importadas ${jsonData.length} ciudades exitosamente`);
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
            Gestión de Ciudades
          </h1>
          <div className="flex space-x-4">
            <Button variant="success" onClick={() => setShowForm(true)}>
              Agregar Ciudad
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
                {editingCity ? "Editar Ciudad" : "Agregar Ciudad"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre de la Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Ej: Santiago, Valparaíso"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="regionId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Región
                  </label>
                  <select
                    id="regionId"
                    value={formData.regionId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        regionId: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>Seleccionar región</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.region}
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
                    {editingCity ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <Table
            data={cities}
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
