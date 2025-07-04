"use client";
import { useEffect, useState } from "react";
import { Department } from "@/types/product";
import {
  GetDepartments,
  CreateDepartment,
  UpdateDepartment,
  DeleteDepartment,
} from "@/services/departments";

export default function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetDepartments();
      if (data) {
        setDepartments(data);
      }
    } catch (err) {
      setError("Error fetching departments");
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (departmentData: {
    departmentName: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const department: Department = {
        id: 0, // This will be set by the server
        __typename: "Department",
        departmentName: departmentData.departmentName,
        departmentCategories: [],
      };
      const newDepartment = await CreateDepartment(department);
      if (newDepartment) {
        setDepartments((prev) => [...prev, newDepartment]);
        return newDepartment;
      }
    } catch (err) {
      setError("Error creating department");
      console.error("Error creating department:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (
    id: number,
    department: Partial<Department>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDepartment = await UpdateDepartment(
        id,
        department as Department
      );
      if (updatedDepartment) {
        setDepartments((prev) =>
          prev.map((dep) => (dep.id === id ? updatedDepartment : dep))
        );
        return updatedDepartment;
      }
    } catch (err) {
      setError("Error updating department");
      console.error("Error updating department:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await DeleteDepartment(id);
      if (success) {
        setDepartments((prev) => prev.filter((dep) => dep.id !== id));
        return true;
      }
    } catch (err) {
      setError("Error deleting department");
      console.error("Error deleting department:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
}
