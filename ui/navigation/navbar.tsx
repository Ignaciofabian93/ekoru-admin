"use client";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Database,
  Home,
  LogOut,
  Notebook,
  PackageSearch,
  UserRoundPen,
  UserRoundSearch,
  UsersRound,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import useLogout from "@/hooks/useLogout";

const navigation = [
  { name: "Inicio", href: "/home", icon: Home },
  { name: "Usuarios", href: "/users", icon: UserRoundSearch },
  { name: "Productos", href: "/products", icon: PackageSearch },
  { name: "Blog", href: "/blogs", icon: Notebook },
  { name: "Comunidad", href: "/community", icon: UsersRound },
  { name: "Base de datos", href: "/database", icon: Database },
  { name: "Perfil", href: "/profile", icon: UserRoundPen },
];

export default function Navbar() {
  const pathname = usePathname();
  const { handleLogout } = useLogout();
  const logo = "/brand/icon.webp";

  return (
    <header
      className={clsx(
        "w-[70px] h-screen fixed top-0 left-0 z-50",
        // Light mode gradient
        "bg-gradient-to-b from-navbar-light-800 via-navbar-light-600 to-navbar-light-800",
        // Dark mode gradient
        "dark:bg-gradient-to-b dark:from-navbar-dark-900 dark:via-navbar-dark-800 dark:to-navbar-dark-900",
        "border-r border-layout-light-200",
        "dark:border-layout-dark-700",
        "transition-colors duration-300",
        "shadow-lg dark:shadow-layout-dark-900/50"
      )}
    >
      <nav className="flex flex-col h-full justify-between py-4">
        {/* Logo Section */}
        <div className="flex items-center justify-center px-3 mb-8">
          <Image src={logo} alt="Logo" width={50} height={50} className="rounded-lg" />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col gap-2 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href} className="relative group">
                <motion.div
                  className={clsx(
                    "relative flex items-center justify-center px-2 py-3 rounded-lg",
                    "transition-all duration-200",
                    "cursor-pointer",
                    isActive
                      ? "bg-gradient-to-r from-neutral-50 to-neutral-300 dark:from-button-primary-500 dark:to-button-primary-700 text-primary dark:text-white shadow-md"
                      : "bg-transparent text-white hover:bg-gray-100 dark:hover:bg-button-primary-700 hover:text-primary dark:hover:text-white"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                </motion.div>

                {/* Tooltip */}
                <div
                  className={clsx(
                    "absolute left-full ml-2 top-1/2 -translate-y-1/2",
                    "px-3 py-2 rounded-lg",
                    "bg-gray-900 dark:bg-gray-100",
                    "text-white dark:text-gray-900",
                    "text-sm font-medium whitespace-nowrap",
                    "opacity-0 group-hover:opacity-100",
                    "pointer-events-none",
                    "transition-all duration-200",
                    "shadow-lg",
                    "z-50"
                  )}
                >
                  {item.name}
                  {/* Tooltip Arrow */}
                  <div
                    className={clsx(
                      "absolute right-full top-1/2 -translate-y-1/2",
                      "border-4 border-transparent",
                      "border-r-gray-900 dark:border-r-gray-100"
                    )}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="px-3 mt-4">
          <button className="relative group w-full" onClick={handleLogout}>
            <motion.div
              className={clsx(
                "flex items-center justify-center p-3 rounded-lg",
                "text-white",
                "hover:bg-red-50 dark:hover:bg-red-900/20",
                "hover:text-red-600 dark:hover:text-red-400",
                "transition-all duration-200"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={20} />
            </motion.div>

            {/* Tooltip */}
            <div
              className={clsx(
                "absolute left-full ml-2 top-1/2 -translate-y-1/2",
                "px-3 py-2 rounded-lg",
                "bg-gray-900 dark:bg-gray-100",
                "text-white dark:text-gray-900",
                "text-sm font-medium whitespace-nowrap",
                "opacity-0 group-hover:opacity-100",
                "pointer-events-none",
                "transition-all duration-200",
                "shadow-lg",
                "z-50"
              )}
            >
              Cerrar sesión
              {/* Tooltip Arrow */}
              <div
                className={clsx(
                  "absolute right-full top-1/2 -translate-y-1/2",
                  "border-4 border-transparent",
                  "border-r-gray-900 dark:border-r-gray-100"
                )}
              />
            </div>
          </button>
        </div>
      </nav>
    </header>
  );
}
