import { gql } from "@apollo/client";

export const GET_DEPARTMENTS = gql`
  query Departments {
    departments {
      id
      departmentName
    }
  }
`;

export const GET_DEPARTMENT_CATEGORIES = gql`
  query DepartmentCategories {
    departmentCategories {
      id
      departmentCategoryName
      departmentId
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  query ProductCategories {
    productCategories {
      id
      productCategoryName
      departmentCategoryId
      keywords
      averageWeight
      firstMaterialTypeId
      firstMaterialTypeQuantity
      secondMaterialTypeId
      secondMaterialTypeQuantity
      thirdMaterialTypeId
      thirdMaterialTypeQuantity
      fourthMaterialTypeId
      fourthMaterialTypeQuantity
      fifthMaterialTypeId
      fifthMaterialTypeQuantity
      size
      weightUnit
      fifthMaterialType {
        id
        materialType
        estimatedCo2SavingsKG
        estimatedWaterSavingsLT
      }
      fourthMaterialType {
        id
        materialType
        estimatedCo2SavingsKG
        estimatedWaterSavingsLT
      }
      thirdMaterialType {
        id
        materialType
        estimatedCo2SavingsKG
        estimatedWaterSavingsLT
      }
      secondMaterialType {
        id
        materialType
        estimatedCo2SavingsKG
        estimatedWaterSavingsLT
      }
      firstMaterialType {
        id
        materialType
        estimatedCo2SavingsKG
        estimatedWaterSavingsLT
      }
    }
  }
`;
