"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import AppWrapper from "../wrapper";
import useCountries from "./_hooks/useCountries";
import Table from "@/components/table";
import Button from "@/components/button";
import { Country } from "@/types/location";

interface CountryFormData {
  country: string;
}

export default function CountriesPage() {
  const {
    countries,
    loading,
    error,
    createCountry,
    updateCountry,
    deleteCountry,
  } = useCountries();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [formData, setFormData] = useState<CountryFormData>({ country: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = [
    {
      key: "id" as keyof Country,
      header: "ID",
    },
    {
      key: "country" as keyof Country,
      header: "País",
    },
    {
      key: "actions" as keyof Country,
      header: "Acciones",
      render: (_: unknown, item: Country) => (
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
    if (selectedRows.size === countries.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(countries.map((_, index) => index)));
    }
  };

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setFormData({ country: country.country });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este país?")) {
      await deleteCountry(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.country.trim()) return;

    if (editingCountry) {
      await updateCountry(editingCountry.id, formData);
    } else {
      await createCountry(formData);
    }

    setShowForm(false);
    setEditingCountry(null);
    setFormData({ country: "" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCountry(null);
    setFormData({ country: "" });
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? countries.filter((_, index) => selectedRows.has(index))
      : countries;

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Countries");

    const fileName = selectedOnly
      ? `countries_selected_${new Date().toISOString().split("T")[0]}.xlsx`
      : `countries_all_${new Date().toISOString().split("T")[0]}.xlsx`;

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
          country?: string;
        }[];

        // Process imported data
        jsonData.forEach(async (country) => {
          if (country.country) {
            await createCountry({ country: country.country });
          }
        });

        alert(`Importados ${jsonData.length} países exitosamente`);
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
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Países
          </h1>
          <div className="flex space-x-4">
            <Button variant="success" onClick={() => setShowForm(true)}>
              Agregar País
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Import/Export Controls */}
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

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingCountry ? "Editar País" : "Agregar País"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre del País
                  </label>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Ej: Chile, Argentina, Brasil"
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
                    {editingCountry ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Countries Table */}
        <div className="bg-white rounded-lg shadow">
          <Table
            data={countries}
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
