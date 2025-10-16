import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query GetCountries($page: Int, $pageSize: Int) {
    getCountries(pageSize: $pageSize, page: $page) {
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
        country
      }
    }
  }
`;

export const GET_REGIONS = gql`
  query GetRegions($page: Int, $pageSize: Int) {
    getRegions(pageSize: $pageSize, page: $page) {
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
        region
        countryId
      }
    }
  }
`;

export const GET_REGIONS_BY_COUNTRY = gql`
  query GetRegionsByCountry($countryId: ID!, $page: Int, $pageSize: Int) {
    getRegionsByCountry(countryId: $countryId, pageSize: $pageSize, page: $page) {
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
        region
        countryId
      }
    }
  }
`;

export const GET_CITIES = gql`
  query GetCities($page: Int, $pageSize: Int) {
    getCities(pageSize: $pageSize, page: $page) {
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
        city
        regionId
      }
    }
  }
`;

export const GET_CITIES_BY_REGION = gql`
  query GetCitiesByRegion($regionId: ID!, $page: Int, $pageSize: Int) {
    getCitiesByRegion(regionId: $regionId, pageSize: $pageSize, page: $page) {
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
        city
        regionId
      }
    }
  }
`;

export const GET_COUNTIES = gql`
  query GetCounties($page: Int, $pageSize: Int) {
    getCounties(pageSize: $pageSize, page: $page) {
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
        county
        cityId
      }
    }
  }
`;

export const GET_COUNTIES_BY_CITY = gql`
  query GetCountiesByCity($cityId: ID!, $page: Int, $pageSize: Int) {
    getCountiesByCity(cityId: $cityId, pageSize: $pageSize, page: $page) {
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
        county
        cityId
      }
    }
  }
`;
