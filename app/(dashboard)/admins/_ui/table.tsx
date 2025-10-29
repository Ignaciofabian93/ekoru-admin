import { Ban, Edit, Shield, Trash2 } from "lucide-react";
import { Admin } from "@/types";
import { Text } from "@/ui/text/text";
import { getAdminTypeLabel, getRoleLabel } from "@/utils/permissionTranslations";
import clsx from "clsx";

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50 dark:bg-gray-900">
    <tr>{children}</tr>
  </thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    {children}
  </th>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">{children}</tr>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-6 py-4 whitespace-nowrap">{children}</td>
);

type Props = {
  filteredAdmins: Admin[];
  canCreateAdmins: boolean;
  handleEdit: (admin: Admin) => void;
  handleToggleStatus: (adminId: string, isActive: boolean) => void;
  handleDelete: (adminId: string) => void;
};

export default function AdminsTable({
  filteredAdmins,
  canCreateAdmins,
  handleEdit,
  handleToggleStatus,
  handleDelete,
}: Props) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHead>
            <TableHeader>Administrador</TableHeader>
            <TableHeader>Tipo</TableHeader>
            <TableHeader>Rol</TableHeader>
            <TableHeader>Permisos</TableHeader>
            <TableHeader>Estado</TableHeader>
            {canCreateAdmins && <TableHeader>Acciones</TableHeader>}
          </TableHead>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {admin.name} {admin.lastName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={clsx(
                      "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                      admin.adminType === "PLATFORM"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    )}
                  >
                    {getAdminTypeLabel(admin.adminType)}
                  </span>
                </TableCell>
                <TableCell>
                  <Text variant="small">{getRoleLabel(admin.role)}</Text>
                </TableCell>
                <TableCell>
                  <Text variant="small" className="text-gray-600 dark:text-gray-400">
                    {admin.permissions.length} permisos
                  </Text>
                </TableCell>
                <TableCell>
                  <span
                    className={clsx(
                      "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                      admin.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    )}
                  >
                    {admin.isActive ? "Activo" : "Inactivo"}
                  </span>
                </TableCell>
                {canCreateAdmins && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                        className={clsx(
                          "hover:opacity-80",
                          admin.isActive ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"
                        )}
                        title={admin.isActive ? "Desactivar" : "Activar"}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>

      {filteredAdmins.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <Text className="text-gray-600 dark:text-gray-400">No se encontraron administradores</Text>
        </div>
      )}
    </section>
  );
}
