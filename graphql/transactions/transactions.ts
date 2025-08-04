import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query Transactions {
    transactions {
      id
      kind
      pointsCollected
      createdAt
      userId
    }
  }
`;

export const GET_TRANSACTION = gql`
  query Transaction($id: ID!) {
    transaction(id: $id) {
      id
      kind
      pointsCollected
      createdAt
      userId
    }
  }
`;

export const GET_TRANSACTIONS_BY_USER = gql`
  query TransactionsByUser($userId: ID!) {
    transactionsByUser(userId: $userId) {
      id
      kind
      pointsCollected
      createdAt
      userId
    }
  }
`;
