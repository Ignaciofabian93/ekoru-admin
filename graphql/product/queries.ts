import { gql } from "@apollo/client";

export const GET_DEPARTMENTS = gql`
  query GetDepartments($page: Int, $pageSize: Int) {
    getDepartments(page: $page, pageSize: $pageSize) {
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
        departmentName
        departmentImage
      }
    }
  }
`;

export const GET_DEPARTMENT_CATEGORIES = gql`
  query GetDepartmentCategories($page: Int, $pageSize: Int) {
    getDepartmentCategories(pageSize: $pageSize, page: $page) {
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
        departmentCategoryName
        departmentId
      }
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories($page: Int, $pageSize: Int) {
    getProductCategories(pageSize: $pageSize, page: $page) {
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
        productCategoryName
        departmentCategoryId
        keywords
        averageWeight
        size
        weightUnit
      }
    }
  }
`;
