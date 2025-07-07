import { UserCategory } from "@/types/user";
import { URL } from "../config/app";

export default async function GetUserCategories() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/userCategories`, options);
    const data: UserCategory[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener las categorías de usuario:", error);
  }
}

export async function GetUserCategoryById(id: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/userCategories/${id}`, options);
    const data: UserCategory = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener la categoría de usuario:", error);
  }
}

export async function CreateUserCategory(userCategory: UserCategory) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userCategory),
  };
  try {
    const response = await fetch(`${URL}/userCategories`, options);
    const data: UserCategory = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar crear la categoría de usuario:", error);
  }
}

export async function UpdateUserCategory(id: number, userCategory: UserCategory) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userCategory),
  };
  try {
    const response = await fetch(`${URL}/userCategories/${id}`, options);
    const data: UserCategory = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar actualizar la categoría de usuario:", error);
  }
}

export async function DeleteUserCategory(id: number) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/userCategories/${id}`, options);
    if (response.ok) {
      return true;
    } else {
      console.error("Error al intentar eliminar la categoría de usuario:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error al intentar eliminar la categoría de usuario:", error);
  }
}
