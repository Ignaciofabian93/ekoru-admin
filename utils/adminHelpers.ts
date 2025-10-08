import { Admin, AdminRole, AdminPrivileges, ROLE_PRIVILEGES } from "@/types/user";

/**
 * Get default privileges for a given admin role
 */
export const getDefaultPrivilegesForRole = (role: AdminRole): AdminPrivileges => {
  return ROLE_PRIVILEGES[role];
};

/**
 * Check if an admin has a specific privilege
 */
export const hasPrivilege = (admin: Admin, category: keyof AdminPrivileges, action: string): boolean => {
  const categoryPrivileges = admin.privileges[category];
  if (!categoryPrivileges) return false;

  return (categoryPrivileges as Record<string, boolean>)[action] === true;
};

/**
 * Check multiple privileges at once
 */
export const hasAllPrivileges = (
  admin: Admin,
  checks: Array<{ category: keyof AdminPrivileges; action: string }>
): boolean => {
  return checks.every(({ category, action }) => hasPrivilege(admin, category, action));
};

/**
 * Check if admin has any of the specified privileges
 */
export const hasAnyPrivilege = (
  admin: Admin,
  checks: Array<{ category: keyof AdminPrivileges; action: string }>
): boolean => {
  return checks.some(({ category, action }) => hasPrivilege(admin, category, action));
};

/**
 * Check if admin can access a specific feature
 * This is a higher-level function for route/feature access control
 */
export const canAccessFeature = (admin: Admin, feature: string): boolean => {
  const featureMap: Record<string, Array<{ category: keyof AdminPrivileges; action: string }>> = {
    dashboard: [{ category: "analytics", action: "viewDashboard" }],
    users: [{ category: "users", action: "view" }],
    businesses: [{ category: "businesses", action: "view" }],
    products: [{ category: "products", action: "view" }],
    orders: [{ category: "orders", action: "view" }],
    content: [{ category: "content", action: "viewReports" }],
    analytics: [{ category: "analytics", action: "viewReports" }],
    settings: [{ category: "system", action: "configureSettings" }],
    finance: [{ category: "financial", action: "viewTransactions" }],
    support: [{ category: "support", action: "viewTickets" }],
  };

  const requiredPrivileges = featureMap[feature];
  if (!requiredPrivileges) return false;

  return hasAllPrivileges(admin, requiredPrivileges);
};

/**
 * Get readable role name
 */
export const getRoleName = (role: AdminRole): string => {
  const roleNames: Record<AdminRole, string> = {
    [AdminRole.SUPER_ADMIN]: "Super Admin",
    [AdminRole.ADMIN]: "Admin",
    [AdminRole.MODERATOR]: "Moderator",
    [AdminRole.SUPPORT]: "Support",
    [AdminRole.ANALYST]: "Analyst",
    [AdminRole.FINANCE]: "Finance",
  };

  return roleNames[role];
};

/**
 * Check if admin is Ekoru admin (has full privileges)
 */
export const isEkoruAdmin = (admin: Admin): boolean => {
  return admin.role === AdminRole.SUPER_ADMIN || admin.role === AdminRole.ADMIN;
};

/**
 * Create a new admin with default privileges for their role
 */
export const createAdminWithDefaultPrivileges = (adminData: Omit<Admin, "privileges">, role: AdminRole): Admin => {
  return {
    ...adminData,
    role,
    privileges: getDefaultPrivilegesForRole(role),
  };
};
