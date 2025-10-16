# New Record Creation System - Architecture & Approach

## Overview

This document explains the dynamic form system for creating new database records in the admin panel.

## Architecture

### 1. **Field Configuration System** (`newRecordFields.ts`)

Centralized configuration that defines all fields for each table:

```typescript
export const tableFieldConfigs: Record<string, FieldConfig[]> = {
  Country: [
    {
      name: "country",
      label: "País",
      type: "text",
      required: true,
      placeholder: "Ej: Chile",
    },
  ],
  // ... more tables
};
```

### 2. **Dynamic Form Component** (`dynamicForm.tsx`)

Reusable form component that:

- Renders fields dynamically based on configuration
- Handles validation (required, email, patterns, min/max)
- Manages form state
- Supports multiple field types

### 3. **New Record Modal** (`newRecordModal.tsx`)

Modal that:

- Fetches field configuration for the selected table
- Renders the dynamic form
- Handles form submission
- Shows error state if configuration is missing

## Supported Field Types

| Type          | Description                | Example               |
| ------------- | -------------------------- | --------------------- |
| `text`        | Simple text input          | Name, Title           |
| `email`       | Email with validation      | user@example.com      |
| `password`    | Password field             | ****\*\*****          |
| `number`      | Numeric input with min/max | Price, Age            |
| `textarea`    | Multi-line text            | Description, Content  |
| `select`      | Dropdown with options      | Status, Category      |
| `multiselect` | Multiple selection         | Tags, Interests       |
| `boolean`     | Checkbox                   | isActive, isPublished |
| `date`        | Date picker                | Created Date          |
| `datetime`    | Date & time picker         | Published At          |
| `array`       | Comma-separated values     | Keywords, Tags        |
| `relation`    | Foreign key selector       | Category ID, User ID  |
| `json`        | JSON editor                | Metadata, Config      |

## Field Configuration Properties

```typescript
type FieldConfig = {
  name: string; // Field name (matches DB column)
  label: string; // Display label
  type: FieldType; // Field type
  required?: boolean; // Is field required?
  placeholder?: string; // Placeholder text
  defaultValue?: unknown; // Default value
  options?: Option[]; // For select/multiselect
  relatedTable?: string; // For relation fields
  min?: number; // Min value for numbers
  max?: number; // Max value for numbers
  validation?: {
    // Custom validation
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
};
```

## How to Add New Tables

### Step 1: Add Field Configuration

Edit `newRecordFields.ts`:

```typescript
export const tableFieldConfigs: Record<string, FieldConfig[]> = {
  // ... existing tables

  YourTableName: [
    {
      name: "fieldName",
      label: "Field Label",
      type: "text",
      required: true,
      placeholder: "Enter value...",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
      ],
    },
  ],
};
```

### Step 2: Create GraphQL Mutation

In your GraphQL schema, ensure you have a create mutation:

```graphql
mutation CreateYourTable($input: CreateYourTableInput!) {
  createYourTable(input: $input) {
    id
    fieldName
    status
  }
}
```

### Step 3: Implement Mutation Call

Update `newRecordModal.tsx` handleSubmit:

```typescript
const handleSubmit = async (formData: Record<string, unknown>) => {
  await createMutation({
    variables: {
      input: formData,
    },
  });
  await refetch(); // Refresh table data
  onClose();
};
```

## Tables Currently Configured

### Location (4 tables)

- ✅ Country
- ✅ Region
- ✅ City
- ✅ County

### Catalog (3 tables)

- ✅ Department
- ✅ DepartmentCategory
- ✅ ProductCategory

### User Management (2 tables)

- ✅ SellerCategory
- ✅ SellerLevel

### Services (2 tables)

- ✅ ServiceCategory
- ✅ ServiceSubCategory

### Store (2 tables)

- ✅ StoreCategory
- ✅ StoreSubCategory

### Community (2 tables)

