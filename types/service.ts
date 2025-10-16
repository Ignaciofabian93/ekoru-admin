import { type ServicePricing, type QuotationStatus } from "./enums";

export type ServiceCategory = {
  id: number;
  category: string;
};

export type ServiceSubCategory = {
  id: number;
  subCategory: string;
  serviceCategoryId: number;
};

export type Service = {
  id: number;
  name: string;
  description?: string | null;
  sellerId: string;
  pricingType: ServicePricing;
  basePrice?: number | null;
  priceRange?: string | null;
  duration?: number | null;
  isActive: boolean;
  images: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  subcategoryId: number;
};

export type Quotation = {
  id: number;
  serviceId: number;
  clientId: string;
  providerId: string;
  title: string;
  description: string;
  estimatedPrice?: number | null;
  finalPrice?: number | null;
  estimatedDuration?: number | null;
  status: QuotationStatus;
  clientNotes?: string | null;
  providerNotes?: string | null;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
  acceptedAt?: Date | null;
  completedAt?: Date | null;
};

export type ServiceReview = {
  id: number;
  serviceId: number;
  reviewerId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
};
