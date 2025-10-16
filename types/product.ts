import { type Badge, type ProductSize, type WeightUnit, type ProductCondition } from "./enums";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  hasOffer: boolean;
  offerPrice?: number | null;
  sellerId: string;
  badges: Badge[];
  brand: string;
  color?: string | null;
  createdAt: Date;
  images: string[];
  interests: string[];
  isActive: boolean;
  isExchangeable: boolean;
  productCategoryId: number;
  updatedAt: Date;
  condition: ProductCondition;
  conditionDescription?: string | null;
  deletedAt?: Date | null;
};

export type ProductVariant = {
  id: number;
  name: string;
  price: number;
  stock: number;
  color?: string | null;
  size?: string | null;
  createdAt: Date;
  updatedAt: Date;
  storeProductId: number;
};

export type ProductCategory = {
  id: number;
  departmentCategoryId: number;
  averageWeight?: number | null;
  keywords: string[];
  productCategoryName: string;
  size?: ProductSize | null;
  weightUnit?: WeightUnit | null;
};

export type ProductCategoryMaterial = {
  id: number;
  productCategoryId: number;
  materialTypeId: number;
  quantity: number;
  unit: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DepartmentCategory = {
  id: number;
  departmentId: number;
  departmentCategoryName: string;
};

export type Department = {
  id: number;
  departmentName: string;
  departmentImage?: string | null;
};

export type MaterialImpactEstimate = {
  id: number;
  materialType: string;
  estimatedCo2SavingsKG: number;
  estimatedWaterSavingsLT: number;
};

export type Co2ImpactMessage = {
  id: number;
  min: number;
  max: number;
  message1: string;
  message2: string;
  message3: string;
};

export type WaterImpactMessage = {
  id: number;
  min: number;
  max: number;
  message1: string;
  message2: string;
  message3: string;
};

export type StoreCategory = {
  id: number;
  category: string;
};

export type StoreSubCategory = {
  id: number;
  subCategory: string;
  storeCategoryId: number;
};

export type StoreProduct = {
  id: number;
  name: string;
  description: string;
  stock: number;
  barcode?: string | null;
  sku?: string | null;
  price: number;
  hasOffer: boolean;
  offerPrice?: number | null;
  sellerId: string;
  createdAt: Date;
  images: string[];
  isActive: boolean;
  updatedAt: Date;
  badges: Badge[];
  brand?: string | null;
  color?: string | null;
  ratingCount: number;
  ratings: number;
  reviewsNumber: number;
  materialComposition?: string | null;
  recycledContent?: number | null;
  subcategoryId: number;
  deletedAt?: Date | null;
  sustainabilityScore?: number | null;
  carbonFootprint?: number | null;
};

export type StoreProductMaterial = {
  id: number;
  storeProductId: number;
  materialTypeId: number;
  quantity: number;
  unit: string;
  isPrimary: boolean;
  sourceMaterial?: string | null;
  isRecycled: boolean;
  recycledPercentage?: number | null;
  supplierVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
