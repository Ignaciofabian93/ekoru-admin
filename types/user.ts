import { type AccountType, type ContactMethod, type SellerType } from "./enums";
import { City, Country, County, Region } from "./location";

export type AdminType = "PLATFORM" | "BUSINESS";

// Admin privilege categories for Ekoru platform
export type AdminPrivileges = {
  // User & Seller Management
  users: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    suspend: boolean;
    verify: boolean;
  };

  // Startup & Company Management
  businesses: {
    view: boolean;
    approve: boolean;
    reject: boolean;
    edit: boolean;
    suspend: boolean;
    verify: boolean;
    manageDocuments: boolean;
  };

  // Product Management
  products: {
    view: boolean;
    edit: boolean;
    delete: boolean;
    feature: boolean;
    moderate: boolean;
  };

  // Order & Transaction Management
  orders: {
    view: boolean;
    modify: boolean;
    refund: boolean;
    cancel: boolean;
  };

  // Content Moderation
  content: {
    viewReports: boolean;
    moderate: boolean;
    removePosts: boolean;
    banUsers: boolean;
  };

  // Analytics & Reports
  analytics: {
    viewDashboard: boolean;
    viewReports: boolean;
    exportData: boolean;
  };

  // System Settings
  system: {
    manageCategories: boolean;
    managePromotions: boolean;
    manageBadges: boolean;
    configureSettings: boolean;
    manageAdmins: boolean;
  };

  // Financial
  financial: {
    viewTransactions: boolean;
    processPayouts: boolean;
    managePaymentMethods: boolean;
    viewRevenue: boolean;
  };

  // Support
  support: {
    viewTickets: boolean;
    respondToTickets: boolean;
    escalateTickets: boolean;
  };
};

// Admin role with predefined privilege sets
export enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN", // Full access to everything
  ADMIN = "ADMIN", // Most features, limited system settings
  MODERATOR = "MODERATOR", // Content moderation and user management
  SUPPORT = "SUPPORT", // Support tickets and basic user assistance
  ANALYST = "ANALYST", // Analytics and reports only
  FINANCE = "FINANCE", // Financial operations
}

