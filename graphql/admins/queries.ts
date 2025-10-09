import { gql } from "@apollo/client";

export const GET_ADMINS = gql`
  query GetAdmins {
    getAdmins(adminType: PLATFORM, isActive: true, role: SUPER_ADMIN, limit: 10, offset: 1) {
      id
      email
      password
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
      cityId
      countryId
      countyId
      regionId
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
