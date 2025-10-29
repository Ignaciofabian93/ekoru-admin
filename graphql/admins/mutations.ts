import { gql } from "@apollo/client";

export const CREATE_ADMIN = gql`
  mutation CreateAdmin($input: RegisterAdminInput!) {
    createAdmin(input: $input) {
      id
      email
      name
      lastName
      adminType
      role
      permissions
      sellerId
      isActive
      isEmailVerified
      createdAt
    }
  }
`;

export const UPDATE_ADMIN = gql`
  mutation UpdateAdmin($id: ID!, $input: UpdateAdminInput!) {
    updateAdmin(id: $id, input: $input) {
      id
      email
      name
      lastName
      adminType
      role
      permissions
      sellerId
      isActive
      isEmailVerified
      updatedAt
    }
  }
`;

export const DELETE_ADMIN = gql`
  mutation DeleteAdmin($id: ID!) {
    deleteAdmin(id: $id) {
      id
      email
      name
    }
  }
`;

export const TOGGLE_ADMIN_STATUS = gql`
  mutation ToggleAdminStatus($id: ID!, $isActive: Boolean!) {
    toggleAdminStatus(id: $id, isActive: $isActive) {
      id
      isActive
      updatedAt
    }
  }
`;

export const ASSIGN_PERMISSIONS = gql`
  mutation AssignPermissions($id: ID!, $permissions: [AdminPermission!]!) {
    assignPermissions(id: $id, permissions: $permissions) {
      id
      permissions
      updatedAt
    }
  }
`;
