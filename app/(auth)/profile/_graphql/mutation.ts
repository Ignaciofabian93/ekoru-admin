import { gql } from "@apollo/client";

export const UPDATE_ADMIN_PROFILE = gql`
  mutation UpdateAdmin($id: ID!, $input: UpdateAdminInput!) {
    updateAdmin(id: $id, input: $input) {
      id
      email
      name
      lastName
      adminType
      role
      permissions
      sellerId
      isActive
      isEmailVerified
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
`;
