"use client";
import { useEffect, useState } from "react";
import { AdminRole, AdminPermission, AdminType } from "@/types/enums";
import Input from "@/ui/inputs/input";
import Select from "@/ui/inputs/select";
import MainButton from "@/ui/buttons/mainButton";
import { Text } from "@/ui/text/text";
import { getRoleLabel, getPermissionLabel } from "@/utils/permissionTranslations";
import { Admin } from "@/types/user";
import { UserPlus, Save } from "lucide-react";
import Checkbox from "@/ui/inputs/checkbox";

type AdminFormProps = {
  onSubmit: (data: AdminFormData) => Promise<void>;
  initialData?: Admin | null;
  isLoading?: boolean;
  mode: "create" | "edit";
  currentAdminRole: AdminRole;
};

export type AdminFormData = {
  email: string;
  name: string;
  lastName?: string;
  password?: string;
  adminType: AdminType;
  role: AdminRole;
  permissions: AdminPermission[];
  sellerId?: string;
};

// Define role permissions mapping
const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: [
    "MANAGE_ADMINS",
    "MANAGE_USERS",
    "BAN_USERS",
    "VIEW_USER_DATA",
    "MANAGE_PRODUCTS",
    "APPROVE_PRODUCTS",
    "DELETE_PRODUCTS",
    "WRITE_BLOG",
    "PUBLISH_BLOG",
    "DELETE_BLOG",
    "MODERATE_CONTENT",
    "MANAGE_ORDERS",
    "PROCESS_REFUNDS",
    "VIEW_TRANSACTIONS",
    "VIEW_ANALYTICS",
    "EXPORT_DATA",
    "MANAGE_CATEGORIES",
    "MANAGE_SETTINGS",
    "VIEW_SYSTEM_LOGS",
  ],
  MODERATOR: [
    "MODERATE_CONTENT",
    "VIEW_USER_DATA",
    "MANAGE_PRODUCTS",
    "APPROVE_PRODUCTS",
    "WRITE_BLOG",
    "VIEW_ANALYTICS",
  ],
  CONTENT_MANAGER: ["WRITE_BLOG", "PUBLISH_BLOG", "MANAGE_PRODUCTS", "APPROVE_PRODUCTS", "MANAGE_CATEGORIES"],
  SUPPORT: ["VIEW_USER_DATA", "MANAGE_ORDERS", "PROCESS_REFUNDS", "VIEW_TRANSACTIONS"],
  BUSINESS_OWNER: [
    "MANAGE_BUSINESS_PROFILE",
    "MANAGE_BUSINESS_TEAM",
    "VIEW_BUSINESS_ANALYTICS",
    "MANAGE_BUSINESS_PRODUCTS",
    "MANAGE_BUSINESS_ORDERS",
  ],
  BUSINESS_MANAGER: [
    "MANAGE_BUSINESS_PRODUCTS",
    "MANAGE_BUSINESS_ORDERS",
    "VIEW_BUSINESS_ANALYTICS",
    "MANAGE_BUSINESS_PROFILE",
  ],
  BUSINESS_ANALYST: ["VIEW_BUSINESS_ANALYTICS", "MANAGE_BUSINESS_ORDERS"],
  BUSINESS_SUPPORT: ["MANAGE_BUSINESS_ORDERS", "VIEW_BUSINESS_ANALYTICS"],
};

// Platform admin roles
const PLATFORM_ROLES: AdminRole[] = ["SUPER_ADMIN", "MODERATOR", "CONTENT_MANAGER", "SUPPORT"];

// Business admin roles
const BUSINESS_ROLES: AdminRole[] = ["BUSINESS_OWNER", "BUSINESS_MANAGER", "BUSINESS_ANALYST", "BUSINESS_SUPPORT"];

