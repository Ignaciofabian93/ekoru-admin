import { County } from "@/types/location";
import { URL } from "../config/app";

export default async function GetCounties() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/counties`, options);
    const data: County[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener los condados:", error);
  }
}

export async function GetCountyById(id: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/counties/${id}`, options);
    const data: County = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener el condado:", error);
  }
}

export async function CreateCounty(county: County) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(county),
  };
  try {
    const response = await fetch(`${URL}/counties`, options);
    const data: County = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar crear el condado:", error);
  }
}

export async function UpdateCounty(id: number, county: County) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(county),
  };
  try {
    const response = await fetch(`${URL}/counties/${id}`, options);
    const data: County = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar actualizar el condado:", error);
  }
}

export async function DeleteCounty(id: number) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/counties/${id}`, options);
    if (response.ok) {
      return true;
    } else {
      console.error("Error al intentar eliminar el condado:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error al intentar eliminar el condado:", error);
  }
}
