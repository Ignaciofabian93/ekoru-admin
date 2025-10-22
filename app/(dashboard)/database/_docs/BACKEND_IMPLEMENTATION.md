# Backend Implementation Guide for Bulk Import

## Overview

This guide will help you implement the backend `bulkImport` mutation for handling Excel data imports.

---

## 🎯 Required Mutations

### 1. Bulk Import Mutation

```graphql
type BulkImportResult {
  success: Boolean!
  insertedCount: Int!
  failedCount: Int!
  errors: [String!]
}

input BulkImportInput {
  tableName: String!
  data: [JSON!]!
}

extend type Mutation {
  bulkImport(tableName: String!, data: [JSON!]!): BulkImportResult!
}
```

---

## 🔧 Implementation Steps

### Step 1: Define Allowed Tables

Create a whitelist of tables that can be imported to prevent SQL injection:

```typescript
const ALLOWED_TABLES = [
  "users",
  "admins",
  "products",
  "categories",
  "orders",
  "transactions",
  // ... add your tables here
];

function validateTableName(tableName: string): boolean {
  return ALLOWED_TABLES.includes(tableName);
}
```

### Step 2: Create Validation Schema

Define validation rules for each table:

```typescript
interface TableSchema {
  requiredFields: string[];
  optionalFields: string[];
  validators: Record<string, (value: any) => boolean>;
}

const TABLE_SCHEMAS: Record<string, TableSchema> = {
  admins: {
    requiredFields: ["email", "name", "role", "adminType"],
    optionalFields: ["lastName", "phone", "sellerId"],
    validators: {
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      role: (value) => ["SUPER_ADMIN", "ADMIN", "MODERATOR"].includes(value),
      adminType: (value) => ["PLATFORM", "BUSINESS"].includes(value),
    },
  },
  users: {
    requiredFields: ["email", "name"],
    optionalFields: ["phone", "address", "cityId"],
    validators: {
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    },
  },
  // ... add more table schemas
};
```

