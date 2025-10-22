import { gql, DocumentNode } from "@apollo/client";

// Map table names to their GraphQL create mutations
export const CREATE_MUTATIONS: Record<string, DocumentNode> = {
  // Location
  Country: gql`
    mutation CreateCountry($input: CreateCountryInput!) {
      createCountry(input: $input) {
        id
        country
      }
    }
  `,

  Region: gql`
    mutation CreateRegion($input: CreateRegionInput!) {
      createRegion(input: $input) {
        id
        region
        countryId
      }
    }
  `,

  City: gql`
    mutation CreateCity($input: CreateCityInput!) {
      createCity(input: $input) {
        id
        city
        regionId
      }
    }
  `,

  County: gql`
    mutation CreateCounty($input: CreateCountyInput!) {
      createCounty(input: $input) {
        id
        county
        cityId
      }
    }
  `,

  // Catalog
  Departments: gql`
    mutation CreateDepartment($input: CreateDepartmentInput!) {
      createDepartment(input: $input) {
        id
        departmentName
        departmentImage
      }
    }
  `,

  DepartmentCategory: gql`
    mutation CreateDepartmentCategory($input: CreateDepartmentCategoryInput!) {
      createDepartmentCategory(input: $input) {
        id
        departmentCategoryName
        departmentId
      }
    }
  `,

  ProductCategory: gql`
    mutation CreateProductCategory($input: CreateProductCategoryInput!) {
      createProductCategory(input: $input) {
        id
        productCategoryName
        departmentCategoryId
        keywords
        averageWeight
        size
        weightUnit
      }
    }
  `,

  // Seller Management
  SellerCategory: gql`
    mutation CreateSellerCategory($input: CreateSellerCategoryInput!) {
      createSellerCategory(input: $input) {
        id
        name
        categoryDiscountAmount
        pointsThreshold
        level
      }
    }
  `,

  SellerLevels: gql`
    mutation createSellerLevel($input: CreateSellerLevelInput!) {
      createSellerLevel(input: $input) {
        id
        levelName
        minPoints
        maxPoints
        benefits
        badgeIcon
        createdAt
        updatedAt
      }
    }
  `,

  // Services
  ServiceCategory: gql`
    mutation CreateServiceCategory($input: CreateServiceCategoryInput!) {
      createServiceCategory(input: $input) {
        id
        category
      }
    }
  `,

  ServiceSubCategory: gql`
    mutation CreateServiceSubCategory($input: CreateServiceSubCategoryInput!) {
      createServiceSubCategory(input: $input) {
        id
        subcategory
        serviceCategoryId
      }
    }
  `,

  // Store
  StoreCategory: gql`
    mutation CreateStoreCategory($input: CreateStoreCategoryInput!) {
      createStoreCategory(input: $input) {
        id
        name
      }
    }
  `,

  StoreSubCategory: gql`
    mutation CreateStoreSubCategory($input: CreateStoreSubCategoryInput!) {
      createStoreSubCategory(input: $input) {
        id
        name
        storeCategoryId
      }
    }
  `,

  // Community
  CommunityCategory: gql`
    mutation CreateCommunityCategory($input: CreateCommunityCategoryInput!) {
      createCommunityCategory(input: $input) {
        id
        name
      }
    }
  `,

  CommunitySubCategory: gql`
    mutation CreateCommunitySubCategory($input: CreateCommunitySubCategoryInput!) {
      createCommunitySubCategory(input: $input) {
        id
        name
        communityCategoryId
      }
    }
  `,

  // Sustainability
  MaterialImpactEstimate: gql`
    mutation CreateMaterialImpactEstimate($input: CreateMaterialImpactEstimateInput!) {
      createMaterialImpactEstimate(input: $input) {
        id
        materialType
        estimatedCo2SavingsKG
        estimatedWaterSavingsLT
      }
    }
  `,

  Co2ImpactMessage: gql`
    mutation CreateCo2ImpactMessage($input: CreateCo2ImpactMessageInput!) {
      createCo2ImpactMessage(input: $input) {
        id
        min
        max
        message1
        message2
        message3
      }
    }
  `,

  WaterImpactMessage: gql`
    mutation CreateWaterImpactMessage($input: CreateWaterImpactMessageInput!) {
      createWaterImpactMessage(input: $input) {
        id
        min
        max
        message1
        message2
        message3
      }
    }
  `,

  // Other
  ShippingStatus: gql`
    mutation CreateShippingStatus($input: CreateShippingStatusInput!) {
      createShippingStatus(input: $input) {
        id
        status
      }
    }
  `,

  BlogPost: gql`
    mutation CreateBlogPost($input: CreateBlogPostInput!) {
      createBlogPost(input: $input) {
        id
        title
        content
        category
        isPublished
        publishedAt
        createdAt
        updatedAt
      }
    }
  `,

  NotificationTemplate: gql`
    mutation CreateNotificationTemplate($input: CreateNotificationTemplateInput!) {
      createNotificationTemplate(input: $input) {
        id
        type
        title
        message
        isActive
        createdAt
        updatedAt
      }
    }
  `,
};

