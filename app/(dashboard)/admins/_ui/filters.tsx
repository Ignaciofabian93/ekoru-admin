import { AdminRole, AdminType } from "@/types";
import Input from "@/ui/inputs/input";
import Select from "@/ui/inputs/select";
import { Search } from "lucide-react";

type Props = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterType: AdminType | "ALL";
  setFilterType: (value: AdminType | "ALL") => void;
  filterRole: string;
  setFilterRole: (value: AdminRole | "ALL") => void;
};

export default function AdminFilters({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterRole,
  setFilterRole,
}: Props) {
  return (
    <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          name="search"
          placeholder="Buscar por nombre o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          icon={Search}
        />

        <Select
          name="adminType"
          placeholder="Tipo de admin"
          value={filterType}
          onChange={(value) => setFilterType(value as AdminType | "ALL")}
          options={[
            { label: "Todos los tipos", value: "ALL" },
            { label: "Plataforma", value: "PLATFORM" },
            { label: "Negocios", value: "BUSINESS" },
          ]}
        />

        <Select
          name="role"
          placeholder="Rol"
          value={filterRole}
          onChange={(value) => setFilterRole(value as AdminRole | "ALL")}
          options={[
            { label: "Todos los roles", value: "ALL" },
            { label: "Super Admin", value: "SUPER_ADMIN" },
            { label: "Moderador", value: "MODERATOR" },
            { label: "Gestor de Contenido", value: "CONTENT_MANAGER" },
            { label: "Soporte", value: "SUPPORT" },
            { label: "Propietario de Negocio", value: "BUSINESS_OWNER" },
            { label: "Gerente de Negocio", value: "BUSINESS_MANAGER" },
          ]}
        />
      </div>
    </section>
  );
}