// Predefined privilege sets for each role
export const ROLE_PRIVILEGES: Record<AdminRole, AdminPrivileges> = {
  [AdminRole.SUPER_ADMIN]: {
    users: { view: true, create: true, edit: true, delete: true, suspend: true, verify: true },
    businesses: {
      view: true,
      approve: true,
      reject: true,
      edit: true,
      suspend: true,
      verify: true,
      manageDocuments: true,
    },
    products: { view: true, edit: true, delete: true, feature: true, moderate: true },
    orders: { view: true, modify: true, refund: true, cancel: true },
    content: { viewReports: true, moderate: true, removePosts: true, banUsers: true },
    analytics: { viewDashboard: true, viewReports: true, exportData: true },
    system: {
      manageCategories: true,
      managePromotions: true,
      manageBadges: true,
      configureSettings: true,
      manageAdmins: true,
    },
    financial: { viewTransactions: true, processPayouts: true, managePaymentMethods: true, viewRevenue: true },
    support: { viewTickets: true, respondToTickets: true, escalateTickets: true },
  },
  [AdminRole.ADMIN]: {
    users: { view: true, create: true, edit: true, delete: false, suspend: true, verify: true },
    businesses: {
      view: true,
      approve: true,
      reject: true,
      edit: true,
      suspend: true,
      verify: true,
      manageDocuments: true,
    },
    products: { view: true, edit: true, delete: true, feature: true, moderate: true },
    orders: { view: true, modify: true, refund: true, cancel: true },
    content: { viewReports: true, moderate: true, removePosts: true, banUsers: true },
    analytics: { viewDashboard: true, viewReports: true, exportData: true },
    system: {
      manageCategories: true,
      managePromotions: true,
      manageBadges: true,
      configureSettings: false,
      manageAdmins: false,
    },
    financial: { viewTransactions: true, processPayouts: true, managePaymentMethods: false, viewRevenue: true },
    support: { viewTickets: true, respondToTickets: true, escalateTickets: true },
  },
  [AdminRole.MODERATOR]: {
    users: { view: true, create: false, edit: true, delete: false, suspend: true, verify: false },
    businesses: {
      view: true,
      approve: false,
      reject: false,
      edit: false,
      suspend: true,
      verify: false,
      manageDocuments: false,
    },
    products: { view: true, edit: true, delete: false, feature: false, moderate: true },
    orders: { view: true, modify: false, refund: false, cancel: false },
    content: { viewReports: true, moderate: true, removePosts: true, banUsers: false },
    analytics: { viewDashboard: true, viewReports: false, exportData: false },
    system: {
      manageCategories: false,
      managePromotions: false,
      manageBadges: false,
      configureSettings: false,
      manageAdmins: false,
    },
    financial: { viewTransactions: false, processPayouts: false, managePaymentMethods: false, viewRevenue: false },
    support: { viewTickets: true, respondToTickets: true, escalateTickets: true },
  },
  [AdminRole.SUPPORT]: {
    users: { view: true, create: false, edit: false, delete: false, suspend: false, verify: false },
    businesses: {
      view: true,
      approve: false,
      reject: false,
      edit: false,
      suspend: false,
      verify: false,
      manageDocuments: false,
    },
    products: { view: true, edit: false, delete: false, feature: false, moderate: false },
    orders: { view: true, modify: false, refund: false, cancel: false },
    content: { viewReports: true, moderate: false, removePosts: false, banUsers: false },
    analytics: { viewDashboard: false, viewReports: false, exportData: false },
    system: {
      manageCategories: false,
      managePromotions: false,
      manageBadges: false,
      configureSettings: false,
      manageAdmins: false,
    },
    financial: { viewTransactions: false, processPayouts: false, managePaymentMethods: false, viewRevenue: false },
    support: { viewTickets: true, respondToTickets: true, escalateTickets: false },
  },
  [AdminRole.ANALYST]: {
    users: { view: true, create: false, edit: false, delete: false, suspend: false, verify: false },
    businesses: {
      view: true,
      approve: false,
      reject: false,
      edit: false,
      suspend: false,
      verify: false,
      manageDocuments: false,
    },
    products: { view: true, edit: false, delete: false, feature: false, moderate: false },
    orders: { view: true, modify: false, refund: false, cancel: false },
    content: { viewReports: true, moderate: false, removePosts: false, banUsers: false },
    analytics: { viewDashboard: true, viewReports: true, exportData: true },
    system: {
      manageCategories: false,
      managePromotions: false,
      manageBadges: false,
      configureSettings: false,
      manageAdmins: false,
    },
    financial: { viewTransactions: true, processPayouts: false, managePaymentMethods: false, viewRevenue: true },
    support: { viewTickets: false, respondToTickets: false, escalateTickets: false },
  },
  [AdminRole.FINANCE]: {
    users: { view: true, create: false, edit: false, delete: false, suspend: false, verify: false },
    businesses: {
      view: true,
      approve: false,
      reject: false,
      edit: false,
      suspend: false,
      verify: false,
      manageDocuments: false,
    },
    products: { view: true, edit: false, delete: false, feature: false, moderate: false },
    orders: { view: true, modify: false, refund: true, cancel: false },
    content: { viewReports: false, moderate: false, removePosts: false, banUsers: false },
    analytics: { viewDashboard: true, viewReports: true, exportData: true },
    system: {
      manageCategories: false,
      managePromotions: false,
      manageBadges: false,
      configureSettings: false,
      manageAdmins: false,
    },
    financial: { viewTransactions: true, processPayouts: true, managePaymentMethods: true, viewRevenue: true },
    support: { viewTickets: true, respondToTickets: false, escalateTickets: false },
  },
};

export type Admin = {
  id: string;
  email: string;
  password: string;
  name: string;
  lastName?: string;
  adminType: AdminType;
  role: AdminRole;
  privileges: AdminPrivileges;
  isActive: boolean;
  profileImage?: string;
  phone?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;

  // Audit trail
  createdBy?: string; // ID of the admin who created this account
  notes?: string; // Internal notes about this admin
};

export type Seller = {
  id: string;
  email: string;
  password: string;
  sellerType: SellerType;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: PersonProfile | StartupProfile | CompanyProfile;

  // Location information
  address: string;
  cityId?: number;
  countryId?: number;
  countyId?: number;
  regionId?: number;

  // Contact information
  phone: string;
  website?: string;
  preferredContactMethod: ContactMethod;

  // Social media links
  socialMediaLinks?: Record<string, string>; // {instagram: "url", facebook: "url", etc}

  // Business/Account information
  accountType: AccountType;
  points: number;
  userCategoryId?: number;
  county: County | null;
  region: Region | null;
  country: Country | null;
  city: City | null;
  userCategory?: UserCategory | null;
};