// Helper function to get mutation for a table
export const getCreateMutation = (tableName: string): DocumentNode | null => {
  return CREATE_MUTATIONS[tableName] || null;
};

// Helper function to check if table has a create mutation
export const hasCreateMutation = (tableName: string): boolean => {
  return tableName in CREATE_MUTATIONS;
};

// ===========================
// UPDATE MUTATIONS
// ===========================

export const UPDATE_MUTATIONS: Record<string, DocumentNode> = {
  // Location
  Country: gql`
    mutation UpdateCountry($id: ID!, $input: UpdateCountryInput!) {
      updateCountry(id: $id, input: $input) {
        id
        country
      }
    }
  `,

  Region: gql`
    mutation UpdateRegion($id: ID!, $input: UpdateRegionInput!) {
      updateRegion(id: $id, input: $input) {
        id
        region
        countryId
      }
    }
  `,

  City: gql`
    mutation UpdateCity($id: ID!, $input: UpdateCityInput!) {
      updateCity(id: $id, input: $input) {
        id
        city
        regionId
      }
    }
  `,

  County: gql`
    mutation UpdateCounty($id: ID!, $input: UpdateCountyInput!) {
      updateCounty(id: $id, input: $input) {
        id
        county
        cityId
      }
    }
  `,

  // Catalog
  Departments: gql`
    mutation UpdateDepartment($id: ID!, $input: UpdateDepartmentInput!) {
      updateDepartment(id: $id, input: $input) {
        id
        departmentName
        departmentImage
      }
    }
  `,

  DepartmentCategory: gql`
    mutation UpdateDepartmentCategory($id: ID!, $input: UpdateDepartmentCategoryInput!) {
      updateDepartmentCategory(id: $id, input: $input) {
        id
        departmentCategoryName
        departmentId
      }
    }
  `,

  ProductCategory: gql`
    mutation UpdateProductCategory($id: ID!, $input: UpdateProductCategoryInput!) {
      updateProductCategory(id: $id, input: $input) {
        id
        productCategoryName
        departmentCategoryId
        keywords
        averageWeight
        size
        weightUnit
      }
    }
  `,

  // Seller Management
  SellerCategory: gql`
    mutation UpdateSellerCategory($id: ID!, $input: UpdateSellerCategoryInput!) {
      updateSellerCategory(id: $id, input: $input) {
        id
        name
        categoryDiscountAmount
        pointsThreshold
        level
      }
    }
  `,

  SellerLevels: gql`
    mutation UpdateSellerLevel($id: ID!, $input: UpdateSellerLevelInput!) {
      updateSellerLevel(id: $id, input: $input) {
        id
        levelName
        minPoints
        maxPoints
        benefits
        badgeIcon
        createdAt
        updatedAt
      }
    }
  `,

  // Services
  ServiceCategory: gql`
    mutation UpdateServiceCategory($id: ID!, $input: UpdateServiceCategoryInput!) {
      updateServiceCategory(id: $id, input: $input) {
        id
        category
      }
    }
  `,

  ServiceSubCategory: gql`
    mutation UpdateServiceSubCategory($id: ID!, $input: UpdateServiceSubCategoryInput!) {
      updateServiceSubCategory(id: $id, input: $input) {
        id
        subcategory
        serviceCategoryId
      }
    }
  `,

  // Store
  StoreCategory: gql`
    mutation UpdateStoreCategory($id: ID!, $input: UpdateStoreCategoryInput!) {
      updateStoreCategory(id: $id, input: $input) {
        id
        name
      }
    }
  `,

  StoreSubCategory: gql`
    mutation UpdateStoreSubCategory($id: ID!, $input: UpdateStoreSubCategoryInput!) {
      updateStoreSubCategory(id: $id, input: $input) {
        id
        name
        storeCategoryId
      }
    }
  `,

  // Community
  CommunityCategory: gql`
    mutation UpdateCommunityCategory($id: ID!, $input: UpdateCommunityCategoryInput!) {
      updateCommunityCategory(id: $id, input: $input) {
        id
        name
      }
    }
  `,

  CommunitySubCategory: gql`
    mutation UpdateCommunitySubCategory($id: ID!, $input: UpdateCommunitySubCategoryInput!) {
      updateCommunitySubCategory(id: $id, input: $input) {
        id
        name
        communityCategoryId
      }
    }
  `,

  // Sustainability
  MaterialImpactEstimate: gql`
    mutation UpdateMaterialImpactEstimate($id: ID!, $input: UpdateMaterialImpactEstimateInput!) {
      updateMaterialImpactEstimate(id: $id, input: $input) {
        id
        materialType
        estimatedCo2SavingsKG
        estimatedWaterSavingsLT
      }
    }
  `,

  Co2ImpactMessage: gql`
    mutation UpdateCo2ImpactMessage($id: ID!, $input: UpdateCo2ImpactMessageInput!) {
      updateCo2ImpactMessage(id: $id, input: $input) {
        id
        min
        max
        message1
        message2
        message3
      }
    }
  `,

  WaterImpactMessage: gql`
    mutation UpdateWaterImpactMessage($id: ID!, $input: UpdateWaterImpactMessageInput!) {
      updateWaterImpactMessage(id: $id, input: $input) {
        id
        min
        max
        message1
        message2
        message3
      }
    }
  `,

  // Other
  ShippingStatus: gql`
    mutation UpdateShippingStatus($id: ID!, $input: UpdateShippingStatusInput!) {
      updateShippingStatus(id: $id, input: $input) {
        id
        status
      }
    }
  `,

  BlogPost: gql`
    mutation UpdateBlogPost($id: ID!, $input: UpdateBlogPostInput!) {
      updateBlogPost(id: $id, input: $input) {
        id
        title
        content
        category
        isPublished
        publishedAt
        createdAt
        updatedAt
      }
    }
  `,

  NotificationTemplate: gql`
    mutation UpdateNotificationTemplate($id: ID!, $input: UpdateNotificationTemplateInput!) {
      updateNotificationTemplate(id: $id, input: $input) {
        id
        type
        title
        message
        isActive
        createdAt
        updatedAt
      }
    }
  `,
};

