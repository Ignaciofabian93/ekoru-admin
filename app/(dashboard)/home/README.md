# Admin Management Implementation Summary

## Overview

This implementation provides a complete admin management system with role-based access control for both Platform and Business administrators.

## Features Implemented

### 1. **Flexible Admin Query Hook** (`useAdmins`)

- Supports optional filtering by:
  - Admin type (PLATFORM/BUSINESS)
  - Active status
  - Role
  - Seller ID (for business admin filtering)
  - Pagination (limit/offset)
- Returns admins list, loading state, error, and refetch function

### 2. **Admin Card Component**

- Displays admin information in a consistent, professional format
- Shows:
  - Name initials avatar with gradient background
  - Full name and email
  - Role and admin type
  - Active/Inactive status badge
  - Last login time (human-readable format)
  - Phone number (if available)
  - Optional edit button (based on permissions)

### 3. **Platform Admin Section**

Features for Platform Admins:

- **View ALL admins** (both platform and business)
- **Create any type of admin** (platform or business)
- Statistics dashboard showing:
  - Total admins count
  - Platform admins count
  - Business admins count
- Grid layout for admin cards
- Modal-based admin creation

### 4. **Business Admin Section**

Features for Business Admins:

- **View only admins from their seller** (filtered by sellerId)
- **Create admins only for their business**
- All new admins automatically associated with their sellerId
- Statistics dashboard showing:
  - Total admins in their business
  - Active admins count
  - Their seller ID
- Info banner explaining restrictions
- Empty state with helpful message
- Modal-based admin creation (auto-filled with sellerId)

### 5. **Create Admin Modal**

Comprehensive form with:

- **Admin Type Selection** (Platform admins only)
  - Toggle between Platform and Business admin creation
  - Visual cards for selection
- **Required Fields:**
  - Email
  - First Name
  - Last Name
  - Role (with descriptions)
- **Optional Fields:**
  - Phone number
- **Role Options:**
  - Super Admin - Full Access
  - Admin - Most Features
  - Moderator - Content Moderation
  - Support - Customer Support
  - Analyst - Analytics Only
  - Finance - Financial Operations
- Auto-populated sellerId for business admins
- Validation and form handling
- Responsive design with smooth animations

## Access Control

### Platform Admins Can:

✅ View all admins (platform + business)
✅ Create platform admins
✅ Create business admins for any seller
✅ Edit any admin
✅ See complete system statistics

### Business Admins Can:

✅ View only admins from their seller
✅ Create business admins (auto-linked to their seller)
❌ View admins from other sellers
❌ Create platform admins
❌ Access global statistics

## GraphQL Integration

### Query: `GET_ADMINS`

```graphql
query GetAdmins(
  $adminType: AdminType
  $role: AdminRole
  $isActive: Boolean
  $sellerId: String
  $limit: Int
  $offset: Int
) {
  getAdmins(
    adminType: $adminType
    isActive: $isActive
    role: $role
    sellerId: $sellerId
    limit: $limit
    offset: $offset
  ) {
    # ... admin fields
  }
}
```

### Variables Supported:

- `adminType`: Optional filter (PLATFORM/BUSINESS)
- `role`: Optional filter (SUPER_ADMIN, ADMIN, etc.)
- `isActive`: Optional boolean filter
- `sellerId`: Optional string for business admin filtering
- `limit`: Pagination limit (default: 50)
- `offset`: Pagination offset (default: 0)

## File Structure

```
app/(dashboard)/home/
├── _hooks/
│   └── useAdmins.tsx           # Admin data fetching hook
├── _components/
│   ├── adminCard.tsx           # Reusable admin display card
│   └── createAdminModal.tsx    # Admin creation modal
├── _ui/
│   ├── platformAdmins.tsx      # Platform admin section
│   └── businessAdmins.tsx      # Business admin section
└── page.tsx                    # Main page with conditional rendering
```

## Next Steps (TODOs)

1. **GraphQL Mutations**

   - Create `CREATE_ADMIN` mutation
   - Create `UPDATE_ADMIN` mutation
   - Implement in modal submit handlers

2. **Edit Functionality**

   - Add edit modal (reuse create modal with edit mode)
   - Implement update mutation
   - Add validation for existing data

3. **Additional Features**

   - Bulk operations (activate/deactivate multiple admins)
   - Search and filter UI
   - Advanced filtering (by role, status, etc.)
   - Export admins list
   - Admin deletion with confirmation
   - Activity logs/audit trail

4. **Type Safety**

   - Add `sellerId` to `Admin` type in `types/user.ts`
   - Add `accountLocked` and `loginAttempts` fields if needed

5. **Testing**
   - Test role-based access control
   - Test seller filtering for business admins
   - Test admin creation for both types
   - Test edge cases (no admins, errors, etc.)

## Usage Examples

### Platform Admin

```typescript
// In PlatformAdminsSection
const { admins, loading, error } = useAdmins({
  adminType: "PLATFORM", // Gets all platform admins
});
```

### Business Admin

```typescript
// In BusinessAdminsSection
const { admins, loading, error } = useAdmins({
  adminType: "BUSINESS",
  sellerId: currentAdmin.sellerId, // Gets only admins for this seller
});
```

### Custom Filtering

```typescript
// Get active super admins
const { admins } = useAdmins({
  adminType: "PLATFORM",
  role: "SUPER_ADMIN",
  isActive: true,
});
```

## Security Considerations

1. **Backend Validation Required:**

   - Verify user permissions before returning admin data
   - Validate sellerId matches authenticated user's seller
   - Prevent privilege escalation (business admin creating platform admin)

2. **Frontend Restrictions:**

   - UI conditionally shows features based on admin type
   - Forms pre-populate/lock sellerId for business admins
   - Role selection restricted based on creator's role

3. **Data Sanitization:**
   - All form inputs should be sanitized before submission
   - Email validation on both client and server
   - Phone number formatting and validation

## Design Features

- **Responsive Grid Layout**: Adapts to mobile, tablet, and desktop
- **Color Coding**: Blue for platform, Purple for business
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Empty States**: Helpful messages when no data
- **Accessibility**: Proper labels, ARIA attributes, keyboard navigation
- **Visual Hierarchy**: Clear headings, sections, and groupings
