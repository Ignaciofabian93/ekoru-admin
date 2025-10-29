import {
  type ContactMethod,
  type SellerType,
  type AdminRole,
  type AdminPermission,
  type AdminType,
  type BusinessType,
  type PersonSubscriptionPlan,
  type BusinessSubscriptionPlan,
} from "./enums";
import { City, Country, County, Region } from "./location";

// Admin Types
export type Admin = {
  id: string;
  email: string;
  password: string;
  name: string;
  lastName?: string | null;
  adminType: AdminType;
  role: AdminRole;
  permissions: AdminPermission[];
  sellerId?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  accountLocked: boolean;
  loginAttempts: number;
  lastLoginAt?: Date | null;
  lastLoginIp?: string | null;
  createdAt: Date;
  updatedAt: Date;
  cityId?: number | null;
  countryId?: number | null;
  countyId?: number | null;
  regionId?: number | null;
  country?: Country | null;
  region?: Region | null;
  city?: City | null;
  county?: County | null;
};

export type AdminActivityLog = {
  id: number;
  adminId: string;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  changes?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: string | null;
  createdAt: Date;
};

// Seller Types
export type Seller = {
  id: string;
  email: string;
  password: string;
  sellerType: SellerType;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  address?: string | null;
  cityId?: number | null;
  countryId?: number | null;
  countyId?: number | null;
  regionId?: number | null;
  phone?: string | null;
  website?: string | null;
  preferredContactMethod?: ContactMethod | null;
  socialMediaLinks?: string | null;
  points: number;
  sellerLevelId?: number | null;
  profile: PersonProfile | BusinessProfile;
};

export type SellerPreferences = {
  id: number;
  sellerId: string;
  preferredLanguage?: string | null;
  currency?: string | null;
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  communityUpdates: boolean;
  securityAlerts: boolean;
  weeklySummary: boolean;
  twoFactorAuth: boolean;
};

export type PersonProfile = {
  id: string;
  sellerId: string;
  firstName: string;
  lastName?: string | null;
  displayName?: string | null;
  bio?: string | null;
  birthday?: Date | null;
  profileImage?: string | null;
  coverImage?: string | null;
  allowExchanges: boolean;
  personMembershipId?: number | null;
};

export type BusinessProfile = {
  id: string;
  sellerId: string;
  businessName: string;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  businessType: BusinessType;
  legalBusinessName?: string | null;
  taxId?: string | null;
  businessStartDate?: Date | null;
  legalRepresentative?: string | null;
  legalRepresentativeTaxId?: string | null;
  shippingPolicy?: string | null;
  returnPolicy?: string | null;
  serviceArea?: string | null;
  yearsOfExperience?: number | null;
  certifications: string[];
  travelRadius?: number | null;
  businessHours?: string | null;
  businessMembershipId?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

// Seller Gamification Types
export type SellerLabel = {
  id: number;
  labelName: string;
  transactionKind: string;
  transactionsRequired: number;
  description?: string | null;
  badgeIcon?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SellerAchievedLabel = {
  id: number;
  sellerId: string;
  labelId: number;
  achievedAt: Date;
  currentCount?: number | null;
};

export type PointsByTransactionKind = {
  id: number;
  transactionKind: string;
  pointsAwarded: number;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SellerLevel = {
  id: number;
  levelName: string;
  minPoints: number;
  maxPoints?: number | null;
  benefits?: string | null;
  badgeIcon?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Membership Types
export type PersonMembership = {
  id: number;
  membershipType: PersonSubscriptionPlan;
  price: number;
  description: string[];
  durationMonths: number;
  startDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BusinessMembership = {
  id: number;
  membershipType: BusinessSubscriptionPlan;
  price: number;
  description: string[];
  durationMonths: number;
  startDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionFee = {
  id: number;
  sellerTypeFee: SellerType;
  feePercentage: number;
  description: string;
};

export type CountryConfig = {
  id: number;
  countryId: number;
  countryCode: string;
  currencyCode: string;
  currencySymbol: string;
  taxIdLabel: string;
  taxIdFormat?: string | null;
  defaultTimezone: string;
  defaultLocale: string;
  isActive: boolean;
  phonePrefix: string;
  availablePaymentProviders: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Session Types
export type Session = {
  id: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  sellerId: string;
};

// Input Types for Registration
export type RegisterAdminInput = {
  email: string;
  name: string;
  password: string;
  lastName?: string;
  role: AdminRole;
  adminType?: AdminType;
  permissions?: AdminPermission[];
  sellerId?: string;
  cityId?: number;
  countryId?: number;
  countyId?: number;
  regionId?: number;
};

export type RegisterPersonInput = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  birthday?: Date;
  address?: string;
  cityId?: number;
  countyId?: number;
  regionId?: number;
  countryId?: number;
  phone?: string;
  website?: string;
  preferredContactMethod?: ContactMethod;
  allowExchanges?: boolean;
};

export type RegisterBusinessInput = {
  email: string;
  password: string;
  businessName: string;
  displayName?: string;
  description?: string;
  businessType: BusinessType;
  legalBusinessName?: string;
  taxId?: string;
  businessActivity?: string;
  address?: string;
  cityId?: number;
  countyId?: number;
  regionId?: number;
  countryId?: number;
  phone?: string;
  website?: string;
  preferredContactMethod?: ContactMethod;
  minOrderAmount?: number;
  shippingPolicy?: string;
  returnPolicy?: string;
  serviceArea?: string;
  yearsOfExperience?: number;
  licenseNumber?: string;
  insuranceInfo?: string;
  certifications?: string[];
  emergencyService?: boolean;
  travelRadius?: number;
};