// Helper function to get update mutation for a table
export const getUpdateMutation = (tableName: string): DocumentNode | null => {
  return UPDATE_MUTATIONS[tableName] || null;
};

// Helper function to check if table has an update mutation
export const hasUpdateMutation = (tableName: string): boolean => {
  return tableName in UPDATE_MUTATIONS;
};

// ===========================
// DELETE MUTATIONS
// ===========================

export const DELETE_MUTATIONS: Record<string, DocumentNode> = {
  // Location
  Country: gql`
    mutation DeleteCountry($id: ID!) {
      deleteCountry(id: $id) {
        id
        country
      }
    }
  `,

  Region: gql`
    mutation DeleteRegion($id: ID!) {
      deleteRegion(id: $id) {
        id
        region
      }
    }
  `,

  City: gql`
    mutation DeleteCity($id: ID!) {
      deleteCity(id: $id) {
        id
        city
      }
    }
  `,

  County: gql`
    mutation DeleteCounty($id: ID!) {
      deleteCounty(id: $id) {
        id
        county
      }
    }
  `,

  // Catalog
  Departments: gql`
    mutation DeleteDepartment($id: ID!) {
      deleteDepartment(id: $id) {
        id
        departmentName
      }
    }
  `,

  DepartmentCategory: gql`
    mutation DeleteDepartmentCategory($id: ID!) {
      deleteDepartmentCategory(id: $id) {
        id
        departmentCategoryName
      }
    }
  `,

  ProductCategory: gql`
    mutation DeleteProductCategory($id: ID!) {
      deleteProductCategory(id: $id) {
        id
        productCategoryName
      }
    }
  `,

  // Seller Management
  SellerCategory: gql`
    mutation DeleteSellerCategory($id: ID!) {
      deleteSellerCategory(id: $id) {
        id
        name
      }
    }
  `,

  SellerLevels: gql`
    mutation DeleteSellerLevel($id: ID!) {
      deleteSellerLevel(id: $id) {
        id
        levelName
      }
    }
  `,

  // Services
  ServiceCategory: gql`
    mutation DeleteServiceCategory($id: ID!) {
      deleteServiceCategory(id: $id) {
        id
        category
      }
    }
  `,

  ServiceSubCategory: gql`
    mutation DeleteServiceSubCategory($id: ID!) {
      deleteServiceSubCategory(id: $id) {
        id
        subcategory
      }
    }
  `,

  // Store
  StoreCategory: gql`
    mutation DeleteStoreCategory($id: ID!) {
      deleteStoreCategory(id: $id) {
        id
        name
      }
    }
  `,

  StoreSubCategory: gql`
    mutation DeleteStoreSubCategory($id: ID!) {
      deleteStoreSubCategory(id: $id) {
        id
        name
      }
    }
  `,

  // Community
  CommunityCategory: gql`
    mutation DeleteCommunityCategory($id: ID!) {
      deleteCommunityCategory(id: $id) {
        id
        name
      }
    }
  `,

  CommunitySubCategory: gql`
    mutation DeleteCommunitySubCategory($id: ID!) {
      deleteCommunitySubCategory(id: $id) {
        id
        name
      }
    }
  `,

  // Sustainability
  MaterialImpactEstimate: gql`
    mutation DeleteMaterialImpactEstimate($id: ID!) {
      deleteMaterialImpactEstimate(id: $id) {
        id
        materialType
      }
    }
  `,

  Co2ImpactMessage: gql`
    mutation DeleteCo2ImpactMessage($id: ID!) {
      deleteCo2ImpactMessage(id: $id) {
        id
      }
    }
  `,

  WaterImpactMessage: gql`
    mutation DeleteWaterImpactMessage($id: ID!) {
      deleteWaterImpactMessage(id: $id) {
        id
      }
    }
  `,

  // Other
  ShippingStatus: gql`
    mutation DeleteShippingStatus($id: ID!) {
      deleteShippingStatus(id: $id) {
        id
        status
      }
    }
  `,

  BlogPost: gql`
    mutation DeleteBlogPost($id: ID!) {
      deleteBlogPost(id: $id) {
        id
        title
      }
    }
  `,

  NotificationTemplate: gql`
    mutation DeleteNotificationTemplate($id: ID!) {
      deleteNotificationTemplate(id: $id) {
        id
        type
      }
    }
  `,
};

