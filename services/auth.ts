import { URL } from "@/config/app";

export const Login = async (email: string, password: string) => {
  try {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    };
    const response = await fetch(`${URL}/auth`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const RefreshToken = async () => {
  const options: RequestInit = {
    method: "POST",
    credentials: "include",
  };
  const response = await fetch(`${URL}/refresh`, options);
  const data = await response.json();
  return data;
};

export const GetProfile = async () => {
  try {
    const options: RequestInit = {
      method: "GET",
      credentials: "include",
    };
    const response = await fetch(`${URL}/profile`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GetProfile error:", error);
    throw error;
  }
};
