"use client";
import { modules } from "@/constants/data";
import AppWrapper from "../wrapper";
import ModuleCard from "@/components/moduleCard";

export default function HomePage() {
  return (
    <AppWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {modules.map(({ name, label, href }) => (
            <ModuleCard key={name} title={label} description="" href={href} />
          ))}
        </div>
      </div>
    </AppWrapper>
  );
}
