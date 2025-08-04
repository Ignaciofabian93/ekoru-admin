import { useState } from "react";
import { useRouter } from "next/navigation";
import useAlert from "./useAlert";
import Login from "@/services/auth";
import useSessionStore from "@/store/session";
import { useLazyQuery } from "@apollo/client";
import { GET_PROFILE } from "@/graphql/session/profile";

export default function useAuth() {
  const { notifyError, notify } = useAlert();
  const { handleSession } = useSessionStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [Session] = useLazyQuery(GET_PROFILE);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const login = async () => {
    const { email, password } = formData;
    if (!email || !password) {
      notifyError("Email and password are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notifyError("Please enter a valid email address");
      return;
    }

    try {
      const loginData = await Login({ email, password });
      console.log("Login data: ", loginData);

      if (loginData) {
        // Execute the session query after successful login
        const { data: userData, error } = await Session();

        if (error) {
          console.error("Session error:", error);
          notifyError("Failed to retrieve user session");
          return;
        }

        console.log("User session data: ", userData);

        if (userData) {
          // Handle the session data (store it, redirect, etc.)
          handleSession(userData); // Assuming this stores the session
          notify("Login successful!");
          router.push("/dashboard"); // or wherever you want to redirect
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      notifyError("An error occurred during login");
    }
  };

  return { login, formData, handleFormData };
}
