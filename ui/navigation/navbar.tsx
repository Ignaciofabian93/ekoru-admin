import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, House, Database, UserRound, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: <House color="#fff" />, label: "Dashboard" },
  {
    href: "/database",
    icon: <Database color="#fff" />,
    label: "Base de datos",
  },
  { href: "/profile", icon: <UserRound color="#fff" />, label: "Perfil" },
  {
    href: "/settings",
    icon: <Settings color="#fff" />,
    label: "Ajustes",
  },
];

const bottomIcons = [{ icon: <LogOut color="#fff" />, label: "Salir" }];

export default function Navbar() {
  return (
    <nav className="h-[95%] w-[60px] ml-[5px] my-auto bg-gradient-to-b from-lime-300 to-emerald-800 shadow-lg flex flex-col items-center py-6 rounded-lg">
      <div className="mb-8">
        <Image
          src="/brandIcon.webp"
          alt="Logo"
          width={36}
          height={36}
          className="rounded-full drop-shadow-lg shadow-slate-900"
        />
      </div>
      <ul className="flex flex-col gap-8 flex-1">
        {navItems.map((item) => (
          <li key={item.href} className="group">
            <Link
              href={item.href}
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-800 group-hover:bg-primary transition-all duration-200 shadow-md">
                {item.icon}
              </span>
              <span className="mt-2 text-[10px] text-white group-hover:text-primary transition-all duration-200 text-center">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto mb-2">
        {/* Add any extra controls or user avatar here */}
        {bottomIcons.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center"
          >
            <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-800 hover:bg-primary transition-all duration-200 shadow-md">
              {item.icon}
            </span>
            <span className="mt-2 text-[10px] text-white hover:text-primary transition-all duration-200">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
}