// Helper function to get delete mutation for a table
export const getDeleteMutation = (tableName: string): DocumentNode | null => {
  return DELETE_MUTATIONS[tableName] || null;
};

// Helper function to check if table has a delete mutation
export const hasDeleteMutation = (tableName: string): boolean => {
  return tableName in DELETE_MUTATIONS;
};

// ==============================================================================
// BULK IMPORT MUTATIONS
// ==============================================================================

export const BULK_IMPORT_MUTATIONS: Record<string, DocumentNode> = {
  ProductCategories: gql`
    mutation BulkImportProductCategories($categories: [BulkProductCategoryInput!]!) {
      bulkImportProductCategories(categories: $categories) {
        success
        created
        failed
        errors {
          row
          data
          error
        }
      }
    }
  `,

  DepartmentCategory: gql`
    mutation BulkImportDepartmentCategories($categories: [BulkImportDepartmentCategoryInput!]!) {
      bulkImportDepartmentCategories(categories: $categories) {
        success
        created
        failed
        errors {
          row
          data
          error
        }
      }
    }
  `,

  Departments: gql`
    mutation BulkImportDepartments($departments: [BulkImportDepartmentInput!]!) {
      bulkImportDepartments(departments: $departments) {
        success
        created
        failed
        errors {
          row
          data
          error
        }
      }
    }
  `,

  // Add more bulk import mutations as needed for other tables
};

// Helper function to get bulk import mutation for a table
export const getBulkImportMutation = (tableName: string): DocumentNode | null => {
  return BULK_IMPORT_MUTATIONS[tableName] || null;
};

// Helper function to check if table has a bulk import mutation
export const hasBulkImportMutation = (tableName: string): boolean => {
  return tableName in BULK_IMPORT_MUTATIONS;
};
