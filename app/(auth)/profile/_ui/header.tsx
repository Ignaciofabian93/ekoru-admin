import RegularButton from "@/ui/buttons/regularButton";
import { Text } from "@/ui/text/text";
import { Title } from "@/ui/text/title";

type Props = {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  handleCancel: () => void;
  handleSave: () => void;
  loading?: boolean;
};

export default function ProfileHeader({ isEditing, setIsEditing, handleCancel, handleSave, loading }: Props) {
  return (
    <section className="flex items-center justify-between">
      <div>
        <Title variant="h2" className="font-bold">
          Perfil de Administrador
        </Title>
        <Text variant="span" className="text-gray-500">
          Administra la configuración y la información de tu cuenta
        </Text>
      </div>

      <div className="flex gap-2">
        {!isEditing ? (
          <RegularButton
            text="Editar Perfil"
            onClick={() => setIsEditing(true)}
            className="!bg-lime-600 !text-white hover:!bg-lime-700 !border-lime-600"
            size="sm"
          />
        ) : (
          <>
            <RegularButton
              text="Cancelar"
              onClick={handleCancel}
              className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
              size="sm"
              disabled={loading}
            />
            <RegularButton
              text={loading ? "Guardando..." : "Guardar"}
              onClick={handleSave}
              className="!bg-lime-600 !text-white hover:!bg-lime-700 !border-lime-600"
              size="sm"
              disabled={loading}
            />
          </>
        )}
      </div>
    </section>
  );
}
