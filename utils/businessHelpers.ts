import { Seller, PersonProfile, BusinessProfile } from "@/types/user";
import { SellerType } from "@/types/enums";

/**
 * Type guards for different seller profiles
 */
export const isPersonProfile = (profile: PersonProfile | BusinessProfile): profile is PersonProfile => {
  return "firstName" in profile;
};

export const isBusinessProfile = (profile: PersonProfile | BusinessProfile): profile is BusinessProfile => {
  return "businessName" in profile;
};

/**
 * Check if a seller is a business
 */
export const isBusiness = (seller: Seller): boolean => {
  return seller.sellerType === "STARTUP" || seller.sellerType === "COMPANY";
};

/**
 * Get business name from any seller type
 */
export const getBusinessName = (seller: Seller): string => {
  const profile = seller.profile;

  if (isPersonProfile(profile)) {
    return profile.displayName || `${profile.firstName} ${profile.lastName || ""}`.trim();
  }

  if (isBusinessProfile(profile)) {
    return profile.businessName;
  }

  return "Unknown Business";
};

/**
 * Check if seller is fully verified
 */
export const isFullyVerified = (seller: Seller): boolean => {
  return seller.isVerified && seller.isActive;
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

  if (!seller.isActive) {
    missingVerifications.push("Account activation");
  }

  return {
    isFullyVerified: missingVerifications.length === 0,
    missingVerifications,
  };
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
