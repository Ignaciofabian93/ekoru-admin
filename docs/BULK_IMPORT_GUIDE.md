# Bulk Import Implementation Guide

## Overview

This guide explains how to implement bulk import functionality for database tables in the Ekoru Admin application.

## Architecture

### 1. Backend GraphQL Mutation (Already Created)

```graphql
mutation BulkImportProductCategories {
  bulkImportProductCategories(
    categories: [
      {
        weightUnit: "kg"
        size: "medium"
        averageWeight: 1.5
        keywords: ["example", "test"]
        departmentCategoryId: 1
        productCategoryName: "Example Category"
      }
    ]
  ) {
    success
    created
    failed
    errors {
      row
      data
      error
    }
  }
}
```

### 2. Frontend Implementation

#### Step 1: Define the Mutation in `graphql/database/mutations.ts`

```typescript
export const BULK_IMPORT_MUTATIONS: Record<string, DocumentNode> = {
  ProductCategory: gql`
    mutation BulkImportProductCategories($categories: [BulkImportProductCategoryInput!]!) {
      bulkImportProductCategories(categories: $categories) {
        success
        created
        failed
        errors {
          row
          data
          error
        }
      }
    }
  `,
  // Add more tables...
};
```

#### Step 2: Types are Already Defined in `types/bulk.ts`

```typescript
export type BulkImportError = {
  row: number;
  data: any;
  error: string;
};

export type BulkImportResult = {
  success: boolean;
  created: number;
  failed: number;
  errors: BulkImportError[];
};
```

#### Step 3: Use in Component (Already Implemented)

The `tableDetailModal.tsx` automatically handles bulk imports for tables that have mutations defined.

## How to Add Bulk Import for a New Table

### 1. Ensure Backend Mutation Exists

Your backend should have a mutation like:

```graphql
mutation BulkImportYourTable($items: [BulkImportYourTableInput!]!) {
  bulkImportYourTable(items: $items) {
    success
    created
    failed
    errors {
      row
      data
      error
    }
  }
}
```

### 2. Add Frontend Mutation Definition

In `graphql/database/mutations.ts`, add to `BULK_IMPORT_MUTATIONS`:

```typescript
YourTableName: gql`
  mutation BulkImportYourTable($items: [BulkImportYourTableInput!]!) {
    bulkImportYourTable(items: $items) {
      success
      created
      failed
      errors {
        row
        data
        error
      }
    }
  }
`,
```

### 3. Update Variable Name Mapping (if needed)

In `tableDetailModal.tsx`, update the `handleImportComplete` function to include your table's variable name:

```typescript
const variableName =
  table.name === "ProductCategory"
    ? "categories"
    : table.name === "YourTableName"
    ? "items" // <-- Add your mapping here
    : "data";
```

## Usage Flow

### For Users:

1. **Export Template**

   - Click "Exportar / Importar" button
   - Click "Exportar Plantilla" to download an Excel template with column headers
   - Empty cells (like base64 images) will be blank

2. **Fill Template**

   - Open the downloaded Excel file
   - Fill in data (skip image columns, upload images later)
   - Save the file

3. **Import Data**
   - Click "Importar" tab in the modal
   - Drag & drop or select your filled Excel file
   - System validates and imports data
   - View results showing created/failed records

### Response Handling

The system will show:

- ✅ **Success**: "Import completed! Created: X, Failed: Y"
- ❌ **Errors**: Logged in console with row numbers and details
- **Auto-refresh**: Table data refreshes after import

## Example: Product Categories

### Excel File Structure

```
| productCategoryName | departmentCategoryId | keywords | averageWeight | size   | weightUnit |
|---------------------|---------------------|----------|---------------|--------|------------|
| Fresh Vegetables    | 1                   | fresh    | 1.5           | medium | kg         |
| Dairy Products      | 2                   | dairy    | 0.5           | small  | kg         |
```

### Backend Input (Auto-generated from Excel)

```json
[
  {
    "productCategoryName": "Fresh Vegetables",
    "departmentCategoryId": 1,
    "keywords": "fresh",
    "averageWeight": 1.5,
    "size": "medium",
    "weightUnit": "kg"
  },
  {
    "productCategoryName": "Dairy Products",
    "departmentCategoryId": 2,
    "keywords": "dairy",
    "averageWeight": 0.5,
    "size": "small",
    "weightUnit": "kg"
  }
]
```

### Backend Response

```json
{
  "data": {
    "bulkImportProductCategories": {
      "success": true,
      "created": 2,
      "failed": 0,
      "errors": []
    }
  }
}
```

## Error Handling

### If Row Fails

```json
{
  "success": true,
  "created": 1,
  "failed": 1,
  "errors": [
    {
      "row": 2,
      "data": { "productCategoryName": "Invalid Category" },
      "error": "Department category not found"
    }
  ]
}
```

The system will:

1. Import successful rows
2. Log failed rows with error details
3. Show summary notification
4. Allow user to fix and re-import failed rows

## Important Notes

### Excel Limitations

- **Cell Character Limit**: 32,767 characters
- **Base64 Images**: Automatically excluded (shown as empty cells)
- **Large Text**: Truncated if exceeds limit

### Variable Name Convention

Backend mutations use different variable names:

- `ProductCategory` → `categories`
- `DepartmentCategory` → `categories`
- `Departments` → `departments`
- Default → `data`

Make sure to map these correctly in `handleImportComplete`.

## Testing

### Test Your Implementation:

1. **Export template** for your table
2. **Fill with test data** (2-3 rows)
3. **Import** the file
4. **Check**:
   - Console logs show correct data
   - Backend receives correct format
   - Success notification appears
   - Table refreshes with new data
   - Error handling works (test with invalid data)

## Troubleshooting

### Mutation Not Found

- Check `BULK_IMPORT_MUTATIONS` includes your table
- Verify table name matches exactly

### Variable Name Error

- Update variable name mapping in `handleImportComplete`
- Check backend expects correct parameter name

### Data Format Error

- Verify Excel columns match backend input type
- Check for required vs optional fields
- Ensure data types are correct (numbers, strings, arrays)

### Import Button Disabled

- Ensure bulk import mutation exists for that table
- Check `hasBulkImportMutation(tableName)` returns true

## Future Enhancements

- [ ] Add progress bar for large imports
- [ ] Show detailed error modal with failed rows
- [ ] Allow partial retry of failed rows
- [ ] Support CSV and JSON bulk imports
- [ ] Add data validation before sending to backend
- [ ] Support image URL imports instead of base64
