import { gql } from "@apollo/client";

export const GET_USER_CATEGORIES = gql`
  query UserCategories {
    userCategories {
      id
      name
      categoryDiscountAmount
      pointsThreshold
    }
  }
`;

export const GET_USERS = gql`
  query Users {
    users {
      id
      name
      surnames
      email
      businessName
      profileImage
      coverImage
      birthday
      phone
      address
      isCompany
      accountType
      preferredContactMethod
      points
      createdAt
      updatedAt
      userCategory {
        id
        name
        categoryDiscountAmount
        pointsThreshold
      }
      country {
        id
        country
      }
      region {
        id
        region
      }
      city {
        id
        city
      }
      county {
        id
        county
      }
    }
  }
`;

export const GET_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
      surnames
      email
      businessName
      profileImage
      coverImage
      birthday
      phone
      address
      isCompany
      accountType
      preferredContactMethod
      points
      createdAt
      updatedAt
      userCategory {
        id
        name
        categoryDiscountAmount
        pointsThreshold
      }
      country {
        id
        country
      }
      region {
        id
        region
      }
      city {
        id
        city
      }
      county {
        id
        county
      }
    }
  }
`;
