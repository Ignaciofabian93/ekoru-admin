const ENVIRONMENT = process.env.NODE_ENV || "development";

export const URL =
  ENVIRONMENT === "development"
    ? "http://localhost:5000"
    : "https://api.ekoru.cl";

export const GRAPHQL_URL = `${URL}/graphql`;
export const REST_URL = `${URL}/session`;
