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
  Department: gql`
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
