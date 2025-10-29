import { gql } from "@apollo/client";

export const GET_ADMINS = gql`
  query GetAdmins($adminType: AdminType, $role: AdminRole, $isActive: Boolean, $page: Int, $pageSize: Int) {
    getAdmins(adminType: $adminType, role: $role, isActive: $isActive, page: $page, pageSize: $pageSize) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        totalCount
        totalPages
        currentPage
        pageSize
      }
      nodes {
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
      }
    }
  }
`;
