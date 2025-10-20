// Field configuration for creating new records
// Maps table names to their field definitions

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "multiselect"
  | "boolean"
  | "date"
  | "datetime"
  | "json"
  | "array"
  | "relation";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: unknown;
  options?: { label: string; value: string | number }[]; // For select/multiselect
  relatedTable?: string; // For relation fields
  relatedLabelField?: string; // Which field to show as label in relation
  min?: number; // For number inputs
  max?: number; // For number inputs
  disabled?: boolean;
  hidden?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
};

export const tableFieldConfigs: Record<string, FieldConfig[]> = {
  // Location Tables
  Countries: [
    {
      name: "country",
      label: "País",
      type: "text",
      required: true,
      placeholder: "Ej: Chile",
    },
  ],

  Region: [
    {
      name: "region",
      label: "Región",
      type: "text",
      required: true,
      placeholder: "Ej: Metropolitana",
    },
    {
      name: "countryId",
      label: "País",
      type: "relation",
      required: true,
      relatedTable: "Country",
      relatedLabelField: "country",
    },
  ],

  City: [
    {
      name: "city",
      label: "Ciudad",
      type: "text",
      required: true,
      placeholder: "Ej: Santiago",
    },
    {
      name: "regionId",
      label: "Región",
      type: "relation",
      required: true,
      relatedTable: "Region",
      relatedLabelField: "region",
    },
  ],

  County: [
    {
      name: "county",
      label: "Comuna",
      type: "text",
      required: true,
      placeholder: "Ej: Las Condes",
    },
    {
      name: "cityId",
      label: "Ciudad",
      type: "relation",
      required: true,
      relatedTable: "City",
      relatedLabelField: "city",
    },
  ],

  // Department & Categories
  Departments: [
    {
      name: "departmentName",
      label: "Nombre del Departamento",
      type: "text",
      required: true,
      placeholder: "Ej: Electrónica",
    },
    {
      name: "departmentImage",
      label: "Imagen del Departamento",
      type: "text",
      placeholder: "URL de la imagen",
    },
  ],

  DepartmentCategory: [
    {
      name: "departmentCategoryName",
      label: "Nombre de Categoría",
      type: "text",
      required: true,
      placeholder: "Ej: Computadores",
    },
    {
      name: "departmentId",
      label: "Departamento",
      type: "relation",
      required: true,
      relatedTable: "Department",
      relatedLabelField: "departmentName",
    },
  ],

  ProductCategory: [
    {
      name: "productCategoryName",
      label: "Nombre de Categoría",
      type: "text",
      required: true,
      placeholder: "Ej: Laptops",
    },
    {
      name: "departmentCategoryId",
      label: "Categoría de Departamento",
      type: "relation",
      required: true,
      relatedTable: "DepartmentCategory",
      relatedLabelField: "departmentCategoryName",
    },
    {
      name: "keywords",
      label: "Palabras Clave",
      type: "array",
      placeholder: "Ej: laptop, computador, portátil",
    },
    {
      name: "averageWeight",
      label: "Peso Promedio",
      type: "number",
      min: 0,
      placeholder: "Ej: 2.5",
    },
    {
      name: "size",
      label: "Tamaño",
      type: "select",
      options: [
        { label: "XS", value: "XS" },
        { label: "S", value: "S" },
        { label: "M", value: "M" },
        { label: "L", value: "L" },
        { label: "XL", value: "XL" },
      ],
    },
    {
      name: "weightUnit",
      label: "Unidad de Peso",
      type: "select",
      options: [
        { label: "Kilogramos", value: "KG" },
        { label: "Libras", value: "LB" },
        { label: "Onzas", value: "OZ" },
        { label: "Gramos", value: "G" },
      ],
    },
  ],

  // Seller Categories & Levels
  SellerCategory: [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      required: true,
      placeholder: "Ej: Categoría Bronce",
    },
    {
      name: "categoryDiscountAmount",
      label: "Descuento (%)",
      type: "number",
      required: true,
      min: 0,
      max: 100,
      placeholder: "Ej: 5",
    },
    {
      name: "pointsThreshold",
      label: "Puntos Requeridos",
      type: "number",
      required: true,
      min: 0,
      placeholder: "Ej: 1000",
    },
    {
      name: "level",
      label: "Nivel",
      type: "number",
      required: true,
      min: 1,
      placeholder: "Ej: 1",
    },
  ],

  SellerLevels: [
    {
      name: "levelName",
      label: "Nombre del Nivel",
      type: "text",
      required: true,
      placeholder: "Ej: Novato",
    },
    {
      name: "minPoints",
      label: "Puntos Mínimos",
      type: "number",
      required: true,
      min: 0,
      placeholder: "Ej: 0",
    },
    {
      name: "maxPoints",
      label: "Puntos Máximos",
      type: "number",
      min: 0,
      placeholder: "Ej: 999",
    },
    {
      name: "benefits",
      label: "Beneficios",
      type: "textarea",
      placeholder: "Describe los beneficios de este nivel",
    },
    {
      name: "badgeIcon",
      label: "Icono",
      type: "text",
      placeholder: "Nombre del icono",
    },
  ],

  // Service Categories
  ServiceCategory: [
    {
      name: "category",
      label: "Categoría",
      type: "text",
      required: true,
      placeholder: "Ej: Reparaciones",
    },
  ],

  ServiceSubCategory: [
    {
      name: "subcategory",
      label: "Subcategoría",
      type: "text",
      required: true,
      placeholder: "Ej: Reparación de electrónica",
    },
    {
      name: "serviceCategoryId",
      label: "Categoría de Servicio",
      type: "relation",
      required: true,
      relatedTable: "ServiceCategory",
      relatedLabelField: "category",
    },
  ],

  // Store Categories
  StoreCategory: [
    {
      name: "name",
      label: "Nombre de Categoría",
      type: "text",
      required: true,
      placeholder: "Ej: Ropa",
    },
  ],

  StoreSubCategory: [
    {
      name: "name",
      label: "Nombre de Subcategoría",
      type: "text",
      required: true,
      placeholder: "Ej: Camisetas",
    },
    {
      name: "storeCategoryId",
      label: "Categoría de Tienda",
      type: "relation",
      required: true,
      relatedTable: "StoreCategory",
      relatedLabelField: "name",
    },
  ],

  // Community Categories
  CommunityCategory: [
    {
      name: "name",
      label: "Nombre de Categoría",
      type: "text",
      required: true,
      placeholder: "Ej: Sostenibilidad",
    },
  ],

  CommunitySubCategory: [
    {
      name: "name",
      label: "Nombre de Subcategoría",
      type: "text",
      required: true,
      placeholder: "Ej: Reciclaje",
    },
    {
      name: "communityCategoryId",
      label: "Categoría de Comunidad",
      type: "relation",
      required: true,
      relatedTable: "CommunityCategory",
      relatedLabelField: "name",
    },
  ],

  // Sustainability
  MaterialImpactEstimate: [
    {
      name: "materialType",
      label: "Tipo de Material",
      type: "text",
      required: true,
      placeholder: "Ej: Algodón",
    },
    {
      name: "estimatedCo2SavingsKG",
      label: "Ahorro de CO2 (kg)",
      type: "number",
      min: 0,
      placeholder: "Ej: 2.5",
    },
    {
      name: "estimatedWaterSavingsLT",
      label: "Ahorro de Agua (L)",
      type: "number",
      min: 0,
      placeholder: "Ej: 2700",
    },
  ],

  Co2ImpactMessage: [
    {
      name: "min",
      label: "CO2 Mínimo (kg)",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: "max",
      label: "CO2 Máximo (kg)",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: "message1",
      label: "Mensaje 1",
      type: "text",
      required: true,
      placeholder: "Primer mensaje de impacto",
    },
    {
      name: "message2",
      label: "Mensaje 2",
      type: "text",
      required: true,
      placeholder: "Segundo mensaje de impacto",
    },
    {
      name: "message3",
      label: "Mensaje 3",
      type: "text",
      required: true,
      placeholder: "Tercer mensaje de impacto",
    },
  ],

  WaterImpactMessage: [
    {
      name: "min",
      label: "Agua Mínima (L)",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: "max",
      label: "Agua Máxima (L)",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: "message1",
      label: "Mensaje 1",
      type: "text",
      required: true,
      placeholder: "Primer mensaje de impacto",
    },
    {
      name: "message2",
      label: "Mensaje 2",
      type: "text",
      required: true,
      placeholder: "Segundo mensaje de impacto",
    },
    {
      name: "message3",
      label: "Mensaje 3",
      type: "text",
      required: true,
      placeholder: "Tercer mensaje de impacto",
    },
  ],

  // Shipping Status
  ShippingStatus: [
    {
      name: "status",
      label: "Estado",
      type: "select",
      required: true,
      defaultValue: "PREPARING",
      options: [
        { label: "Preparando", value: "PREPARING" },
        { label: "Enviado", value: "SHIPPED" },
        { label: "Entregado", value: "DELIVERED" },
        { label: "Devuelto", value: "RETURNED" },
        { label: "Cancelado", value: "CANCELED" },
      ],
    },
  ],

  // Blog Categories
  BlogPost: [
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
      placeholder: "Título del artículo",
    },
    {
      name: "content",
      label: "Contenido",
      type: "textarea",
      required: true,
      placeholder: "Contenido del artículo...",
    },
    {
      name: "category",
      label: "Categoría",
      type: "select",
      required: true,
      defaultValue: "OTHER",
      options: [
        { label: "Reciclaje", value: "RECYCLING" },
        { label: "Contaminación", value: "POLLUTION" },
        { label: "Sostenibilidad", value: "SUSTAINABILITY" },
        { label: "Economía Circular", value: "CIRCULAR_ECONOMY" },
        { label: "Productos Usados", value: "USED_PRODUCTS" },
        { label: "Reutilización", value: "REUSE" },
        { label: "Medio Ambiente", value: "ENVIRONMENT" },
        { label: "Upcycling", value: "UPCYCLING" },
        { label: "Consumo Responsable", value: "RESPONSIBLE_CONSUMPTION" },
        { label: "Consejos Ecológicos", value: "ECO_TIPS" },
        { label: "Impacto Ambiental", value: "ENVIRONMENTAL_IMPACT" },
        { label: "Vida Sostenible", value: "SUSTAINABLE_LIVING" },
        { label: "Seguridad", value: "SECURITY" },
        { label: "Otro", value: "OTHER" },
      ],
    },
    {
      name: "isPublished",
      label: "Publicado",
      type: "boolean",
      defaultValue: false,
    },
  ],

  // Notification Templates
  NotificationTemplate: [
    {
      name: "type",
      label: "Tipo de Notificación",
      type: "select",
      required: true,
      options: [
        { label: "Orden Recibida", value: "ORDER_RECEIVED" },
        { label: "Orden Confirmada", value: "ORDER_CONFIRMED" },
        { label: "Orden Enviada", value: "ORDER_SHIPPED" },
        { label: "Orden Entregada", value: "ORDER_DELIVERED" },
        { label: "Cotización Recibida", value: "QUOTATION_RECEIVED" },
        { label: "Pago Recibido", value: "PAYMENT_RECEIVED" },
        { label: "Mensaje Recibido", value: "MESSAGE_RECEIVED" },
        { label: "Anuncio del Sistema", value: "SYSTEM_ANNOUNCEMENT" },
      ],
    },
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
      placeholder: "Título de la plantilla",
    },
    {
      name: "message",
      label: "Mensaje",
      type: "textarea",
      required: true,
      placeholder: "Mensaje de la plantilla (puede usar variables como {{name}})",
    },
    {
      name: "isActive",
      label: "Activa",
      type: "boolean",
      defaultValue: true,
    },
  ],
};

// Helper function to get field config for a table
export const getTableFieldConfig = (tableName: string): FieldConfig[] => {
  return tableFieldConfigs[tableName] || [];
};

// Helper function to check if a table has field configuration
export const hasFieldConfig = (tableName: string): boolean => {
  return tableName in tableFieldConfigs;
};
