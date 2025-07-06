export const ENVIRONMENT = process.env.ENVIRONMENT || "development";
export const URL = ENVIRONMENT === "development" ? "http://localhost:5000/api" : "https://api.ekoru.cl/api";
