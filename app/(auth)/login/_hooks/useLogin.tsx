import { useState } from "react";
import { useRouter } from "next/navigation";
import { Login } from "@/app/api/auth/auth";
import { useLazyQuery } from "@apollo/client";
import { GET_MY_DATA } from "@/graphql/session/queries";
import { sanitizeEmailInput } from "@/security/sanitizeInputs";
import useSessionStore from "@/store/session";
import useAlert from "@/hooks/useAlert";

export default function useLogin() {
  const router = useRouter();
  const { notify, notifyError } = useAlert();
  const { handleSession } = useSessionStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [getMyData, { loading: userLoading }] = useLazyQuery(GET_MY_DATA);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    // Apply appropriate sanitization based on input type
    if (name === "email") {
      sanitizedValue = sanitizeEmailInput(value);
    }
    // Don't sanitize password as it might need special characters

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      notifyError("Todos los campos son obligatorios.");
      return;
    }

    // Final sanitization before submission
    const sanitizedEmail = sanitizeEmailInput(email);

    setIsLoading(true);
    const response = await Login({ email: sanitizedEmail, password }); // Don't sanitize password
    console.log("RES:: ", response);

    if (response && response.token) {
      const { data: userData } = await getMyData();
      console.log("USER DATA:: ", userData);

      if (!userLoading && userData.getMyData?.id) {
        handleSession(userData.getMyData);
        notify("Inicio de sesión exitoso.");
        router.replace("/home");
        setIsLoading(false);
        return;
      } else {
        notifyError("Error al obtener los datos del usuario.");
        setIsLoading(false);
        return;
      }
    } else {
      notifyError("Error al iniciar sesión. Verifica tus credenciales.");
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    showPassword,
    handleFormData,
    handleSubmit,
    togglePasswordVisibility,
  };
}
