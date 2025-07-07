import { ProductCategory } from "@/types/product";
import { URL } from "../config/app";

export default async function GetProductCategories() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/productCategories`, options);
    const data: ProductCategory[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener las categorías de producto:", error);
  }
}

export async function GetProductCategoryById(id: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/productCategories/${id}`, options);
    const data: ProductCategory = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener la categoría de producto:", error);
  }
}

export async function CreateProductCategory(productCategory: ProductCategory) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(productCategory),
  };
  try {
    const response = await fetch(`${URL}/productCategories`, options);
    const data: ProductCategory = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar crear la categoría de producto:", error);
  }
}

export async function UpdateProductCategory(id: number, productCategory: ProductCategory) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(productCategory),
  };
  try {
    const response = await fetch(`${URL}/productCategories/${id}`, options);
    const data: ProductCategory = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar actualizar la categoría de producto:", error);
  }
}

export async function DeleteProductCategory(id: number) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/productCategories/${id}`, options);
    if (response.ok) {
      return true;
    } else {
      console.error("Error al intentar eliminar la categoría de producto:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error al intentar eliminar la categoría de producto:", error);
  }
}
