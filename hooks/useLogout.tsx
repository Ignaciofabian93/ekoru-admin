import { useRouter } from "next/navigation";

export default function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.replace("/login");
  };

  return { handleLogout };
}
