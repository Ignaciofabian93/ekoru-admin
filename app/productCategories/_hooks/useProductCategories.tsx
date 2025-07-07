"use client";
import { useEffect, useState } from "react";
import { ProductCategory, DepartmentCategory } from "@/types/product";
import { ProductSize, WeightUnit } from "@/types/enums";
import GetProductCategories, {
  CreateProductCategory,
  UpdateProductCategory,
  DeleteProductCategory,
} from "@/services/productCategories";
import GetDepartmentCategories from "@/services/departmentCategories";

export default function useProductCategories() {
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [departmentCategories, setDepartmentCategories] = useState<DepartmentCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productCategoriesData, departmentCategoriesData] = await Promise.all([
        GetProductCategories(),
        GetDepartmentCategories(),
      ]);

      if (productCategoriesData) {
        setProductCategories(productCategoriesData);
      }
      if (departmentCategoriesData) {
        setDepartmentCategories(departmentCategoriesData);
      }
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProductCategory = async (categoryData: {
    productCategoryName: string;
    departmentCategoryId: number;
    keywords: string[];
    size: ProductSize;
    weightUnit: WeightUnit;
    averageWeight: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const category: ProductCategory = {
        id: 0,
        __typename: "ProductCategory",
        productCategoryName: categoryData.productCategoryName,
        departmentCategoryId: categoryData.departmentCategoryId,
        keywords: categoryData.keywords,
        size: categoryData.size,
        weightUnit: categoryData.weightUnit,
        averageWeight: categoryData.averageWeight,
        firstMaterialType: null,
        secondMaterialType: null,
        thirdMaterialType: null,
        fourthMaterialType: null,
        fifthMaterialType: null,
        firstMaterialTypeId: null,
        firstMaterialTypeQuantity: null,
        secondMaterialTypeId: null,
        secondMaterialTypeQuantity: null,
        thirdMaterialTypeId: null,
        thirdMaterialTypeQuantity: null,
        fourthMaterialTypeId: null,
        fourthMaterialTypeQuantity: null,
        fifthMaterialTypeId: null,
        fifthMaterialTypeQuantity: null,
        products: [],
      };

      const newCategory = await CreateProductCategory(category);
      if (newCategory) {
        setProductCategories((prev) => [...prev, newCategory]);
        return newCategory;
      }
    } catch (err) {
      setError("Error creating product category");
      console.error("Error creating product category:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProductCategory = async (id: number, categoryData: Partial<ProductCategory>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategory = await UpdateProductCategory(id, categoryData as ProductCategory);
      if (updatedCategory) {
        setProductCategories((prev) => prev.map((cat) => (cat.id === id ? updatedCategory : cat)));
        return updatedCategory;
      }
    } catch (err) {
      setError("Error updating product category");
      console.error("Error updating product category:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProductCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await DeleteProductCategory(id);
      if (success) {
        setProductCategories((prev) => prev.filter((cat) => cat.id !== id));
        return true;
      }
    } catch (err) {
      setError("Error deleting product category");
      console.error("Error deleting product category:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    productCategories,
    departmentCategories,
    loading,
    error,
    fetchData,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
  };
}
