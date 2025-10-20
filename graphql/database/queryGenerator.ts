import { gql, DocumentNode } from "@apollo/client";
import { GET_CITIES, GET_COUNTIES, GET_COUNTRIES, GET_REGIONS } from "../location/queries";
import { GET_SELLER_LEVELS } from "../sellerLevels/queries";
import { GET_DEPARTMENTS } from "../product/queries";

/**
 * Generate a GraphQL query for a specific table
 * This should match the query naming convention in your GraphQL schema
 * All tables use page-based pagination with pageInfo and nodes structure
 */
export const generateTableQuery = (tableName: string): DocumentNode => {
  // Convert table name to query name (e.g., "admins" -> "getAdmins")
  const queryName = `get${tableName.charAt(0).toUpperCase() + tableName.slice(1)}`;

  // All tables use page-based pagination
  return gql`
    query ${queryName}($page: Int, $pageSize: Int) {
      ${queryName}(page: $page, pageSize: $pageSize) {
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
          createdAt
          updatedAt
          # Add other common fields here
        }
      }
    }
  `;
};

/**
 * Table-specific query definitions
 * Define detailed queries for tables that need specific fields
 */
export const TABLE_QUERIES: Record<string, DocumentNode> = {
  admins: gql`
    query GetAdmins($page: Int, $pageSize: Int, $adminType: AdminType, $isActive: Boolean, $role: Role) {
      getAdmins(adminType: $adminType, isActive: $isActive, role: $role, page: $page, pageSize: $pageSize) {
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
          name
          lastName
          adminType
          role
          permissions
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
    }
  `,

  users: gql`
    query GetUsers($page: Int, $pageSize: Int, $isActive: Boolean) {
      getUsers(page: $page, pageSize: $pageSize, isActive: $isActive) {
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
          username
          firstName
          lastName
          phoneNumber
          isActive
          isEmailVerified
          isPhoneVerified
          createdAt
          updatedAt
        }
      }
    }
  `,

  Countries: GET_COUNTRIES,
  Regions: GET_REGIONS,
  Cities: GET_CITIES,
  Counties: GET_COUNTIES,
  SellerLevel: GET_SELLER_LEVELS,
  Departments: GET_DEPARTMENTS,

  // Add more table-specific queries as needed
};

/**
 * Get query for a specific table
 * Falls back to generated query if no specific query exists
 */
export const getTableQuery = (tableName: string): DocumentNode => {
  console.log("Getting query for table:", tableName);

  return TABLE_QUERIES[tableName] || generateTableQuery(tableName);
};
