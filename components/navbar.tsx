import Link from "next/link";
import { LogOut } from "lucide-react";
import useSessionStore from "@/store/session";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { admin } = useSessionStore();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.push("/auth");
  };

  return (
    <header className="bg-gray-100 shadow-md w-full fixed top-0 z-50 p-4">
      <nav className="container mx-auto w-full flex justify-between items-center">
        <span>Hola {admin?.name}!</span>
        <ul className="flex space-x-4">
          <li className="w-[80px] cursor-pointer">
            <Link href="/" className="text-blue-500 hover:underline">
              Inicio
            </Link>
          </li>
          <li className="cursor-pointer" onClick={handleLogout}>
            <LogOut size={20} className="inline-block mr-2" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
