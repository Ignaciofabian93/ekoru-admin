import { REST_URL } from "@/config/endpoint";

export default async function Login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  };

  try {
    const response = await fetch(`${REST_URL}/auth`, options);

    // Check if the response is ok
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use the status text
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle different types of errors
    if (error instanceof Error) {
      // Check for CORS or network errors
      if (
        error.message.includes("Failed to fetch") ||
        error.name === "TypeError"
      ) {
        throw new Error(
          "Unable to connect to the server. Please check if the backend is running on http://localhost:5000 and has CORS properly configured."
        );
      }
      // Re-throw other errors as-is
      throw error;
    }
    throw new Error("An unexpected error occurred during login");
  }
}

// Refresh token handler
export async function RefreshToken() {
  const options: RequestInit = {
    method: "POST",
    credentials: "include",
  };

  try {
    const response = await fetch(`${REST_URL}/refresh`, options);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use the status text
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("Failed to fetch") ||
        error.name === "TypeError"
      ) {
        throw new Error("Unable to connect to the server for token refresh.");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred during token refresh");
  }
}
