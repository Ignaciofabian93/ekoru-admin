"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import AppWrapper from "../wrapper";
import useRegions from "./_hooks/useRegions";
import Table from "@/components/table";
import Button from "@/components/button";
import { Region } from "@/types/location";

interface RegionFormData {
  region: string;
  countryId: number;
}

export default function RegionsPage() {
  const {
    regions,
    countries,
    loading,
    error,
    createRegion,
    updateRegion,
    deleteRegion,
  } = useRegions();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [formData, setFormData] = useState<RegionFormData>({
    region: "",
    countryId: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = [
    {
      key: "id" as keyof Region,
      header: "ID",
    },
    {
      key: "region" as keyof Region,
      header: "Región",
    },
    {
      key: "countryId" as keyof Region,
      header: "País",
      render: (_: Region[keyof Region], item: Region) => {
        const country = countries.find((c) => c.id === item.countryId);
        return country?.country || "N/A";
      },
    },
    {
      key: "actions" as keyof Region,
      header: "Acciones",
      render: (_: unknown, item: Region) => (
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
    if (selectedRows.size === regions.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(regions.map((_, index) => index)));
    }
  };

  const handleEdit = (region: Region) => {
    setEditingRegion(region);
    setFormData({ region: region.region, countryId: region.countryId });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta región?")) {
      await deleteRegion(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.region.trim() || !formData.countryId) return;

    if (editingRegion) {
      await updateRegion(editingRegion.id, formData);
    } else {
      await createRegion(formData);
    }

    setShowForm(false);
    setEditingRegion(null);
    setFormData({ region: "", countryId: 0 });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRegion(null);
    setFormData({ region: "", countryId: 0 });
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? regions.filter((_, index) => selectedRows.has(index))
      : regions;

    const exportData = dataToExport.map((region) => ({
      id: region.id,
      region: region.region,
      countryId: region.countryId,
      countryName:
        countries.find((c) => c.id === region.countryId)?.country || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Regions");

    const fileName = selectedOnly
      ? `regions_selected_${new Date().toISOString().split("T")[0]}.xlsx`
      : `regions_all_${new Date().toISOString().split("T")[0]}.xlsx`;

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
          region?: string;
          countryId?: number;
        }[];

        jsonData.forEach(async (region) => {
          if (region.region && region.countryId) {
            await createRegion({
              region: region.region,
              countryId: region.countryId,
            });
          }
        });

        alert(`Importadas ${jsonData.length} regiones exitosamente`);
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
            Gestión de Regiones
          </h1>
          <div className="flex space-x-4">
            <Button variant="success" onClick={() => setShowForm(true)}>
              Agregar Región
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
                {editingRegion ? "Editar Región" : "Agregar Región"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre de la Región
                  </label>
                  <input
                    type="text"
                    id="region"
                    value={formData.region}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        region: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Ej: Metropolitana, Valparaíso"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="countryId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    País
                  </label>
                  <select
                    id="countryId"
                    value={formData.countryId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        countryId: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>Seleccionar país</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.country}
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
                    {editingRegion ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <Table
            data={regions}
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
