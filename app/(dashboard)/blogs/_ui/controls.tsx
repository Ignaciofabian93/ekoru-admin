import MainButton from "@/ui/buttons/mainButton";
import RegularButton from "@/ui/buttons/regularButton";
import Input from "@/ui/inputs/input";
import clsx from "clsx";
import { Search } from "lucide-react";

type Props = {
  searchQuery: string;
  setSearchQuery: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterType: "all" | "published" | "draft";
  setFilterType: (type: "all" | "published" | "draft") => void;
  setIsCreateModalOpen: (isOpen: boolean) => void;
};

export default function ControlsSection({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  setIsCreateModalOpen,
}: Props) {
  return (
    <section
      className={clsx(
        "bg-white",
        "dark:bg-stone-800",
        "rounded-lg shadow",
        "p-6 mb-8",
        "border border-gray-100",
        "dark:border-stone-600"
      )}
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <Input
            type="search"
            hasIcon
            icon={Search}
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Busca posts por título o contenido"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <RegularButton text="Todos" onClick={() => setFilterType("all")} selected={filterType === "all"} size="sm" />
          <RegularButton
            text="Publicados"
            onClick={() => setFilterType("published")}
            selected={filterType === "published"}
            size="sm"
          />
          <RegularButton
            text="Borrador"
            onClick={() => setFilterType("draft")}
            selected={filterType === "draft"}
            size="sm"
          />
        </div>

        {/* Create Button */}
        <div>
          <MainButton text="Nuevo Post" onClick={() => setIsCreateModalOpen(true)} />
        </div>
      </div>
    </section>
  );
}
