"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSessionStore, { Admin } from "@/store/session";
import { Login } from "@/services/auth";

export default function useAuth() {
  const [data, setData] = useState<Admin & { password: string }>({
    id: "",
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAdmin } = useSessionStore();
  const router = useRouter();

  const handleData = (newData: Partial<Admin & { password: string }>) => {
    setData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await Login(data.email, data.password);
      if (res.id && res.token) {
        setAdmin({ id: res.id, email: res.email, name: res.name });
        router.replace("/");
      } else {
        setError(res?.message || "Credenciales incorrectas");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return { data, handleData, handleSubmit, loading, error };
}
