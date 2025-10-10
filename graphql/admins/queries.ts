import { gql } from "@apollo/client";

export const GET_ADMINS = gql`
  query GetAdmins($adminType: AdminType, $role: AdminRole, $isActive: Boolean, $limit: Int, $offset: Int) {
    getAdmins(adminType: $adminType, isActive: $isActive, role: $role, limit: $limit, offset: $offset) {
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
