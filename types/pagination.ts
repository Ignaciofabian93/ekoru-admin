// Pagination Types
export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

// Generic Connection type
export type Connection<T> = {
  nodes: T[];
  pageInfo: PageInfo;
};

// Import necessary types for the specific connections
import type { Country, Region, City, County } from "./location";
import type { Admin } from "./user";
import type { BlogPost, CommunityPost, CommunityComment } from "./blog";
import type {
  Product,
  MaterialImpactEstimate,
  Co2ImpactMessage,
  WaterImpactMessage,
  StoreProduct,
  StoreProductMaterial,
  ProductCategoryMaterial,
} from "./product";
import type { CountryConfig } from "./user";

// Specific connection types
export type CountriesConnection = Connection<Country>;
export type RegionsConnection = Connection<Region>;
export type CitiesConnection = Connection<City>;
export type CountiesConnection = Connection<County>;

export type AdminsConnection = Connection<Admin>;

export type BlogPostsConnection = Connection<BlogPost>;

export type ProductsConnection = Connection<Product>;

export type CommunityPostsConnection = Connection<CommunityPost>;
export type CommunityCommentsConnection = Connection<CommunityComment>;

export type StoreProductsConnection = Connection<StoreProduct>;

export type MaterialImpactEstimatesConnection = Connection<MaterialImpactEstimate>;
export type Co2ImpactMessagesConnection = Connection<Co2ImpactMessage>;
export type WaterImpactMessagesConnection = Connection<WaterImpactMessage>;

export type StoreProductMaterialsConnection = Connection<StoreProductMaterial>;
export type ProductCategoryMaterialsConnection = Connection<ProductCategoryMaterial>;

export type CountryConfigsConnection = Connection<CountryConfig>;

// Pagination input types
export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

// Helper function type for calculating pagination info
export type PaginationCalculator = (totalCount: number, page: number, pageSize: number) => PageInfo;
