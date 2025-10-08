import { Seller, StartupProfile, CompanyProfile, PersonProfile } from "@/types/user";
import { SellerType } from "@/types/enums";

/**
 * Type guards for different seller profiles
 */
export const isPersonProfile = (profile: PersonProfile | StartupProfile | CompanyProfile): profile is PersonProfile => {
  return profile.__typename === "PersonProfile";
};

export const isStartupProfile = (
  profile: PersonProfile | StartupProfile | CompanyProfile
): profile is StartupProfile => {
  return profile.__typename === "StartupProfile";
};

export const isCompanyProfile = (
  profile: PersonProfile | StartupProfile | CompanyProfile
): profile is CompanyProfile => {
  return profile.__typename === "CompanyProfile";
};

/**
 * Check if a seller is a business (startup or company)
 */
export const isBusiness = (seller: Seller): boolean => {
  return seller.sellerType === "STARTUP" || seller.sellerType === "COMPANY";
};

/**
 * Check if business has legal registration
 */
export const hasBusinessRegistration = (seller: Seller): boolean => {
  if (!isBusiness(seller)) return false;

  const profile = seller.profile;
  if (isStartupProfile(profile)) {
    return profile.hasBusinessRegistration;
  }
  if (isCompanyProfile(profile)) {
    return true; // Companies always have registration
  }
  return false;
};

/**
 * Get business name from any seller type
 */
export const getBusinessName = (seller: Seller): string => {
  const profile = seller.profile;

  if (isPersonProfile(profile)) {
    return profile.displayName || `${profile.firstName} ${profile.lastName || ""}`.trim();
  }

  if (isStartupProfile(profile) || isCompanyProfile(profile)) {
    return profile.displayName || profile.businessName;
  }

  return "Unknown Business";
};

/**
 * Check if seller is fully verified
 */
export const isFullyVerified = (seller: Seller): boolean => {
  if (!seller.isVerified) return false;

  const profile = seller.profile;

  if (isPersonProfile(profile)) {
    return true; // Person verification is handled at seller level
  }

  if (isStartupProfile(profile)) {
    return profile.identityVerified && profile.phoneVerified && profile.emailVerified;
  }

  if (isCompanyProfile(profile)) {
    return profile.documentsVerified && profile.identityVerified && profile.phoneVerified && profile.emailVerified;
  }

  return false;
};

/**
 * Get verification status details
 */
export const getVerificationStatus = (
  seller: Seller
): {
  isFullyVerified: boolean;
  missingVerifications: string[];
} => {
  const missingVerifications: string[] = [];

  if (!seller.isVerified) {
    missingVerifications.push("Account verification");
  }

  const profile = seller.profile;

  if (isStartupProfile(profile)) {
    if (!profile.identityVerified) missingVerifications.push("Identity verification");
    if (!profile.phoneVerified) missingVerifications.push("Phone verification");
    if (!profile.emailVerified) missingVerifications.push("Email verification");
  }

  if (isCompanyProfile(profile)) {
    if (!profile.documentsVerified) missingVerifications.push("Documents verification");
    if (!profile.identityVerified) missingVerifications.push("Identity verification");
    if (!profile.phoneVerified) missingVerifications.push("Phone verification");
    if (!profile.emailVerified) missingVerifications.push("Email verification");
  }

  return {
    isFullyVerified: missingVerifications.length === 0,
    missingVerifications,
  };
};

/**
 * Get Chilean company type label
 */
export const getCompanyTypeLabel = (companyType: CompanyProfile["companyType"]): string => {
  const labels: Record<CompanyProfile["companyType"], string> = {
    EMPRESA_INDIVIDUAL: "Empresa Individual",
    SPA: "Sociedad por Acciones (SpA)",
    LTDA: "Sociedad de Responsabilidad Limitada (Ltda.)",
    SA: "Sociedad Anónima (S.A.)",
    EIRL: "Empresa Individual de Responsabilidad Limitada (E.I.R.L.)",
    OTHER: "Otro tipo de empresa",
  };

  return labels[companyType];
};

/**
 * Check if startup should be promoted to company
 * Based on business maturity indicators
 */
export const shouldPromoteToCompany = (seller: Seller): boolean => {
  if (seller.sellerType !== "STARTUP") return false;

  const profile = seller.profile;
  if (!isStartupProfile(profile)) return false;

  // Suggest promotion if:
  // - Has business registration
  // - Has significant monthly orders (e.g., > 50)
  // - Has employees
  const hasRegistration = profile.hasBusinessRegistration;
  const hasSignificantOrders = (profile.monthlyOrdersCount || 0) > 50;
  const hasEmployees = (profile.employeeCount || 0) > 0;

  return hasRegistration && (hasSignificantOrders || hasEmployees);
};

/**
 * Get seller type label
 */
export const getSellerTypeLabel = (sellerType: SellerType): string => {
  const labels: Record<SellerType, string> = {
    PERSON: "Persona",
    STARTUP: "Emprendimiento",
    COMPANY: "Empresa",
  };

  return labels[sellerType];
};

/**
 * Validate RUT (Chilean tax ID)
 * Basic validation - you may want to add more sophisticated validation
 */
export const validateRUT = (rut: string): boolean => {
  // Remove dots and hyphens
  const cleanRUT = rut.replace(/\./g, "").replace(/-/g, "");

  // Check format: should be 8-9 digits followed by a check digit
  const rutRegex = /^(\d{7,8})([0-9Kk])$/;
  const match = cleanRUT.match(rutRegex);

  if (!match) return false;

  const digits = match[1];
  const checkDigit = match[2].toUpperCase();

  // Calculate check digit
  let sum = 0;
  let multiplier = 2;

  for (let i = digits.length - 1; i >= 0; i--) {
    sum += parseInt(digits[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const calculatedCheckDigit = 11 - (sum % 11);
  const expectedCheckDigit =
    calculatedCheckDigit === 11 ? "0" : calculatedCheckDigit === 10 ? "K" : calculatedCheckDigit.toString();

  return checkDigit === expectedCheckDigit;
};

/**
 * Format RUT for display
 */
export const formatRUT = (rut: string): string => {
  const cleanRUT = rut.replace(/\./g, "").replace(/-/g, "");
  const rutRegex = /^(\d{1,2})(\d{3})(\d{3})([0-9Kk])$/;
  const match = cleanRUT.match(rutRegex);

  if (!match) return rut;

  return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
};
