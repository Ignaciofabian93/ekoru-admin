# Database Tables Dynamic Data Fetching

## 📋 Overview

This setup provides a scalable solution for fetching data from **45+ database tables** dynamically without creating individual queries for each table.

## 🏗️ Architecture

### 1. **Query Generator** (`graphql/database/queryGenerator.ts`)

Creates GraphQL queries dynamically based on table name:

```typescript
// Auto-generates queries for any table
const query = generateTableQuery("users");

// Or uses predefined queries for complex tables
const query = TABLE_QUERIES["admins"];
```

**Benefits:**

- ✅ Works for all 45 tables automatically
- ✅ Allows custom queries for specific tables
- ✅ Type-safe with GraphQL DocumentNode
- ✅ Easy to maintain

### 2. **Custom Hook** (`hooks/useTableData.tsx`)

Reusable hook for fetching table data:

```typescript
const { data, loading, error, refetch } = useTableData({
  tableName: "admins",
  limit: 10,
  offset: 0,
  filters: { isActive: true },
});
```

**Features:**

- ✅ Handles loading & error states
- ✅ Supports pagination
- ✅ Allows custom filters
- ✅ Cache-and-network policy

### 3. **Dynamic DataTable Component**

Renders any table data automatically:

- Auto-detects columns from data
- Dynamic headers and cells
- Search, pagination, actions
- Loading & error states

## 🚀 How to Use

### For Most Tables (Auto-Generated Queries)

No setup needed! Just use the table name:

```typescript
<DataTable tableName="users" />
<DataTable tableName="products" />
<DataTable tableName="orders" />
```

### For Complex Tables (Custom Queries)

Add a custom query to `TABLE_QUERIES` in `queryGenerator.ts`:

```typescript
export const TABLE_QUERIES: Record<string, DocumentNode> = {
  admins: gql`
    query GetAdmins($limit: Int, $offset: Int) {
      getAdmins(limit: $limit, offset: $offset) {
        id
        email
        name
        # ... all specific fields
        region {
          id
          region
        }
      }
    }
  `,

  // Add more as needed
  users: gql`...`,
  products: gql`...`,
};
```

## 📝 Next Steps

### 1. **Update Backend GraphQL Schema**

Ensure your GraphQL server has queries following this naming convention:

```graphql
type Query {
  getAdmins(limit: Int, offset: Int, ...filters): [Admin!]!
  getUsers(limit: Int, offset: Int, ...filters): [User!]!
  getProducts(limit: Int, offset: Int, ...filters): [Product!]!
  # ... etc
}
```

### 2. **Add Table-Specific Queries**

For the most frequently used tables, add detailed queries to `TABLE_QUERIES`:

**Priority tables:**

1. `admins` ✅ (Already done)
2. `users`
3. `products`
4. `orders`
5. `sellers`

### 3. **Enhance Query Generator**

You can make the auto-generator smarter by:

```typescript
// Option A: Read from Prisma schema
import { Prisma } from "@prisma/client";

// Option B: Introspect GraphQL schema
import { getIntrospectionQuery } from "graphql";

// Option C: Define table metadata
const TABLE_METADATA = {
  users: {
    fields: ["id", "email", "name", "createdAt"],
    relations: ["orders", "profile"],
  },
};
```

### 4. **Add Server-Side Pagination**

Update `useTableData` to support server-side pagination:

```typescript
const { data, loading, error, refetch, totalCount } = useTableData({
  tableName: "users",
  limit: 10,
  offset: (currentPage - 1) * 10,
});
```

Add a count query:

```graphql
query GetUsersCount($filters: UserFilters) {
  getUsersCount(filters: $filters)
}
```

## 🎯 Best Practices

### When to Use Auto-Generated Queries

- ✅ Simple tables with basic fields
- ✅ Quick prototyping
- ✅ Admin-only views
- ✅ Low-traffic tables

### When to Create Custom Queries

- ✅ Tables with relations (joins)
- ✅ Tables requiring specific filters
- ✅ High-traffic tables needing optimization
- ✅ Tables with computed fields

## 🔧 Troubleshooting

### Issue: Query not working

**Solution:** Add a custom query to `TABLE_QUERIES`

### Issue: Missing fields

**Solution:** Update the auto-generator or create custom query

### Issue: Slow performance

**Solution:**

1. Add indexes to database
2. Implement server-side pagination
3. Add field selection (don't fetch all fields)

## 📊 Performance Tips

1. **Limit fields fetched** - Only request needed columns
2. **Use pagination** - Don't fetch all records at once
3. **Cache queries** - Apollo Client caches automatically
4. **Add loading skeletons** - Better UX during fetch
5. **Debounce search** - Prevent too many requests

## 🔐 Security Considerations

1. **Add authentication** - Verify user has access to table
2. **Filter sensitive data** - Don't expose passwords, tokens
3. **Rate limiting** - Prevent abuse
4. **Input validation** - Sanitize search terms

## 📚 Additional Resources

- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)
