import { Department } from "@/types/product";
import { URL } from "../config/app";

export async function GetDepartments() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${URL}/departments`, options);
    const data: Department[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener los departamentos:", error);
  }
}

export async function GetDepartmentById(id: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${URL}/departments/${id}`, options);
    const data: Department = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener el departamento:", error);
  }
}
export async function CreateDepartment(department: Department) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(department),
  };
  try {
    const response = await fetch(`${URL}/departments`, options);
    const data: Department = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar crear el departamento:", error);
  }
}

export async function UpdateDepartment(id: number, department: Department) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(department),
  };
  try {
    const response = await fetch(`${URL}/departments/${id}`, options);
    const data: Department = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar actualizar el departamento:", error);
  }
}

export async function DeleteDepartment(id: number) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${URL}/departments/${id}`, options);
    if (response.ok) {
      return true;
    } else {
      console.error(
        "Error al intentar eliminar el departamento:",
        response.statusText
      );
      return false;
    }
  } catch (error) {
    console.error("Error al intentar eliminar el departamento:", error);
  }
}
