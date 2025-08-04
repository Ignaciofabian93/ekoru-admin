import { gql } from "@apollo/client";

export const GET_EXCHANGES = gql`
  query Exchanges {
    exchanges {
      id
      transactionId
      offeredProductId
      requestedProductId
      status
      notes
      createdAt
      completedAt
    }
  }
`;

export const GET_EXCHANGE = gql`
  query Exchange($id: ID!) {
    exchange(id: $id) {
      id
      transactionId
      offeredProductId
      requestedProductId
      status
      notes
      createdAt
      completedAt
    }
  }
`;

export const GET_EXCHANGES_BY_USER = gql`
  query ExchangesByUser($userId: ID!) {
    exchangesByUser(userId: $userId) {
      id
      transactionId
      offeredProductId
      requestedProductId
      status
      notes
      createdAt
      completedAt
    }
  }
`;
