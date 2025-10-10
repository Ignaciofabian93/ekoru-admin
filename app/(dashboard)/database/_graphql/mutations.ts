/**
 * GraphQL Mutations for Database Operations
 * Add these mutations to interact with the backend bulk import functionality
 */

import { gql } from "@apollo/client";

/**
 * Bulk import mutation
 * TODO: Implement this mutation in your backend
 *
 * Backend should:
 * 1. Validate tableName against allowed tables
 * 2. Validate each row of data
 * 3. Use database transaction (rollback on error)
 * 4. Return success status, count, and errors
 */
export const BULK_IMPORT = gql`
  mutation BulkImport($tableName: String!, $data: [JSON!]!) {
    bulkImport(tableName: $tableName, data: $data) {
      success
      insertedCount
      failedCount
      errors
    }
  }
`;

/**
 * Insert single record mutation
 * For adding individual records via the "+" button
 */
export const INSERT_RECORD = gql`
  mutation InsertRecord($tableName: String!, $data: JSON!) {
    insertRecord(tableName: $tableName, data: $data) {
      success
      id
      error
    }
  }
`;

/**
 * Update record mutation
 * For editing existing records
 */
export const UPDATE_RECORD = gql`
  mutation UpdateRecord($tableName: String!, $id: ID!, $data: JSON!) {
    updateRecord(tableName: $tableName, id: $id, data: $data) {
      success
      error
    }
  }
`;

/**
 * Delete record mutation
 * For removing records
 */
export const DELETE_RECORD = gql`
  mutation DeleteRecord($tableName: String!, $id: ID!) {
    deleteRecord(tableName: $tableName, id: $id) {
      success
      error
    }
  }
`;

/**
 * Bulk delete mutation
 * For deleting multiple records at once
 */
export const BULK_DELETE = gql`
  mutation BulkDelete($tableName: String!, $ids: [ID!]!) {
    bulkDelete(tableName: $tableName, ids: $ids) {
      success
      deletedCount
      errors
    }
  }
`;
