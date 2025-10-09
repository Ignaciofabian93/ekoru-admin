export interface DatabaseTable {
  name: string;
  label: string;
  description: string;
  category: string;
  icon?: string;
}

export const databaseTables: DatabaseTable[] = [
  // Admin & Authentication
  {
    name: "Admin",
    label: "Administradores",
    description: "Gestión de usuarios administradores del sistema",
    category: "Administración",
  },
  {
    name: "AdminActivityLog",
    label: "Registro de Actividad",
    description: "Historial de acciones de administradores",
    category: "Administración",
  },
  {
    name: "AdminPermission",
    label: "Permisos de Admin",
    description: "Permisos asignados a administradores",
    category: "Administración",
  },

  // Location
  {
    name: "Country",
    label: "Países",
    description: "Catálogo de países",
    category: "Ubicación",
  },
  {
    name: "Region",
    label: "Regiones",
    description: "Regiones por país",
    category: "Ubicación",
  },
  {
    name: "City",
    label: "Ciudades",
    description: "Ciudades por región",
    category: "Ubicación",
  },
  {
    name: "County",
    label: "Comunas",
    description: "Comunas por ciudad",
    category: "Ubicación",
  },

  // Sellers & Users
  {
    name: "Seller",
    label: "Vendedores",
    description: "Usuarios vendedores de la plataforma",
    category: "Usuarios",
  },
  {
    name: "PersonProfile",
    label: "Perfiles de Persona",
    description: "Perfiles de vendedores individuales",
    category: "Usuarios",
  },
  {
    name: "BusinessProfile",
    label: "Perfiles de Negocio",
    description: "Perfiles de negocios y empresas",
    category: "Usuarios",
  },
  {
    name: "SellerPreferences",
    label: "Preferencias de Vendedor",
    description: "Configuraciones y preferencias de usuarios",
    category: "Usuarios",
  },
  {
    name: "SellerCategory",
    label: "Categorías de Vendedor",
    description: "Categorías para clasificar vendedores",
    category: "Usuarios",
  },

  // Products & Catalog
  {
    name: "Department",
    label: "Departamentos",
    description: "Departamentos principales de productos",
    category: "Catálogo",
  },
  {
    name: "DepartmentCategory",
    label: "Categorías de Departamento",
    description: "Categorías dentro de departamentos",
    category: "Catálogo",
  },
  {
    name: "ProductCategory",
    label: "Categorías de Producto",
    description: "Categorías específicas de productos",
    category: "Catálogo",
  },
  {
    name: "Product",
    label: "Productos",
    description: "Catálogo de productos disponibles",
    category: "Productos",
  },
  {
    name: "ProductVariant",
    label: "Variantes de Producto",
    description: "Variantes de productos (talla, color, etc.)",
    category: "Productos",
  },
  {
    name: "ProductLike",
    label: "Me Gusta",
    description: "Likes en productos",
    category: "Productos",
  },
  {
    name: "ProductComment",
    label: "Comentarios",
    description: "Comentarios y reseñas de productos",
    category: "Productos",
  },

  // Services
  {
    name: "ServiceCategory",
    label: "Categorías de Servicio",
    description: "Categorías de servicios ofrecidos",
    category: "Servicios",
  },
  {
    name: "Service",
    label: "Servicios",
    description: "Servicios ofrecidos por vendedores",
    category: "Servicios",
  },
  {
    name: "ServiceReview",
    label: "Reseñas de Servicio",
    description: "Evaluaciones de servicios",
    category: "Servicios",
  },
  {
    name: "Quotation",
    label: "Cotizaciones",
    description: "Cotizaciones de servicios",
    category: "Servicios",
  },

  // Orders & Transactions
  {
    name: "Order",
    label: "Órdenes",
    description: "Órdenes de compra",
    category: "Transacciones",
  },
  {
    name: "OrderItem",
    label: "Items de Orden",
    description: "Productos en órdenes",
    category: "Transacciones",
  },
  {
    name: "ShippingStatus",
    label: "Estados de Envío",
    description: "Estados de envío de órdenes",
    category: "Transacciones",
  },
  {
    name: "Transaction",
    label: "Transacciones",
    description: "Transacciones y puntos",
    category: "Transacciones",
  },
  {
    name: "Exchange",
    label: "Intercambios",
    description: "Intercambios de productos entre usuarios",
    category: "Transacciones",
  },

  // Payments
  {
    name: "Payment",
    label: "Pagos",
    description: "Pagos realizados",
    category: "Pagos",
  },
  {
    name: "PaymentRefund",
    label: "Reembolsos",
    description: "Reembolsos de pagos",
    category: "Pagos",
  },
  {
    name: "PaymentWebhook",
    label: "Webhooks de Pago",
    description: "Eventos de webhooks de pagos",
    category: "Pagos",
  },
  {
    name: "PaymentTransaction",
    label: "Transacciones de Pago",
    description: "Historial de transacciones de pago",
    category: "Pagos",
  },
  {
    name: "ChileanPaymentConfig",
    label: "Configuración de Pagos",
    description: "Configuración de proveedores de pago",
    category: "Pagos",
  },

  // Communication
  {
    name: "Chat",
    label: "Chats",
    description: "Conversaciones entre usuarios",
    category: "Comunicación",
  },
  {
    name: "Message",
    label: "Mensajes",
    description: "Mensajes de chat",
    category: "Comunicación",
  },
  {
    name: "Notification",
    label: "Notificaciones",
    description: "Notificaciones del sistema",
    category: "Comunicación",
  },
  {
    name: "NotificationTemplate",
    label: "Plantillas de Notificación",
    description: "Plantillas de notificaciones",
    category: "Comunicación",
  },

  // Social & Community
  {
    name: "Match",
    label: "Coincidencias",
    description: "Coincidencias entre vendedores",
    category: "Social",
  },
  {
    name: "Story",
    label: "Historias",
    description: "Historias de vendedores",
    category: "Social",
  },
  {
    name: "BlogPost",
    label: "Publicaciones de Blog",
    description: "Artículos y publicaciones del blog",
    category: "Contenido",
  },
  {
    name: "CommunityPost",
    label: "Publicaciones de Comunidad",
    description: "Publicaciones en la comunidad",
    category: "Contenido",
  },
  {
    name: "CommunityComment",
    label: "Comentarios de Comunidad",
    description: "Comentarios en publicaciones de comunidad",
    category: "Contenido",
  },

  // Sustainability
  {
    name: "MaterialImpactEstimate",
    label: "Impacto de Materiales",
    description: "Estimaciones de impacto ambiental de materiales",
    category: "Sostenibilidad",
  },
  {
    name: "Co2ImpactMessage",
    label: "Mensajes de CO2",
    description: "Mensajes sobre impacto de CO2",
    category: "Sostenibilidad",
  },
  {
    name: "WaterImpactMessage",
    label: "Mensajes de Agua",
    description: "Mensajes sobre impacto de agua",
    category: "Sostenibilidad",
  },
];

export const tableCategories = [
  "Administración",
  "Ubicación",
  "Usuarios",
  "Catálogo",
  "Productos",
  "Servicios",
  "Transacciones",
  "Pagos",
  "Comunicación",
  "Social",
  "Contenido",
  "Sostenibilidad",
] as const;

export type TableCategory = (typeof tableCategories)[number];
