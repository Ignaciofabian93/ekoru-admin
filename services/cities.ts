import { City } from "@/types/location";
import { URL } from "../config/app";

export default async function GetCities() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/cities`, options);
    const data: City[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener las ciudades:", error);
  }
}

export async function GetCityById(id: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/cities/${id}`, options);
    const data: City = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener la ciudad:", error);
  }
}

export async function CreateCity(city: City) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(city),
  };
  try {
    const response = await fetch(`${URL}/cities`, options);
    const data: City = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar crear la ciudad:", error);
  }
}

export async function UpdateCity(id: number, city: City) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(city),
  };
  try {
    const response = await fetch(`${URL}/cities/${id}`, options);
    const data: City = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar actualizar la ciudad:", error);
  }
}

export async function DeleteCity(id: number) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/cities/${id}`, options);
    if (response.ok) {
      return true;
    } else {
      console.error("Error al intentar eliminar la ciudad:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error al intentar eliminar la ciudad:", error);
  }
}
