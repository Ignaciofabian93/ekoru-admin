"use client";
import { useEffect, useState } from "react";
import { UserCategory } from "@/types/user";
import GetUserCategories, {
  CreateUserCategory,
  UpdateUserCategory,
  DeleteUserCategory,
} from "@/services/userCategories";

export default function useUserCategories() {
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserCategories();
  }, []);

  const fetchUserCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetUserCategories();
      if (data) {
        setUserCategories(data);
      }
    } catch (err) {
      setError("Error fetching user categories");
      console.error("Error fetching user categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const createUserCategory = async (categoryData: {
    name: string;
    level: number;
    categoryDiscountAmount: number;
    pointsThreshold: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const category: UserCategory = {
        id: 0,
        name: categoryData.name,
        level: categoryData.level,
        categoryDiscountAmount: categoryData.categoryDiscountAmount,
        pointsThreshold: categoryData.pointsThreshold,
      };

      const newCategory = await CreateUserCategory(category);
      if (newCategory) {
        setUserCategories((prev) => [...prev, newCategory]);
        return newCategory;
      }
    } catch (err) {
      setError("Error creating user category");
      console.error("Error creating user category:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserCategory = async (
    id: number,
    categoryData: Partial<UserCategory>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategory = await UpdateUserCategory(
        id,
        categoryData as UserCategory
      );
      if (updatedCategory) {
        setUserCategories((prev) =>
          prev.map((cat) => (cat.id === id ? updatedCategory : cat))
        );
        return updatedCategory;
      }
    } catch (err) {
      setError("Error updating user category");
      console.error("Error updating user category:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUserCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await DeleteUserCategory(id);
      if (success) {
        setUserCategories((prev) => prev.filter((cat) => cat.id !== id));
        return true;
      }
    } catch (err) {
      setError("Error deleting user category");
      console.error("Error deleting user category:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    userCategories,
    loading,
    error,
    fetchUserCategories,
    createUserCategory,
    updateUserCategory,
    deleteUserCategory,
  };
}