### Step 3: Implement Validation Function

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateRow(row: Record<string, any>, schema: TableSchema, rowIndex: number): ValidationResult {
  const errors: string[] = [];

  // Check required fields
  schema.requiredFields.forEach((field) => {
    if (row[field] === null || row[field] === undefined || row[field] === "") {
      errors.push(`Row ${rowIndex}: Missing required field "${field}"`);
    }
  });

  // Run validators
  Object.entries(schema.validators).forEach(([field, validator]) => {
    if (row[field] !== null && row[field] !== undefined && !validator(row[field])) {
      errors.push(`Row ${rowIndex}: Invalid value for field "${field}"`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Step 4: Implement Bulk Insert with Transaction

```typescript
async function bulkImportResolver(parent: any, args: { tableName: string; data: Record<string, any>[] }, context: any) {
  const { tableName, data } = args;
  const errors: string[] = [];
  let insertedCount = 0;
  let failedCount = 0;

  // 1. Validate table name
  if (!validateTableName(tableName)) {
    return {
      success: false,
      insertedCount: 0,
      failedCount: data.length,
      errors: [`Invalid table name: ${tableName}`],
    };
  }

  // 2. Get schema for validation
  const schema = TABLE_SCHEMAS[tableName];
  if (!schema) {
    return {
      success: false,
      insertedCount: 0,
      failedCount: data.length,
      errors: [`No schema defined for table: ${tableName}`],
    };
  }

  // 3. Validate all rows first
  const validationErrors: string[] = [];
  const validRows: Record<string, any>[] = [];

  data.forEach((row, index) => {
    const validation = validateRow(row, schema, index + 1);
    if (validation.valid) {
      validRows.push(row);
    } else {
      validationErrors.push(...validation.errors);
      failedCount++;
    }
  });

  // If there are validation errors, return them
  if (validationErrors.length > 0) {
    return {
      success: false,
      insertedCount: 0,
      failedCount,
      errors: validationErrors,
    };
  }

  // 4. Use database transaction
  const transaction = await context.db.transaction();

  try {
    // 5. Insert rows in batches (e.g., 100 at a time)
    const batchSize = 100;
    for (let i = 0; i < validRows.length; i += batchSize) {
      const batch = validRows.slice(i, i + batchSize);

      // Use your ORM's bulk insert method
      // Example with Prisma:
      // await transaction[tableName].createMany({ data: batch });

      // Example with TypeORM:
      // await transaction.getRepository(tableName).insert(batch);

      // Example with raw SQL (be careful with SQL injection):
      // const placeholders = batch.map(() => '(?, ?, ?)').join(',');
      // await transaction.query(`INSERT INTO ${tableName} VALUES ${placeholders}`, batch);

      insertedCount += batch.length;
    }

    // 6. Commit transaction
    await transaction.commit();

    return {
      success: true,
      insertedCount,
      failedCount: 0,
      errors: [],
    };
  } catch (error) {
    // 7. Rollback on error
    await transaction.rollback();

    return {
      success: false,
      insertedCount: 0,
      failedCount: validRows.length,
      errors: [`Database error: ${error.message}`],
    };
  }
}
```

### Step 5: Add Permissions Check

```typescript
async function bulkImportResolver(parent: any, args: { tableName: string; data: Record<string, any>[] }, context: any) {
  // Check if user is authenticated
  if (!context.user) {
    throw new Error("Unauthorized");
  }

  // Check if user is platform admin
  if (context.user.adminType !== "PLATFORM") {
    throw new Error("Only platform admins can bulk import data");
  }

  // Rest of the implementation...
}
```

### Step 6: Add Logging

```typescript
async function bulkImportResolver(parent: any, args: { tableName: string; data: Record<string, any>[] }, context: any) {
  // Log the import attempt
  await context.db.auditLog.create({
    data: {
      action: "BULK_IMPORT",
      tableName: args.tableName,
      userId: context.user.id,
      rowCount: args.data.length,
      timestamp: new Date(),
    },
  });

  // Rest of the implementation...

  // Log the result
  await context.db.auditLog.create({
    data: {
      action: "BULK_IMPORT_RESULT",
      tableName: args.tableName,
      userId: context.user.id,
      insertedCount,
      failedCount,
      timestamp: new Date(),
    },
  });

  return result;
}
```

---

## 🔒 Security Considerations

### 1. Input Sanitization

```typescript
function sanitizeInput(value: any): any {
  if (typeof value === "string") {
    // Remove potential SQL injection
    return value.replace(/[;<>]/g, "");
  }
  return value;
}

// Sanitize all row data
const sanitizedRows = data.map((row) => {
  const sanitized: Record<string, any> = {};
  Object.entries(row).forEach(([key, value]) => {
    sanitized[key] = sanitizeInput(value);
  });
  return sanitized;
});
```

### 2. Rate Limiting

```typescript
const rateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 imports per minute
});

async function bulkImportResolver(...) {
  // Check rate limit
  const allowed = await rateLimiter.check(context.user.id);
  if (!allowed) {
    throw new Error('Rate limit exceeded. Try again later.');
  }

  // Rest of implementation...
}
```

### 3. Row Limit

```typescript
const MAX_ROWS_PER_IMPORT = 10000;

async function bulkImportResolver(...) {
  if (args.data.length > MAX_ROWS_PER_IMPORT) {
    return {
      success: false,
      insertedCount: 0,
      failedCount: args.data.length,
      errors: [`Maximum ${MAX_ROWS_PER_IMPORT} rows allowed per import`],
    };
  }

  // Rest of implementation...
}
```

---

## 🧪 Testing

### Unit Tests

```typescript
describe("bulkImport", () => {
  it("should import valid data", async () => {
    const data = [
      { email: "test1@example.com", name: "Test 1", role: "ADMIN" },
      { email: "test2@example.com", name: "Test 2", role: "ADMIN" },
    ];

    const result = await bulkImport("admins", data);

    expect(result.success).toBe(true);
    expect(result.insertedCount).toBe(2);
    expect(result.failedCount).toBe(0);
  });

  it("should reject invalid table names", async () => {
    const result = await bulkImport("invalid_table", []);

    expect(result.success).toBe(false);
    expect(result.errors).toContain("Invalid table name");
  });

  it("should validate required fields", async () => {
    const data = [{ email: "test@example.com" }]; // Missing 'name'

    const result = await bulkImport("admins", data);

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("Missing required field");
  });

  it("should rollback on error", async () => {
    // Mock database error
    const data = [{ email: "test@example.com", name: "Test" }];

    const result = await bulkImport("admins", data);

    // Verify no data was inserted
    const count = await db.admins.count();
    expect(count).toBe(0);
  });
});
```

---

## 📊 Example Implementations

### Prisma Example

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function bulkImportPrisma(tableName: string, data: any[]) {
  return await prisma.$transaction(async (tx) => {
    // @ts-ignore - Dynamic table access
    const result = await tx[tableName].createMany({
      data,
      skipDuplicates: true, // Optional: skip if duplicate
    });

    return {
      success: true,
      insertedCount: result.count,
      failedCount: 0,
      errors: [],
    };
  });
}
```

### TypeORM Example

```typescript
import { getConnection } from "typeorm";

async function bulkImportTypeORM(tableName: string, data: any[]) {
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    await queryRunner.manager.insert(tableName, data);
    await queryRunner.commitTransaction();

    return {
      success: true,
      insertedCount: data.length,
      failedCount: 0,
      errors: [],
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
```

### Sequelize Example

```typescript
import { Sequelize } from "sequelize";

async function bulkImportSequelize(tableName: string, data: any[]) {
  const transaction = await sequelize.transaction();

  try {
    const Model = sequelize.models[tableName];
    await Model.bulkCreate(data, { transaction });

    await transaction.commit();

    return {
      success: true,
      insertedCount: data.length,
      failedCount: 0,
      errors: [],
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

---

## 🚀 Deployment Checklist

- [ ] Implement table whitelist
- [ ] Add validation schemas for all tables
- [ ] Implement transaction handling
- [ ] Add permissions check (platform admin only)
- [ ] Add rate limiting
- [ ] Add row count limit
- [ ] Add audit logging
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test with large datasets (10,000+ rows)
- [ ] Test rollback on error
- [ ] Test concurrent imports
- [ ] Add monitoring/alerts
- [ ] Document API in backend docs

---

## 📚 Additional Features (Optional)

### 1. Partial Import

Allow inserting valid rows even if some fail:

```typescript
const results = await Promise.allSettled(data.map((row) => db[tableName].create({ data: row })));

const inserted = results.filter((r) => r.status === "fulfilled").length;
const failed = results.filter((r) => r.status === "rejected");

return {
  success: failed.length === 0,
  insertedCount: inserted,
  failedCount: failed.length,
  errors: failed.map((f, i) => `Row ${i + 1}: ${f.reason}`),
};
```

### 2. Duplicate Detection

Check for duplicates before inserting:

```typescript
const emails = data.map((row) => row.email);
const existing = await db.admins.findMany({
  where: { email: { in: emails } },
  select: { email: true },
});

const existingEmails = new Set(existing.map((e) => e.email));
const errors: string[] = [];

data.forEach((row, i) => {
  if (existingEmails.has(row.email)) {
    errors.push(`Row ${i + 1}: Email already exists`);
  }
});
```

### 3. Progress Updates (with WebSocket)

Send progress updates during import:

```typescript
for (let i = 0; i < batches.length; i++) {
  await insertBatch(batches[i]);

  // Send progress update
  context.pubsub.publish("IMPORT_PROGRESS", {
    userId: context.user.id,
    progress: ((i + 1) / batches.length) * 100,
    insertedCount: (i + 1) * batchSize,
  });
}
```

---

## ✅ Summary

Implement these components for a complete bulk import system:

1. ✅ Table whitelist validation
2. ✅ Schema validation per table
3. ✅ Row-by-row validation
4. ✅ Transaction handling (rollback on error)
5. ✅ Permission checks
6. ✅ Rate limiting
7. ✅ Audit logging
8. ✅ Error reporting
9. ✅ Batch processing
10. ✅ Security measures

The frontend is ready and waiting for your backend implementation! 🎉