export default function AdminForm({ onSubmit, initialData, isLoading, mode, currentAdminRole }: AdminFormProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    email: "",
    name: "",
    lastName: "",
    password: "",
    adminType: "PLATFORM",
    role: "MODERATOR",
    permissions: [],
    sellerId: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        name: initialData.name,
        lastName: initialData.lastName || "",
        password: "",
        adminType: initialData.adminType || "PLATFORM",
        role: initialData.role || "MODERATOR",
        permissions: initialData.permissions || [],
        sellerId: initialData.sellerId || "",
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});

  // Update permissions when role changes
  useEffect(() => {
    if (formData.role) {
      setFormData((prev) => ({
        ...prev,
        permissions: ROLE_PERMISSIONS[formData.role] || [],
      }));
    }
  }, [formData.role]);

  // Update role options when admin type changes
  useEffect(() => {
    const availableRoles = formData.adminType === "PLATFORM" ? PLATFORM_ROLES : BUSINESS_ROLES;
    if (!availableRoles.includes(formData.role)) {
      setFormData((prev) => ({
        ...prev,
        role: availableRoles[0],
      }));
    }
  }, [formData.adminType, formData.role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AdminFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleChange = (field: keyof AdminFormData, value: string | string[] | AdminType | AdminRole) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePermissionToggle = (permission: AdminPermission) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions: newPermissions };
    });
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AdminFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (mode === "create" && !formData.password) {
      newErrors.password = "La contraseña es requerida";
    }

    if (mode === "create" && formData.password && formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (formData.adminType === "BUSINESS" && !formData.sellerId?.trim()) {
      newErrors.sellerId = "El ID del negocio es requerido para administradores de negocio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  // Get available roles based on admin type
  const availableRoles = formData.adminType === "PLATFORM" ? PLATFORM_ROLES : BUSINESS_ROLES;

  const adminTypeOptions = [
    { label: "Administrador de Plataforma", value: "PLATFORM" },
    { label: "Administrador de Negocio", value: "BUSINESS" },
  ];

  const roleOptions = availableRoles.map((role) => ({
    label: getRoleLabel(role),
    value: role,
  }));

  // Get permissions based on admin type
  const availablePermissions =
    formData.adminType === "PLATFORM" ? ROLE_PERMISSIONS.SUPER_ADMIN : ROLE_PERMISSIONS.BUSINESS_OWNER;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
      {/* Basic Information */}
      <div className="space-y-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">Información Básica</Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Juan"
            isInvalid={!!errors.name}
            errorMessage={errors.name}
          />

          <Input
            label="Apellido"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleInputChange}
            placeholder="Pérez"
          />
        </div>

        <Input
          label="Email *"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleInputChange}
          placeholder="admin@ekoru.com"
          isInvalid={!!errors.email}
          errorMessage={errors.email}
        />

        {mode === "create" && (
          <Input
            label="Contraseña *"
            name="password"
            type="password"
            value={formData.password || ""}
            onChange={handleInputChange}
            placeholder="Mínimo 8 caracteres"
            isInvalid={!!errors.password}
            errorMessage={errors.password}
          />
        )}
      </div>

      {/* Admin Type & Role */}
      <div className="space-y-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tipo y Rol de Administrador</Text>

        <Select
          label="Tipo de Administrador *"
          name="adminType"
          value={formData.adminType}
          onChange={(value) => handleChange("adminType", value as AdminType)}
          options={adminTypeOptions}
          disabled={currentAdminRole !== "SUPER_ADMIN"}
        />

        <Select
          label="Rol *"
          name="role"
          value={formData.role}
          onChange={(value) => handleChange("role", value as AdminRole)}
          options={roleOptions}
        />

        {formData.adminType === "BUSINESS" && (
          <Input
            label="ID del Negocio *"
            name="sellerId"
            value={formData.sellerId || ""}
            onChange={handleInputChange}
            placeholder="UUID del vendedor/negocio"
            isInvalid={!!errors.sellerId}
            errorMessage={errors.sellerId}
          />
        )}
      </div>

      {/* Permissions */}
      <div className="space-y-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Permisos ({formData.permissions.length})
        </Text>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <Text variant="small" className="text-gray-600 dark:text-gray-400 mb-3">
            Los permisos se asignan automáticamente según el rol seleccionado. Puedes personalizarlos si es necesario.
          </Text>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {availablePermissions.map((permission) => (
              <Checkbox
                key={permission}
                id={`permission-${permission}`}
                name={`permission-${permission}`}
                label={getPermissionLabel(permission as AdminPermission)}
                checked={formData.permissions.includes(permission as AdminPermission)}
                onChange={() => handlePermissionToggle(permission as AdminPermission)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <MainButton
          type="submit"
          text={mode === "create" ? "Crear Administrador" : "Guardar Cambios"}
          icon={mode === "create" ? UserPlus : Save}
          isLoading={isLoading}
          loadingText={mode === "create" ? "Creando..." : "Guardando..."}
        />
      </div>
    </form>
  );
}