- ✅ CommunityCategory
- ✅ CommunitySubCategory

### Sustainability (3 tables)

- ✅ MaterialImpactEstimate
- ✅ Co2ImpactMessage
- ✅ WaterImpactMessage

### Other (3 tables)

- ✅ ShippingStatus
- ✅ BlogPost
- ✅ NotificationTemplate

**Total: 23 tables configured**

## Tables Pending Configuration

The following tables still need field configuration:

### Core Tables

- [ ] Admin
- [ ] Seller
- [ ] PersonProfile
- [ ] BusinessProfile
- [ ] SellerPreferences

### Products

- [ ] Product
- [ ] ProductVariant
- [ ] ProductCategoryMaterial
- [ ] StoreProduct
- [ ] StoreProductMaterial

### Services & Orders

- [ ] Service
- [ ] Quotation
- [ ] Order
- [ ] OrderItem

### Social & Communication

- [ ] Match
- [ ] Story
- [ ] Chat
- [ ] Message
- [ ] Notification
- [ ] CommunityPost
- [ ] CommunityComment

### Payments

- [ ] Payment
- [ ] PaymentRefund
- [ ] PaymentTransaction
- [ ] PaymentWebhook
- [ ] ChileanPaymentConfig

### Misc

- [ ] Transaction
- [ ] Exchange
- [ ] CountryConfig
- [ ] ProductLike
- [ ] ProductComment
- [ ] ServiceReview
- [ ] AdminActivityLog

## Best Practices

### 1. **Field Naming**

- Use exact database column names
- Follow camelCase convention
- Match GraphQL input types

### 2. **Validation**

- Always mark required fields
- Add appropriate min/max for numbers
- Use regex patterns for custom formats
- Provide clear error messages

### 3. **User Experience**

- Use descriptive labels in Spanish
- Add helpful placeholders
- Group related fields
- Use appropriate field types

### 4. **Relations**

- Mark foreign key fields as `relation` type
- Specify the related table
- Indicate which field to display as label

### 5. **Enums**

- Convert enum values to select options
- Use human-readable labels
- Keep values matching the schema

## Future Enhancements

### 1. **Relation Field Enhancement**

Automatically fetch and populate relation dropdowns:

```typescript
const { data: countries } = useQuery(GET_COUNTRIES);
const countryOptions = countries?.map((c) => ({
  label: c.country,
  value: c.id,
}));
```

### 2. **GraphQL Introspection**

Use GraphQL introspection to auto-generate field configs:

```typescript
const { __type } = useIntrospectionQuery();
const fields = __type.inputFields.map((f) => ({
  name: f.name,
  type: mapGraphQLType(f.type),
  required: f.type.kind === "NON_NULL",
}));
```

### 3. **File Upload Support**

Add support for image/file uploads:

```typescript
{
  name: "profileImage",
  type: "file",
  accept: "image/*",
  maxSize: 5242880 // 5MB
}
```

### 4. **Conditional Fields**

Show/hide fields based on other field values:

```typescript
{
  name: "offerPrice",
  type: "number",
  showIf: (formData) => formData.hasOffer === true
}
```

### 5. **Multi-step Forms**

Split complex forms into steps:

```typescript
{
  steps: [
    { title: "Basic Info", fields: [...] },
    { title: "Details", fields: [...] },
    { title: "Review", fields: [...] }
  ]
}
```

## Troubleshooting

### Form not showing

- Check if table name matches exactly (case-sensitive)
- Verify fields array is not empty
- Use `hasFieldConfig()` helper to check

### Validation errors

- Ensure required fields have values
- Check regex patterns are valid
- Verify min/max constraints

### Submission failing

- Check GraphQL mutation exists
- Verify input type matches schema
- Check for missing required fields in mutation

## Contributing

When adding new table configurations:

1. Follow existing patterns
2. Use appropriate field types
3. Add validation rules
4. Test thoroughly
5. Update this documentation
