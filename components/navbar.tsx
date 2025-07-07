import Link from "next/link";
import { LogOut, Home } from "lucide-react";
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
    <header className="bg-white/80 backdrop-blur-md shadow-lg w-full fixed top-0 z-50 px-0 py-3 border-b border-gray-200">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-primary">Administración</span>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="text-gray-700 font-medium hidden sm:inline">
            Hola, <span className="text-primary font-bold">{admin?.name}</span>!
          </span>
        </div>
        <ul className="flex items-center gap-2 sm:gap-4">
          <li>
            <Link
              href="/"
              className="text-gray-700 flex items-center gap-1 hover:text-primary font-medium px-3 py-1 rounded transition-colors duration-150 hover:bg-primary/10"
            >
              <Home size={20} className="inline-block" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-700 hover:text-red-600 font-medium px-3 py-1 rounded transition-colors duration-150 hover:bg-red-50 focus:outline-none"
              title="Cerrar sesión"
            >
              <LogOut size={20} className="inline-block" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
