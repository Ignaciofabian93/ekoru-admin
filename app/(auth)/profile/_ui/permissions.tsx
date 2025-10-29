import { CardWrapper } from "@/ui/cards/card";
import { Text } from "@/ui/text/text";
import { Title } from "@/ui/text/title";
import { Shield } from "lucide-react";
import { Admin } from "@/types";
import { getAdminTypeLabel, getPermissionLabel, getRoleLabel } from "@/utils/permissionTranslations";
import clsx from "clsx";

type Props = {
  data: Admin;
  isPlatformAdmin: boolean;
};

export default function RoleAndPermissions({ data, isPlatformAdmin }: Props) {
  return (
    <CardWrapper variant="elevated" className="!min-h-0">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={clsx(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isPlatformAdmin
              ? "bg-gradient-to-br from-blue-400 to-blue-600"
              : "bg-gradient-to-br from-purple-400 to-purple-600"
          )}
        >
          <Shield className="text-white" size={24} />
        </div>
        <Title variant="h4" className="font-bold">
          Rol y Permisos de Administrador
        </Title>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Text variant="label" className="font-medium text-gray-600 dark:text-gray-400">
              Rol de Administrador
            </Text>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Text variant="p" className="font-semibold capitalize">
                {getRoleLabel(data.role)}
              </Text>
            </div>
          </div>

          <div className="space-y-2">
            <Text variant="label" className="font-medium text-gray-600 dark:text-gray-400">
              Tipo de administrador
            </Text>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Text variant="p" className="font-semibold">
                {getAdminTypeLabel(data.adminType)}
              </Text>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Text variant="label" className="font-medium text-gray-600 dark:text-gray-400">
            Permisos ({data.permissions?.length || 0})
          </Text>
          <div className="flex flex-wrap gap-2">
            {data.permissions && data.permissions.length > 0 ? (
              data.permissions.map((permission, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300 rounded-full text-xs font-medium"
                >
                  {getPermissionLabel(permission)}
                </span>
              ))
            ) : (
              <Text variant="span" className="text-gray-500 italic">
                Sin permisos asignados
              </Text>
            )}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
