import { gql } from "@apollo/client";

export const GET_CO2_IMPACT_MESSAGES = gql`
  query Co2ImpactMessages {
    co2ImpactMessages {
      id
      min
      max
      message1
      message2
      message3
    }
  }
`;

export const GET_WATER_IMPACT_MESSAGES = gql`
  query WaterImpactMessages {
    waterImpactMessages {
      id
      min
      max
      message1
      message2
      message3
    }
  }
`;

export const GET_MATERIAL_IMPACT_ESTIMATES = gql`
  query MaterialImpactEstimates {
    MaterialImpactEstimates {
      id
      materialType
      estimatedCo2SavingsKG
      estimatedWaterSavingsLT
      fifthMaterialTypeFor {
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
      }
      fourthMaterialTypeFor {
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
      }
      thirdMaterialTypeFor {
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
      }
      secondMaterialTypeFor {
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
      }
      firstMaterialTypeFor {
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
      }
    }
  }
`;