// Base fields shared by all business entities (Startups and Companies)
export type BusinessEntityBase = {
  businessName: string;
  displayName?: string; // Custom display name
  description?: string;
  logo?: string;
  coverImage?: string;

  // Business settings
  allowExchanges: boolean;
  minOrderAmount?: number; // Minimum order amount in cents
  shippingPolicy?: string;
  returnPolicy?: string;

  // Business hours
  businessHours?: Record<string, { open: string; close: string }>; // {monday: {open: "9:00", close: "17:00"}, etc}
};

export type PersonProfile = {
  __typename: "PersonProfile";
  id: string;
  sellerId: string;
  firstName: string;
  lastName?: string;
  displayName?: string; // Custom display name
  bio?: string;
  birthday?: string;
  profileImage?: string;
  coverImage?: string;

  // Person-specific preferences
  allowExchanges: boolean;
};

// Startups: Small businesses, often Instagram-based, without formal registration
// Common in Chile: emprendimientos, negocios de Instagram
export type StartupProfile = BusinessEntityBase & {
  __typename: "StartupProfile";
  id: string;
  sellerId: string;

  // Business type
  businessType?: string; // "retail", "handmade", "resale", "services", etc.

  // Legal registration (optional for startups)
  hasBusinessRegistration: boolean; // Has "Inicio de Actividades" from SII
  businessRegistrationNumber?: string; // RUT or "Inicio de Actividades" number
  taxId?: string; // RUT (Rol Único Tributario) if registered

  // Startup-specific fields
  founderName?: string; // Name of the founder/owner
  yearStarted?: number; // Year the business started
  isHomeBasedBusiness: boolean; // Operating from home
  employeeCount?: number; // Number of employees (usually 0-10 for startups)

  // Social media focus (important for Instagram businesses)
  primarySocialPlatform?: "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "WHATSAPP" | "OTHER";

  // Verification status
  identityVerified: boolean; // Owner identity verified
  phoneVerified: boolean;
  emailVerified: boolean;

  // Business maturity
  monthlyOrdersCount?: number; // Track business activity
  rating?: number; // 0-5 rating
  reviewsCount?: number;
};

// Companies: Formally registered businesses with complete legal documentation
// Chilean companies with "Inicio de Actividades" and RUT
export type CompanyProfile = BusinessEntityBase & {
  __typename: "CompanyProfile";
  id: string;
  sellerId: string;

  // Business type
  businessType?: string; // "retail", "manufacturer", "services", "wholesale", etc.
  industryCategory?: string; // Industry classification

  // Legal registration (required for companies)
  hasBusinessRegistration: true; // Always true for companies
  businessRegistrationNumber: string; // "Inicio de Actividades" number
  taxId: string; // RUT (Rol Único Tributario) - required
  legalBusinessName: string; // Official registered business name

  // Chilean company structure
  companyType: "EMPRESA_INDIVIDUAL" | "SPA" | "LTDA" | "SA" | "EIRL" | "OTHER"; // Chilean company types
  /*
    EMPRESA_INDIVIDUAL: Individual business
    SPA: Sociedad por Acciones (Simplified Stock Company)
    LTDA: Sociedad de Responsabilidad Limitada (Limited Liability Company)
    SA: Sociedad Anónima (Stock Company)
    EIRL: Empresa Individual de Responsabilidad Limitada (Individual Limited Liability Company)
  */

  registrationDate?: string; // Date of "Inicio de Actividades"

  // Business details
  legalRepresentative?: string; // Legal representative name
  employeeCount?: number; // Number of employees
  yearFounded?: number; // Year the company was founded

  // Additional legal documents
  businessLicense?: string; // Patente Municipal
  chamberOfCommerceRegistration?: string; // Registro Cámara de Comercio

  // Financial information
  bankAccount?: {
    bankName: string;
    accountType: "CHECKING" | "SAVINGS"; // Cuenta Corriente or Cuenta de Ahorro
    accountNumber: string;
    accountHolderName: string;
  };

  // Verification
  documentsVerified: boolean; // All legal documents verified
  identityVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;

  // Business metrics
  monthlyOrdersCount?: number;
  rating?: number; // 0-5 rating
  reviewsCount?: number;
  annualRevenue?: number; // Optional for larger companies
};

export type UserCategory = {
  id: number;
  name: string;
  level: number;
  categoryDiscountAmount: number;
  pointsThreshold: number;
};

export type Session = {
  id: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  sellerId: string; // Changed from userId to sellerId
};
