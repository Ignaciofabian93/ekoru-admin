import { Region } from "@/types/location";
import { URL } from "../config/app";

export default async function GetRegions() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${URL}/regions`, options);
    const data: Region[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener las regiones:", error);
  }
}

export async function GetRegionById(id: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${URL}/regions/${id}`, options);
    const data: Region = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener la región:", error);
  }
}

export async function CreateRegion(region: Region) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(region),
  };
  try {
    const response = await fetch(`${URL}/regions`, options);
    const data: Region = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar crear la región:", error);
  }
}

export async function UpdateRegion(id: number, region: Region) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(region),
  };
  try {
    const response = await fetch(`${URL}/regions/${id}`, options);
    const data: Region = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar actualizar la región:", error);
  }
}

export async function DeleteRegion(id: number) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(`${URL}/regions/${id}`, options);
    if (response.ok) {
      return true;
    } else {
      console.error(
        "Error al intentar eliminar la región:",
        response.statusText
      );
      return false;
    }
  } catch (error) {
    console.error("Error al intentar eliminar la región:", error);
  }
}
