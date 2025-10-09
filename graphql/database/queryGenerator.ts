import { gql, DocumentNode } from "@apollo/client";

/**
 * Generate a GraphQL query for a specific table
 * This should match the query naming convention in your GraphQL schema
 */
export const generateTableQuery = (tableName: string): DocumentNode => {
  // Convert table name to query name (e.g., "admins" -> "getAdmins")
  const queryName = `get${tableName.charAt(0).toUpperCase() + tableName.slice(1)}`;

  // You'll need to customize the fields based on your schema
  // For now, using common fields. Later, you can make this dynamic
  return gql`
    query ${queryName}($limit: Int, $offset: Int) {
      ${queryName}(limit: $limit, offset: $offset) {
        id
        createdAt
        updatedAt
        # Add other common fields here
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
    query GetAdmins($limit: Int, $offset: Int, $adminType: AdminType, $isActive: Boolean, $role: Role) {
      getAdmins(adminType: $adminType, isActive: $isActive, role: $role, limit: $limit, offset: $offset) {
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
  `,

  users: gql`
    query GetUsers($limit: Int, $offset: Int, $isActive: Boolean) {
      getUsers(limit: $limit, offset: $offset, isActive: $isActive) {
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
  `,

  Countries: gql`
    query GetCountries($limit: Int, $offset: Int) {
      getCountries(limit: $limit, offset: $offset) {
        id
        country
      }
    }
  `,

  Regions: gql`
    query GetRegions($limit: Int, $offset: Int) {
      getRegions(limit: $limit, offset: $offset) {
        id
        region
        countryId
      }
    }
  `,

  Cities: gql`
    query GetCities($limit: Int, $offset: Int) {
      getCities(limit: $limit, offset: $offset) {
        id
        city
        regionId
      }
    }
  `,

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
