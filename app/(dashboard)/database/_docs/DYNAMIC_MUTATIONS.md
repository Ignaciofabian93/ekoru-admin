# Dynamic Mutation System - Quick Reference

## How It Works

The system dynamically calls the appropriate GraphQL mutation based on the table name when creating new records.

## Components Involved

### 1. **Mutation Registry** (`graphql/database/mutations.ts`)

Centralized mapping of table names to their create mutations:

```typescript
export const CREATE_MUTATIONS: Record<string, DocumentNode> = {
  SellerLevel: gql`
    mutation CreateSellerLevel($input: CreateSellerLevelInput!) {
      createSellerLevel(input: $input) {
        id
        levelName
        minPoints
        maxPoints
        benefits
        badgeIcon
        color
      }
    }
  `,
  // ... more tables
};
```

### 2. **New Record Modal** (`newRecordModal.tsx`)

Handles the mutation execution:

```typescript
// Get mutation for current table
const mutation = getCreateMutation(tableName);

// Execute mutation
const [createRecord, { loading }] = useMutation(mutation, {
  onCompleted: (data) => {
    notify("Registro creado exitosamente");
    onRecordCreated?.(); // Refresh table
    onClose();
  },
  onError: (error) => {
    notifyError(`Error: ${error.message}`);
  },
});

// Submit handler
const handleSubmit = async (formData) => {
  await createRecord({
    variables: { input: formData },
  });
};
```

### 3. **Dynamic Form** (`dynamicForm.tsx`)

- Collects user input
- Validates fields
- Calls `onSubmit` with form data

### 4. **Table Detail Modal** (`TableDetailModal.tsx`)

- Passes `onRecordCreated={refetch}` to refresh data after creation

## Data Flow

```
User fills form → DynamicForm validates → handleSubmit called
                                              ↓
                         getCreateMutation(tableName) returns mutation
                                              ↓
                         useMutation executes with formData
                                              ↓
                              ┌─── Success ───┐─── Error ───┐
                              ↓                              ↓
                        Show success toast          Show error toast
                        Refresh table data          Keep form open
                        Close modal
```

## Example: Creating a SellerLevel

### Step 1: User Fills Form

```
levelName: "Novato"
minPoints: 0
maxPoints: 999
benefits: "Acceso básico"
badgeIcon: "🆕"
color: "#4CAF50"
```

### Step 2: Form Submits to handleSubmit

```typescript
handleSubmit({
  levelName: "Novato",
  minPoints: 0,
  maxPoints: 999,
  benefits: "Acceso básico",
  badgeIcon: "🆕",
  color: "#4CAF50",
});
```

### Step 3: Mutation Executes

```graphql
mutation CreateSellerLevel($input: CreateSellerLevelInput!) {
  createSellerLevel(
    input: {
      levelName: "Novato"
      minPoints: 0
      maxPoints: 999
      benefits: "Acceso básico"
      badgeIcon: "🆕"
      color: "#4CAF50"
    }
  ) {
    id
    levelName
    minPoints
    maxPoints
    benefits
    badgeIcon
    color
    createdAt
    updatedAt
  }
}
```

### Step 4: Success Response

```json
{
  "data": {
    "createSellerLevel": {
      "id": "123",
      "levelName": "Novato",
      "minPoints": 0,
      "maxPoints": 999,
      "benefits": "Acceso básico",
      "badgeIcon": "🆕",
      "color": "#4CAF50",
      "createdAt": "2025-10-16T10:30:00Z",
      "updatedAt": "2025-10-16T10:30:00Z"
    }
  }
}
```

### Step 5: UI Updates

- ✅ Success toast shown
- ✅ Table data refreshed via `refetch()`
- ✅ Modal closed
- ✅ New record appears in table

## Adding New Tables

### Step 1: Add Mutation to Registry

Edit `graphql/database/mutations.ts`:

```typescript
export const CREATE_MUTATIONS: Record<string, DocumentNode> = {
  // ... existing mutations

  YourNewTable: gql`
    mutation CreateYourNewTable($input: CreateYourNewTableInput!) {
      createYourNewTable(input: $input) {
        id
        field1
        field2
        # ... all fields you want returned
      }
    }
  `,
};
```

### Step 2: Add Field Configuration

Edit `newRecordFields.ts`:

```typescript
export const tableFieldConfigs: Record<string, FieldConfig[]> = {
  // ... existing configs

  YourNewTable: [
    {
      name: "field1",
      label: "Field 1 Label",
      type: "text",
      required: true,
    },
    {
      name: "field2",
      label: "Field 2 Label",
      type: "number",
      min: 0,
    },
  ],
};
```

### Step 3: That's It!

The system will automatically:

- Show the form when "+" is clicked
- Validate inputs
- Execute the mutation
- Handle success/error
- Refresh the table

## Error Handling

### Missing Mutation

If a table has field config but no mutation:

```
⚠️ No hay mutación configurada para esta tabla
```

### GraphQL Error

```
❌ Error al crear registro: Field 'name' is required
```

### Network Error

```
❌ Error al crear registro: Network error
```

## Testing

### Manual Test Steps

1. Open database page
2. Click on a table with field config (e.g., SellerLevel)
3. Click the "+" button in the modal header
4. Fill out the form
5. Click "Guardar"
6. Verify:
   - Success toast appears
   - Modal closes
   - Table refreshes with new record

### Console Logs

```typescript
// On submit
"Form submitted:", { levelName: "Novato", ... }

// On success
"Record created successfully:", { createSellerLevel: { ... } }

// On error
"Error creating record:", Error { message: "..." }
```

## Troubleshooting

### Form Not Appearing

- ✅ Check `hasFieldConfig(tableName)` returns `true`
- ✅ Verify field configuration in `newRecordFields.ts`

### Mutation Not Executing

- ✅ Check `hasCreateMutation(tableName)` returns `true`
- ✅ Verify mutation in `graphql/database/mutations.ts`
- ✅ Check GraphQL schema has the mutation defined

### Wrong Data Format

- ✅ Ensure field names match GraphQL input type
- ✅ Check field types (string vs number, etc.)
- ✅ Verify required fields are marked in config

### Table Not Refreshing

- ✅ Verify `onRecordCreated` is passed to modal
- ✅ Check `refetch()` is being called
- ✅ Ensure query variables haven't changed

## Benefits

1. **Type Safety**: TypeScript ensures correct types
2. **Centralized**: All mutations in one place
3. **Maintainable**: Easy to add new tables
4. **Consistent**: Same behavior across all tables
5. **Error Handling**: Unified error handling
6. **Loading States**: Automatic loading indicators
7. **User Feedback**: Toast notifications for all states

## Currently Configured Tables

✅ **Location** (4):

- Country, Region, City, County

✅ **Catalog** (3):

- Department, DepartmentCategory, ProductCategory

✅ **Users** (2):

- SellerCategory, SellerLevel

✅ **Services** (2):

- ServiceCategory, ServiceSubCategory

✅ **Store** (2):

- StoreCategory, StoreSubCategory

✅ **Community** (2):

- CommunityCategory, CommunitySubCategory

✅ **Sustainability** (3):

- MaterialImpactEstimate, Co2ImpactMessage, WaterImpactMessage

✅ **Other** (3):

- ShippingStatus, BlogPost, NotificationTemplate

**Total: 21 tables fully functional! 🎉**
