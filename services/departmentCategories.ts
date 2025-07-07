import { DepartmentCategory } from "@/types/product";
import { URL } from "../config/app";

export default async function GetDepartmentCategories() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/departmentCategories`, options);
    const data: DepartmentCategory[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener las categorías de departamento:", error);
  }
}

export async function GetDepartmentCategoryById(id: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/departmentCategories/${id}`, options);
    const data: DepartmentCategory = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener la categoría de departamento:", error);
  }
}

export async function CreateDepartmentCategory(departmentCategory: DepartmentCategory) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(departmentCategory),
  };
  try {
    const response = await fetch(`${URL}/departmentCategories`, options);
    const data: DepartmentCategory = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar crear la categoría de departamento:", error);
  }
}

export async function UpdateDepartmentCategory(id: number, departmentCategory: DepartmentCategory) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(departmentCategory),
  };
  try {
    const response = await fetch(`${URL}/departmentCategories/${id}`, options);
    const data: DepartmentCategory = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar actualizar la categoría de departamento:", error);
  }
}

export async function DeleteDepartmentCategory(id: number) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/departmentCategories/${id}`, options);
    if (response.ok) {
      return true;
    } else {
      console.error("Error al intentar eliminar la categoría de departamento:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error al intentar eliminar la categoría de departamento:", error);
  }
}
