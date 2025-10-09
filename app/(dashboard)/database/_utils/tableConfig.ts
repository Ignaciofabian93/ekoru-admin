/**
 * Table Field Configurations
 * Define which fields to display and how to format them for each table
 */

export interface TableFieldConfig {
  key: string;
  label: string;
  type?: "string" | "number" | "boolean" | "date" | "json" | "email" | "url";
  format?: (value: unknown) => string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
}

export interface TableConfig {
  fields: TableFieldConfig[];
  defaultSort?: string;
  defaultLimit?: number;
  allowedActions?: ("view" | "edit" | "delete")[];
}

/**
 * Default configuration for all tables
 */
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  fields: [],
  defaultLimit: 10,
  allowedActions: ["view", "edit", "delete"],
};

/**
 * Table-specific configurations
 * Add configurations for tables that need custom field handling
 */
export const TABLE_CONFIGS: Record<string, TableConfig> = {
  admins: {
    fields: [
      { key: "id", label: "ID", type: "number", width: "80px" },
      { key: "email", label: "Email", type: "email", searchable: true },
      { key: "name", label: "Nombre", type: "string", searchable: true },
      { key: "lastName", label: "Apellido", type: "string", searchable: true },
      { key: "role", label: "Rol", type: "string" },
      { key: "adminType", label: "Tipo", type: "string" },
      { key: "isActive", label: "Activo", type: "boolean" },
      { key: "lastLoginAt", label: "Último Login", type: "date" },
      { key: "createdAt", label: "Creado", type: "date" },
    ],
    defaultSort: "createdAt",
    defaultLimit: 20,
    allowedActions: ["view", "edit"],
  },

  users: {
    fields: [
      { key: "id", label: "ID", type: "number", width: "80px" },
      { key: "email", label: "Email", type: "email", searchable: true },
      { key: "username", label: "Usuario", type: "string", searchable: true },
      { key: "firstName", label: "Nombre", type: "string", searchable: true },
      { key: "lastName", label: "Apellido", type: "string", searchable: true },
      { key: "phoneNumber", label: "Teléfono", type: "string" },
      { key: "isActive", label: "Activo", type: "boolean" },
      { key: "isEmailVerified", label: "Email Verificado", type: "boolean" },
      { key: "createdAt", label: "Creado", type: "date" },
    ],
    defaultSort: "createdAt",
    defaultLimit: 20,
    allowedActions: ["view", "edit", "delete"],
  },

  // Add more table configs as needed
  // products: { ... },
  // orders: { ... },
};

/**
 * Get configuration for a specific table
 * Falls back to default config if table not configured
 */
export const getTableConfig = (tableName: string): TableConfig => {
  return TABLE_CONFIGS[tableName] || DEFAULT_TABLE_CONFIG;
};

/**
 * Format a cell value based on its type
 */
export const formatCellValue = (value: unknown, type?: TableFieldConfig["type"]): string => {
  if (value === null || value === undefined) return "-";

  switch (type) {
    case "boolean":
      return value ? "✓" : "✗";

    case "date":
      if (typeof value === "string" || value instanceof Date) {
        const date = new Date(value);
        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      return String(value);

    case "json":
      return typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);

    case "email":
      return String(value).toLowerCase();

    case "url":
      return String(value);

    case "number":
      return typeof value === "number" ? value.toLocaleString("es-ES") : String(value);

    case "string":
    default:
      return String(value);
  }
};
