"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSessionStore from "@/store/session";

export default function InitApp() {
  const router = useRouter();
  const { data } = useSessionStore();

  useEffect(() => {
    const nextPath = data?.id ? "/dashboard" : "/auth";

    const delay = 1000;
    const timeout = setTimeout(() => {
      router.replace(nextPath);
    }, delay);

    return () => clearTimeout(timeout);
  }, [data]);

  return null;
}
