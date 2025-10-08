"use client";
import useSessionStore from "@/store/session";
import { redirect } from "next/navigation";

export default function InitApp() {
  const { data } = useSessionStore();

  if (!data.id) {
    redirect("/login");
  }

  redirect("/home");
}
