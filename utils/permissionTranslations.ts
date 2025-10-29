import { AdminPermission, AdminRole } from "@/types/enums";

export const permissionTranslations: Record<AdminPermission, string> = {
  // Product Permissions
  MANAGE_PRODUCTS: "Gestionar productos",
  APPROVE_PRODUCTS: "Aprobar productos",
  DELETE_PRODUCTS: "Eliminar productos",

  // Blog Permissions
  WRITE_BLOG: "Escribir blog",
  PUBLISH_BLOG: "Publicar blog",
  DELETE_BLOG: "Eliminar blog",

  // Content Moderation
  MODERATE_CONTENT: "Moderar contenido",

  // User Management
  MANAGE_USERS: "Gestionar usuarios",
  BAN_USERS: "Banear usuarios",
  VIEW_USER_DATA: "Ver datos de usuarios",

  // Order Management
  MANAGE_ORDERS: "Gestionar pedidos",
  PROCESS_REFUNDS: "Procesar reembolsos",

  // Analytics & Data
  VIEW_TRANSACTIONS: "Ver transacciones",
  VIEW_ANALYTICS: "Ver análisis",
  EXPORT_DATA: "Exportar datos",

  // Admin Management
  MANAGE_ADMINS: "Gestionar administradores",

  // System Management
  MANAGE_CATEGORIES: "Gestionar categorías",
  MANAGE_SETTINGS: "Gestionar configuración",
  VIEW_SYSTEM_LOGS: "Ver registros del sistema",

  // Business Permissions
  MANAGE_BUSINESS_PROFILE: "Gestionar perfil del negocio",
  MANAGE_BUSINESS_TEAM: "Gestionar equipo del negocio",
  VIEW_BUSINESS_ANALYTICS: "Ver análisis del negocio",
  MANAGE_BUSINESS_PRODUCTS: "Gestionar productos del negocio",
  MANAGE_BUSINESS_ORDERS: "Gestionar pedidos del negocio",
};

export const roleTranslations: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Administrador",
  MODERATOR: "Moderador",
  CONTENT_MANAGER: "Gestor de Contenido",
  SUPPORT: "Soporte",
  BUSINESS_OWNER: "Propietario del Negocio",
  BUSINESS_MANAGER: "Gerente del Negocio",
  BUSINESS_ANALYST: "Analista del Negocio",
  BUSINESS_SUPPORT: "Soporte del Negocio",
};

export const getPermissionLabel = (permission: AdminPermission): string => {
  return permissionTranslations[permission] || permission.replace(/_/g, " ").toLowerCase();
};

export const getRoleLabel = (role: AdminRole): string => {
  return roleTranslations[role] || role?.replace(/_/g, " ").toLowerCase();
};

export const getAdminTypeLabel = (adminType: string): string => {
  return adminType === "PLATFORM" ? "EKORU" : "Administrador de Negocio";
};
