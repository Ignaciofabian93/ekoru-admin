// Bulk Import Types

export type BulkImportError = {
  row: number;
  data: string;
  error: string;
};

export type BulkImportResult = {
  success: boolean;
  created: number;
  failed: number;
  errors: BulkImportError[];
};

// Bulk Location Import Input Types
export type BulkCountryInput = {
  country: string;
};

export type BulkRegionInput = {
  region: string;
  countryId: number;
};

export type BulkCityInput = {
  city: string;
  regionId: number;
};

export type BulkCountyInput = {
  county: string;
  cityId: number;
};

// Bulk Product Import Input Types
export type BulkDepartmentInput = {
  departmentName: string;
  departmentImage?: string;
};

export type BulkDepartmentCategoryInput = {
  departmentCategoryName: string;
  departmentId: number;
};

export type BulkProductCategoryInput = {
  productCategoryName: string;
  departmentCategoryId: number;
  keywords?: string[];
  averageWeight?: number;
  size?: string;
  weightUnit?: string;
};

export type BulkProductInput = {
  name: string;
  description: string;
  price: number;
  hasOffer?: boolean;
  offerPrice?: number;
  brand: string;
  color?: string;
  images?: string[];
  interests?: string[];
  isActive?: boolean;
  isExchangeable?: boolean;
  productCategoryId: number;
  condition?: string;
  conditionDescription?: string;
  sellerId: string;
};
