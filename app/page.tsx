"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSessionStore from "@/store/session";

export default function InitApp() {
  const router = useRouter();
  const { admin } = useSessionStore();

  useEffect(() => {
    const nextPath = admin?.id ? "/home" : "/auth";

    const delay = 1000;
    const timeout = setTimeout(() => {
      router.replace(nextPath);
    }, delay);

    return () => clearTimeout(timeout);
  }, [admin?.id, router]);

  return null;
}
