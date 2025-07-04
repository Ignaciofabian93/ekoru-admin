import { MaterialImpactEstimate } from "@/types/product";
import { URL } from "../config/app";

export default async function GetMaterialImpacts() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${URL}/materialImpacts`, options);
    const data: MaterialImpactEstimate[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener los impactos de material:", error);
  }
}

export async function GetMaterialImpactById(id: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${URL}/materialImpacts/${id}`, options);
    const data: MaterialImpactEstimate = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener el impacto de material:", error);
  }
}

export async function CreateMaterialImpact(
  materialImpact: MaterialImpactEstimate
) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(materialImpact),
  };
  try {
    const response = await fetch(`${URL}/materialImpacts`, options);
    const data: MaterialImpactEstimate = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar crear el impacto de material:", error);
  }
}

export async function UpdateMaterialImpact(
  id: number,
  materialImpact: MaterialImpactEstimate
) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(materialImpact),
  };
  try {
    const response = await fetch(`${URL}/materialImpacts/${id}`, options);
    const data: MaterialImpactEstimate = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error al intentar actualizar el impacto de material:",
      error
    );
  }
}

export async function DeleteMaterialImpact(id: number) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${URL}/materialImpacts/${id}`, options);
    if (response.ok) {
      return true;
    } else {
      console.error(
        "Error al intentar eliminar el impacto de material:",
        response.statusText
      );
      return false;
    }
  } catch (error) {
    console.error("Error al intentar eliminar el impacto de material:", error);
  }
}
