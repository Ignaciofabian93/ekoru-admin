// Admin Related Enums
export type AdminRole =
  | "SUPER_ADMIN"
  | "MODERATOR"
  | "CONTENT_MANAGER"
  | "SUPPORT"
  | "BUSINESS_OWNER"
  | "BUSINESS_MANAGER"
  | "BUSINESS_ANALYST"
  | "BUSINESS_SUPPORT";

export type AdminPermission =
  | "MANAGE_PRODUCTS"
  | "APPROVE_PRODUCTS"
  | "DELETE_PRODUCTS"
  | "WRITE_BLOG"
  | "PUBLISH_BLOG"
  | "DELETE_BLOG"
  | "MODERATE_CONTENT"
  | "MANAGE_USERS"
  | "BAN_USERS"
  | "VIEW_USER_DATA"
  | "MANAGE_ORDERS"
  | "PROCESS_REFUNDS"
  | "VIEW_TRANSACTIONS"
  | "VIEW_ANALYTICS"
  | "EXPORT_DATA"
  | "MANAGE_ADMINS"
  | "MANAGE_CATEGORIES"
  | "MANAGE_SETTINGS"
  | "VIEW_SYSTEM_LOGS"
  | "MANAGE_BUSINESS_PROFILE"
  | "MANAGE_BUSINESS_TEAM"
  | "VIEW_BUSINESS_ANALYTICS"
  | "MANAGE_BUSINESS_PRODUCTS"
  | "MANAGE_BUSINESS_ORDERS";

export type AdminType = "PLATFORM" | "BUSINESS";

// Account and User Related Enums
export type AccountType = "FREE" | "PLUS" | "PREMIUM";
export type SellerType = "PERSON" | "STARTUP" | "COMPANY";
export type ContactMethod = "EMAIL" | "WHATSAPP" | "PHONE" | "INSTAGRAM" | "FACEBOOK" | "WEBSITE" | "TIKTOK";

// Business Related Enums
export type BusinessType = "RETAIL" | "SERVICES" | "MIXED";
export type BusinessFormalizationStatus = "NOT_REQUIRED" | "PENDING" | "IN_PROGRESS" | "FORMALIZED";
export type BusinessSubscriptionPlan = "FREEMIUM" | "STARTUP" | "BASIC" | "ADVANCED" | "EXPERT";
export type PersonSubscriptionPlan = "FREEMIUM" | "BASIC" | "ADVANCED";

// Product Related Enums
export type Badge =
  | "POPULAR"
  | "DISCOUNTED"
  | "WOMAN_OWNED"
  | "BEST_SELLER"
  | "TOP_RATED"
  | "COMMUNITY_FAVORITE"
  | "LIMITED_TIME_OFFER"
  | "FLASH_SALE"
  | "BEST_VALUE"
  | "HANDMADE"
  | "SUSTAINABLE"
  | "SUPPORTS_CAUSE"
  | "FAMILY_BUSINESS"
  | "CHARITY_SUPPORT"
  | "LIMITED_STOCK"
  | "SEASONAL"
  | "FREE_SHIPPING"
  | "FOR_REPAIR"
  | "REFURBISHED"
  | "EXCHANGEABLE"
  | "LAST_PRICE"
  | "FOR_GIFT"
  | "OPEN_TO_OFFERS"
  | "OPEN_BOX"
  | "CRUELTY_FREE"
  | "DELIVERED_TO_HOME"
  | "IN_HOUSE_PICKUP"
  | "IN_MID_POINT_PICKUP";

export type ProductCondition = "NEW" | "OPEN_BOX" | "LIKE_NEW" | "FAIR" | "POOR" | "FOR_PARTS" | "REFURBISHED";

export type WeightUnit = "KG" | "LB" | "OZ" | "G";
export type ProductSize = "XS" | "S" | "M" | "L" | "XL";

// Transaction and Order Related Enums
export type TransactionKind =
  | "PURCHASE"
  | "SELL"
  | "STOREPURCHASE"
  | "EXCHANGE"
  | "RECYCLE"
  | "REPAIR"
  | "ATTENDTOWORKSHOP"
  | "ATTENDTOEVENT";
export type ShippingStage = "PREPARING" | "SHIPPED" | "DELIVERED" | "RETURNED" | "CANCELED";
export type ExchangeStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED" | "CANCELLED";

// Payment Related Enums
export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "EXPIRED";
export type RefundStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type PaymentEnvironment = "SANDBOX" | "PRODUCTION";
export type ChileanPaymentProvider = "KHIPU" | "WEBPAY";
export type PaymentType = "ORDER" | "QUOTATION";

// Service Related Enums
export type ServicePricing = "FIXED" | "QUOTATION" | "HOURLY" | "PACKAGE";
export type QuotationStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED" | "CANCELLED" | "EXPIRED";

// Notification Related Enums
export type NotificationType =
  | "ORDER_RECEIVED"
  | "ORDER_CONFIRMED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED"
  | "QUOTATION_REQUEST"
  | "QUOTATION_RECEIVED"
  | "QUOTATION_ACCEPTED"
  | "QUOTATION_DECLINED"
  | "EXCHANGE_PROPOSAL"
  | "EXCHANGE_ACCEPTED"
  | "EXCHANGE_DECLINED"
  | "EXCHANGE_COMPLETED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_FAILED"
  | "PAYMENT_REFUNDED"
  | "REVIEW_RECEIVED"
  | "MESSAGE_RECEIVED"
  | "PRODUCT_LIKED"
  | "PRODUCT_COMMENTED"
  | "SYSTEM_ANNOUNCEMENT"
  | "ACCOUNT_VERIFICATION"
  | "PROFILE_UPDATED";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// Blog Related Enums
export enum BlogCategory {
  RECYCLING = "RECYCLING",
  POLLUTION = "POLLUTION",
  SUSTAINABILITY = "SUSTAINABILITY",
  CIRCULAR_ECONOMY = "CIRCULAR_ECONOMY",
  USED_PRODUCTS = "USED_PRODUCTS",
  REUSE = "REUSE",
  ENVIRONMENT = "ENVIRONMENT",
  UPCYCLING = "UPCYCLING",
  RESPONSIBLE_CONSUMPTION = "RESPONSIBLE_CONSUMPTION",
  ECO_TIPS = "ECO_TIPS",
  ENVIRONMENTAL_IMPACT = "ENVIRONMENTAL_IMPACT",
  SUSTAINABLE_LIVING = "SUSTAINABLE_LIVING",
  OTHER = "OTHER",
  SECURITY = "SECURITY",
}
