import Link from "next/link";
import { LogOut } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-gray-100 shadow-md w-full fixed top-0 z-50 p-4">
      <nav className="container mx-auto w-full flex justify-end items-center">
        <ul className="flex space-x-4">
          <li className="w-[80px] cursor-pointer">
            <Link href="/" className="text-blue-500 hover:underline">
              Inicio
            </Link>
          </li>
          <li className="cursor-pointer">
            <LogOut size={20} className="inline-block mr-2" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
