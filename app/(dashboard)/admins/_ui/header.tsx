import MainButton from "@/ui/buttons/mainButton";
import { Text } from "@/ui/text/text";
import { Title } from "@/ui/text/title";
import { UserPlus } from "lucide-react";

type Props = {
  canCreateAdmins: boolean;
  setIsCreateModalOpen: (isOpen: boolean) => void;
  setMode: (mode: "create" | "edit") => void;
};

export default function AdminsHeader({ canCreateAdmins, setIsCreateModalOpen, setMode }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Title variant="h1">Administradores</Title>
        <Text className="text-gray-600 dark:text-gray-400 mt-1">
          Gestiona los administradores de la plataforma y negocios
        </Text>
      </div>
      {canCreateAdmins && (
        <div>
          <MainButton
            text="Nuevo Administrador"
            icon={UserPlus}
            onClick={() => {
              setIsCreateModalOpen(true);
              setMode("create");
            }}
            variant="primary"
          />
        </div>
      )}
    </div>
  );
}
