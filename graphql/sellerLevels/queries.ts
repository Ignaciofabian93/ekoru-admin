import { gql } from "@apollo/client";

export const GET_SELLER_LEVELS = gql`
  query GetSellerLevels($page: Int, $pageSize: Int) {
    getSellerLevels(pageSize: $pageSize, page: $page) {
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
        levelName
        minPoints
        maxPoints
        benefits
        badgeIcon
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_SELLER_LEVEL = gql`
  query GetSellerLevel($id: ID!) {
    getSellerLevel(id: $id) {
      id
      levelName
      minPoints
      maxPoints
      benefits
      badgeIcon
      createdAt
      updatedAt
    }
  }
`;
