import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query Countries {
    countries {
      id
      country
    }
  }
`;

export const GET_REGIONS = gql`
  query Regions {
    regions {
      id
      region
    }
  }
`;

export const GET_CITIES = gql`
  query Cities {
    cities {
      id
      city
    }
  }
`;

export const GET_COUNTIES = gql`
  query Counties {
    counties {
      id
      county
    }
  }
`;
