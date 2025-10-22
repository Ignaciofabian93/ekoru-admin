import { gql, DocumentNode } from "@apollo/client";
import { GET_CITIES, GET_COUNTIES, GET_COUNTRIES, GET_REGIONS } from "../location/queries";
import { GET_SELLER_LEVELS } from "../sellerLevels/queries";
import { GET_DEPARTMENT_CATEGORIES, GET_DEPARTMENTS, GET_PRODUCT_CATEGORIES } from "../product/queries";

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
  Countries: GET_COUNTRIES,
  Regions: GET_REGIONS,
  Cities: GET_CITIES,
  Counties: GET_COUNTIES,
  SellerLevel: GET_SELLER_LEVELS,
  Departments: GET_DEPARTMENTS,
  DepartmentCategories: GET_DEPARTMENT_CATEGORIES,
  ProductCategories: GET_PRODUCT_CATEGORIES,

  // Add more table-specific queries as needed
};

/**
 * Get query for a specific table
 * Falls back to generated query if no specific query exists
 */
export const getTableQuery = (tableName: string): DocumentNode => {
  return TABLE_QUERIES[tableName] || generateTableQuery(tableName);
};
