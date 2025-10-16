// Bulk Import Types

export type BulkImportError = {
  row: number;
  data: any;
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
