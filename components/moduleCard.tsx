"use client";

import { useRouter } from "next/navigation";

type ModuleCardProps = {
  title: string;
  description: string;
  href: string;
};

export default function ModuleCard({
  title,
  description,
  href,
}: ModuleCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-700 mb-4">{description}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => router.push(href)}
      >
        Ver módulo
      </button>
    </div>
  );
}
