import { type Badge, type ProductSize, type WeightUnit } from "./enums";
import { ProductComment, ProductLike } from "./product-interaction";
import { User } from "./user";

type MaterialType = {
  id: string;
  materialType: string;
  estimatedCo2SavingsKG: number;
  estimatedWaterSavingsLT: number;
};

export type Product = {
  __typename: "Product";
  id: number;
  sku?: string;
  barcode?: string;
  color?: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  hasOffer: boolean;
  offerPrice: number;
  stock: number;
  isExchangeable: boolean;
  interests: string[];
  isActive: boolean;
  ratings: number;
  ratingCount: number;
  reviewsNumber: number;
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
  productCategoryId: number;
  userId: string;
  user?: User;
  productCategory: ProductCategory;
  comments?: ProductComment[];
  likes?: ProductLike[];
};

export type ProductCategory = {
  __typename: "ProductCategory";
  id: number;
  productCategoryName: string;
  departmentCategoryId: number;
  keywords: string[];
  size: ProductSize;
  weightUnit: WeightUnit;
  averageWeight: number;
  firstMaterialType: MaterialType | null;
  secondMaterialType: MaterialType | null;
  thirdMaterialType: MaterialType | null;
  fourthMaterialType: MaterialType | null;
  fifthMaterialType: MaterialType | null;
  firstMaterialTypeId: number | null;
  firstMaterialTypeQuantity: number | null;
  secondMaterialTypeId: number | null;
  secondMaterialTypeQuantity: number | null;
  thirdMaterialTypeId: number | null;
  thirdMaterialTypeQuantity: number | null;
  fourthMaterialTypeId: number | null;
  fourthMaterialTypeQuantity: number | null;
  fifthMaterialTypeId: number | null;
  fifthMaterialTypeQuantity: number | null;
  products: Product[];
};

export type MaterialImpactEstimate = {
  id: number;
  materialType: string;
  estimatedCo2SavingsKG: number;
  estimatedWaterSavingsLT: number;
};

export type DepartmentCategory = {
  __typename: "DepartmentCategory";
  id: number;
  departmentCategoryName: string;
  departmentId: number;
  department: Department;
  productCategories: ProductCategory[];
};

export type Department = {
  __typename: "Department";
  id: number;
  departmentName: string;
  departmentCategories: DepartmentCategory[];
};
