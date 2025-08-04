import React from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", icon: "/globe.svg", label: "Dashboard" },
  { href: "/chat", icon: "/window.svg", label: "Chat" },
  { href: "/profile", icon: "/file.svg", label: "Profile" },
  { href: "/settings", icon: "/next.svg", label: "Settings" },
  { href: "/logout", icon: "/vercel.svg", label: "Logout" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-1 bottom-1 left-[2px] h-[98vh] w-[45px] bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg flex flex-col items-center py-6 z-50 rounded-lg">
      <div className="mb-8">
        <Image
          src="/brandIcon.webp"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <ul className="flex flex-col gap-8 flex-1">
        {navItems.map((item) => (
          <li key={item.href} className="group">
            <Link
              href={item.href}
              className="flex flex-col items-center justify-center"
            >
              <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700 group-hover:bg-primary transition-all duration-200 shadow-md">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                />
              </span>
              <span className="mt-2 text-xs text-gray-400 group-hover:text-primary transition-all duration-200">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto mb-4">
        {/* Add any extra controls or user avatar here */}
      </div>
    </nav>
  );
}
