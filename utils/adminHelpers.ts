import { Admin } from "@/types/user";
import { AdminRole, AdminPermission } from "@/types/enums";

/**
 * Get default permissions for a given admin role
 */
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

export const getDefaultPermissionsForRole = (role: AdminRole): AdminPermission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if an admin has a specific permission
 */
export const hasPermission = (admin: Admin, permission: AdminPermission): boolean => {
  return admin.permissions.includes(permission);
};

/**
 * Check multiple permissions at once
 */
export const hasAllPermissions = (admin: Admin, permissions: AdminPermission[]): boolean => {
  return permissions.every((permission) => hasPermission(admin, permission));
};

/**
 * Check if admin has any of the specified permissions
 */
export const hasAnyPermission = (admin: Admin, permissions: AdminPermission[]): boolean => {
  return permissions.some((permission) => hasPermission(admin, permission));
};

/**
 * Check if admin can access a specific feature
 * This is a higher-level function for route/feature access control
 */
export const canAccessFeature = (admin: Admin, feature: string): boolean => {
  const featureMap: Record<string, AdminPermission[]> = {
    dashboard: ["VIEW_ANALYTICS"],
    users: ["VIEW_USER_DATA"],
    businesses: ["VIEW_USER_DATA"],
    products: ["MANAGE_PRODUCTS"],
    orders: ["MANAGE_ORDERS"],
    content: ["MODERATE_CONTENT"],
    analytics: ["VIEW_ANALYTICS"],
    settings: ["MANAGE_SETTINGS"],
    finance: ["VIEW_TRANSACTIONS"],
    support: ["VIEW_USER_DATA"],
    blogs: ["WRITE_BLOG"],
    admins: ["MANAGE_ADMINS"],
  };

  const requiredPermissions = featureMap[feature];
  if (!requiredPermissions) return false;

  return hasAnyPermission(admin, requiredPermissions);
};

/**
 * Get readable role name
 */
export const getRoleName = (role: AdminRole): string => {
  const roleNames: Record<AdminRole, string> = {
    SUPER_ADMIN: "Super Admin",
    MODERATOR: "Moderador",
    CONTENT_MANAGER: "Gestor de Contenido",
    SUPPORT: "Soporte",
    BUSINESS_OWNER: "Dueño de Negocio",
    BUSINESS_MANAGER: "Gerente de Negocio",
    BUSINESS_ANALYST: "Analista de Negocio",
    BUSINESS_SUPPORT: "Soporte de Negocio",
  };

  return roleNames[role] || role;
};

/**
 * Check if admin is platform admin (has full privileges)
 */
export const isPlatformAdmin = (admin: Admin): boolean => {
  return admin.adminType === "PLATFORM" && admin.role === "SUPER_ADMIN";
};

/**
 * Check if admin is business admin
 */
export const isBusinessAdmin = (admin: Admin): boolean => {
  return admin.adminType === "BUSINESS";
};

/**
 * Create a new admin with default permissions for their role
 */
export const createAdminWithDefaultPermissions = (adminData: Omit<Admin, "permissions">, role: AdminRole): Admin => {
  return {
    ...adminData,
    role,
    permissions: getDefaultPermissionsForRole(role),
  };
};
