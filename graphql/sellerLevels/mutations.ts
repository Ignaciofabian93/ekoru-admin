import { gql } from "@apollo/client";

export const CREATE_SELLER_LEVEL = gql`
  mutation CreateSellerLevel {
    createSellerLevel(input: { badgeIcon: "''", benefits: "''", maxPoints: 100, minPoints: 1, levelName: "amateur" }) {
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

export const UPDATE_SELLER_LEVEL = gql`
  mutation UpdateSellerLevel {
    updateSellerLevel(
      id: "1"
      input: { badgeIcon: null, benefits: null, maxPoints: null, minPoints: null, levelName: null }
    ) {
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

export const DELETE_SELLER_LEVEL = gql`
  mutation DeleteSellerLevel {
    deleteSellerLevel(id: "1")
  }
`;
