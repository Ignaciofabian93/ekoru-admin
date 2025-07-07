import { Country } from "@/types/location";
import { URL } from "../config/app";

export default async function GetCountries() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/countries`, options);
    const data: Country[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener los países:", error);
  }
}

export async function GetCountryById(id: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/countries/${id}`, options);
    const data: Country = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener el país:", error);
  }
}

export async function CreateCountry(country: Country) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(country),
  };
  try {
    const response = await fetch(`${URL}/countries`, options);
    const data: Country = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar crear el país:", error);
  }
}

export async function UpdateCountry(id: number, country: Country) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(country),
  };
  try {
    const response = await fetch(`${URL}/countries/${id}`, options);
    const data: Country = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar actualizar el país:", error);
  }
}

export async function DeleteCountry(id: number) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  try {
    const response = await fetch(`${URL}/countries/${id}`, options);
    if (response.ok) {
      return true;
    } else {
      console.error("Error al intentar eliminar el país:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error al intentar eliminar el país:", error);
  }
}
