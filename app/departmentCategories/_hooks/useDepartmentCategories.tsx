"use client";
import { useEffect, useState } from "react";
import { DepartmentCategory } from "@/types/product";
import GetDepartmentCategories, {
  CreateDepartmentCategory,
  UpdateDepartmentCategory,
  DeleteDepartmentCategory,
} from "@/services/departmentCategories";
import { GetDepartments } from "@/services/departments";
import { Department } from "@/types/product";

export default function useDepartmentCategories() {
  const [departmentCategories, setDepartmentCategories] = useState<
    DepartmentCategory[]
  >([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesData, departmentsData] = await Promise.all([
        GetDepartmentCategories(),
        GetDepartments(),
      ]);

      if (categoriesData) {
        setDepartmentCategories(categoriesData);
      }
      if (departmentsData) {
        setDepartments(departmentsData);
      }
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const createDepartmentCategory = async (categoryData: {
    departmentCategoryName: string;
    departmentId: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const department = departments.find(
        (d) => d.id === categoryData.departmentId
      );
      if (!department) {
        throw new Error("Department not found");
      }

      const category: DepartmentCategory = {
        id: 0, // This will be set by the server
        __typename: "DepartmentCategory",
        departmentCategoryName: categoryData.departmentCategoryName,
        departmentId: categoryData.departmentId,
        department: department,
        productCategories: [],
      };

      const newCategory = await CreateDepartmentCategory(category);
      if (newCategory) {
        setDepartmentCategories((prev) => [...prev, newCategory]);
        return newCategory;
      }
    } catch (err) {
      setError("Error creating department category");
      console.error("Error creating department category:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateDepartmentCategory = async (
    id: number,
    categoryData: Partial<DepartmentCategory>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategory = await UpdateDepartmentCategory(
        id,
        categoryData as DepartmentCategory
      );
      if (updatedCategory) {
        setDepartmentCategories((prev) =>
          prev.map((cat) => (cat.id === id ? updatedCategory : cat))
        );
        return updatedCategory;
      }
    } catch (err) {
      setError("Error updating department category");
      console.error("Error updating department category:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartmentCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await DeleteDepartmentCategory(id);
      if (success) {
        setDepartmentCategories((prev) => prev.filter((cat) => cat.id !== id));
        return true;
      }
    } catch (err) {
      setError("Error deleting department category");
      console.error("Error deleting department category:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    departmentCategories,
    departments,
    loading,
    error,
    fetchData,
    createDepartmentCategory,
    updateDepartmentCategory,
    deleteDepartmentCategory,
  };
}
