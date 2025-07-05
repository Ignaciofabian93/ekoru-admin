"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import AppWrapper from "../wrapper";
import useProductCategories from "./_hooks/useProductCategories";
import Table from "@/components/table";
import Button from "@/components/button";
import { ProductCategory } from "@/types/product";
import { ProductSize, WeightUnit } from "@/types/enums";

interface ProductCategoryFormData {
  productCategoryName: string;
  departmentCategoryId: number;
  keywords: string;
  size: ProductSize;
  weightUnit: WeightUnit;
  averageWeight: number;
}

export default function ProductCategoriesPage() {
  const {
    productCategories,
    departmentCategories,
    loading,
    error,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
  } = useProductCategories();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState<ProductCategoryFormData>({
    productCategoryName: "",
    departmentCategoryId: 0,
    keywords: "",
    size: "M",
    weightUnit: "KG",
    averageWeight: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns = [
    {
      key: "id" as keyof ProductCategory,
      header: "ID",
    },
    {
      key: "productCategoryName" as keyof ProductCategory,
      header: "Nombre",
    },
    {
      key: "departmentCategoryId" as keyof ProductCategory,
      header: "Categoría de Departamento",
      render: (
        _: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        const deptCategory = departmentCategories.find(
          (dc) => dc.id === item.departmentCategoryId
        );
        return deptCategory?.departmentCategoryName || "N/A";
      },
    },
    {
      key: "size" as keyof ProductCategory,
      header: "Tamaño",
    },
    {
      key: "weightUnit" as keyof ProductCategory,
      header: "Unidad de Peso",
    },
    {
      key: "averageWeight" as keyof ProductCategory,
      header: "Peso Promedio",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => `${value} ${item.weightUnit}`,
    },
    {
      key: "keywords" as keyof ProductCategory,
      header: "Palabras Clave",
      render: (value: ProductCategory[keyof ProductCategory]) => {
        return value
          ? (value as string[]).join(", ")
          : "No hay palabras clave definidas";
      },
    },
    {
      key: "firstMaterialTypeId" as keyof ProductCategory,
      header: "Primer Material",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        return item.firstMaterialType
          ? item.firstMaterialType.materialType
          : "N/A";
      },
    },
    {
      key: "firstMaterialTypeQuantity" as keyof ProductCategory,
      header: "Cantidad (%)",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        return item.firstMaterialTypeQuantity
          ? `${item.firstMaterialTypeQuantity}%`
          : "N/A";
      },
    },
    {
      key: "secondMaterialTypeId" as keyof ProductCategory,
      header: "Segundo Material",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        return item.secondMaterialType
          ? item.secondMaterialType.materialType
          : "N/A";
      },
    },
    {
      key: "secondMaterialTypeQuantity" as keyof ProductCategory,
      header: "Cantidad (%)",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        return item.secondMaterialTypeQuantity
          ? `${item.secondMaterialTypeQuantity}%`
          : "N/A";
      },
    },
    {
      key: "thirdMaterialTypeId" as keyof ProductCategory,
      header: "Tercer Material",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        return item.thirdMaterialType
          ? item.thirdMaterialType.materialType
          : "N/A";
      },
    },
    {
      key: "thirdMaterialTypeQuantity" as keyof ProductCategory,
      header: "Cantidad (%)",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        return item.thirdMaterialTypeQuantity
          ? `${item.thirdMaterialTypeQuantity}%`
          : "N/A";
      },
    },
    {
      key: "fourthMaterialTypeId" as keyof ProductCategory,
      header: "Cuarto Material",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        return item.fourthMaterialType
          ? item.fourthMaterialType.materialType
          : "N/A";
      },
    },
    {
      key: "fourthMaterialTypeQuantity" as keyof ProductCategory,
      header: "Cantidad (%)",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        return item.fourthMaterialTypeQuantity
          ? `${item.fourthMaterialTypeQuantity}%`
          : "N/A";
      },
    },
    {
      key: "fifthMaterialTypeId" as keyof ProductCategory,
      header: "Quinto Material",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        return item.fifthMaterialType
          ? item.fifthMaterialType.materialType
          : "N/A";
      },
    },
    {
      key: "fifthMaterialTypeQuantity" as keyof ProductCategory,
      header: "Cantidad (%)",
      render: (
        value: ProductCategory[keyof ProductCategory],
        item: ProductCategory
      ) => {
        return item.fifthMaterialTypeQuantity
          ? `${item.fifthMaterialTypeQuantity}%`
          : "N/A";
      },
    },
    {
      key: "actions" as keyof ProductCategory,
      header: "Acciones",
      render: (_: unknown, item: ProductCategory) => (
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
    if (selectedRows.size === productCategories.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(productCategories.map((_, index) => index)));
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      productCategoryName: category.productCategoryName,
      departmentCategoryId: category.departmentCategoryId,
      keywords: category.keywords.join(", "),
      size: category.size,
      weightUnit: category.weightUnit,
      averageWeight: category.averageWeight,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar esta categoría de producto?"
      )
    ) {
      await deleteProductCategory(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.productCategoryName.trim() ||
      !formData.departmentCategoryId ||
      formData.averageWeight < 0
    )
      return;

    const categoryData = {
      ...formData,
      keywords: formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k),
    };

    if (editingCategory) {
      await updateProductCategory(editingCategory.id, categoryData);
    } else {
      await createProductCategory(categoryData);
    }

    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      productCategoryName: "",
      departmentCategoryId: 0,
      keywords: "",
      size: "M",
      weightUnit: "KG",
      averageWeight: 0,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      productCategoryName: "",
      departmentCategoryId: 0,
      keywords: "",
      size: "M",
      weightUnit: "KG",
      averageWeight: 0,
    });
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly
      ? productCategories.filter((_, index) => selectedRows.has(index))
      : productCategories;

    const exportData = dataToExport.map((category) => ({
      id: category.id,
      productCategoryName: category.productCategoryName,
      departmentCategoryId: category.departmentCategoryId,
      departmentCategoryName:
        departmentCategories.find(
          (dc) => dc.id === category.departmentCategoryId
        )?.departmentCategoryName || "N/A",
      keywords: category.keywords.join(", "),
      size: category.size,
      weightUnit: category.weightUnit,
      averageWeight: category.averageWeight,
      firstMaterialTypeId: category.firstMaterialTypeId,
      firstMaterialTypeQuantity: category.firstMaterialTypeQuantity,
      secondMaterialTypeId: category.secondMaterialTypeId,
      secondMaterialTypeQuantity: category.secondMaterialTypeQuantity,
      thirdMaterialTypeId: category.thirdMaterialTypeId,
      thirdMaterialTypeQuantity: category.thirdMaterialTypeQuantity,
      fourthMaterialTypeId: category.fourthMaterialTypeId,
      fourthMaterialTypeQuantity: category.fourthMaterialTypeQuantity,
      fifthMaterialTypeId: category.fifthMaterialTypeId,
      fifthMaterialTypeQuantity: category.fifthMaterialTypeQuantity,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProductCategories");

    const fileName = selectedOnly
      ? `product_categories_selected_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      : `product_categories_all_${new Date().toISOString().split("T")[0]}.xlsx`;

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
          productCategoryName?: string;
          departmentCategoryId?: number;
          keywords?: string;
          size?: ProductSize;
          weightUnit?: WeightUnit;
          averageWeight?: number;
        }[];

        jsonData.forEach(async (category) => {
          if (
            category.productCategoryName &&
            category.departmentCategoryId &&
            category.size &&
            category.weightUnit &&
            category.averageWeight !== undefined
          ) {
            await createProductCategory({
              productCategoryName: category.productCategoryName,
              departmentCategoryId: category.departmentCategoryId,
              keywords: category.keywords
                ? category.keywords.split(",").map((k) => k.trim())
                : [],
              size: category.size,
              weightUnit: category.weightUnit,
              averageWeight: category.averageWeight,
            });
          }
        });

        alert(
          `Importadas ${jsonData.length} categorías de producto exitosamente`
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
            Gestión de Categorías de Producto
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">
                {editingCategory
                  ? "Editar Categoría de Producto"
                  : "Agregar Categoría de Producto"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="productCategoryName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre de la Categoría
                  </label>
                  <input
                    type="text"
                    id="productCategoryName"
                    value={formData.productCategoryName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        productCategoryName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Ej: Smartphones, Laptops"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="departmentCategoryId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Categoría de Departamento
                  </label>
                  <select
                    id="departmentCategoryId"
                    value={formData.departmentCategoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        departmentCategoryId: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>
                      Seleccionar categoría de departamento
                    </option>
                    {departmentCategories.map((deptCat) => (
                      <option key={deptCat.id} value={deptCat.id}>
                        {deptCat.departmentCategoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="keywords"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Palabras Clave (separadas por comas)
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        keywords: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="móvil, teléfono, smartphone"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="size"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tamaño
                    </label>
                    <select
                      id="size"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          size: e.target.value as ProductSize,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="weightUnit"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Unidad de Peso
                    </label>
                    <select
                      id="weightUnit"
                      value={formData.weightUnit}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          weightUnit: e.target.value as WeightUnit,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="KG">KG</option>
                      <option value="G">G</option>
                      <option value="LB">LB</option>
                      <option value="OZ">OZ</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="averageWeight"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Peso Promedio
                  </label>
                  <input
                    type="number"
                    id="averageWeight"
                    value={formData.averageWeight}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        averageWeight: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.5, 1.2, 2.5..."
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
            data={productCategories}
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
