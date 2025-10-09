import { gql } from "@apollo/client";

export const GET_MY_DATA = gql`
  query GetMyData {
    getMyData {
      id
      email
      name
      lastName
      adminType
      role
      permissions
      sellerId
      isActive
      isEmailVerified
      accountLocked
      loginAttempts
      lastLoginAt
      lastLoginIp
      createdAt
      updatedAt
      region {
        id
        region
        countryId
      }
      county {
        id
        county
        cityId
      }
      country {
        id
        country
      }
      city {
        id
        city
        regionId
      }
    }
  }
`;
