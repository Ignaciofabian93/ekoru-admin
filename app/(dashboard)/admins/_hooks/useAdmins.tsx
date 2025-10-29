import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ADMIN, DELETE_ADMIN, TOGGLE_ADMIN_STATUS, UPDATE_ADMIN } from "@/graphql/admins/mutations";
import { Admin, AdminRole, AdminType } from "@/types";
import { AdminFormData } from "../_ui/adminForm";
import { GET_ADMINS } from "@/graphql/admins/queries";
import useAdminType from "@/hooks/useAdminType";
import useSessionStore from "@/store/session";

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

type AdminsQueryResult = {
  getAdmins: {
    pageInfo: PageInfo;
    nodes: Admin[];
  };
};

export default function useAdmins() {
  const { data: sessionData } = useSessionStore();
  const { isPlatformAdmin } = useAdminType();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<AdminType | "ALL">("ALL");
  const [filterRole, setFilterRole] = useState<AdminRole | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery<AdminsQueryResult>(GET_ADMINS, {
    variables: {
      adminType: filterType === "ALL" ? null : filterType,
      role: filterRole === "ALL" ? null : filterRole,
      page: currentPage,
      pageSize: pageSize,
    },
  });
  const [createAdmin, { loading: creating }] = useMutation(CREATE_ADMIN);
  const [updateAdmin, { loading: updating }] = useMutation(UPDATE_ADMIN);
  const [deleteAdmin] = useMutation(DELETE_ADMIN);
  const [toggleAdminStatus] = useMutation(TOGGLE_ADMIN_STATUS);

  const admins: Admin[] = data?.getAdmins.nodes || [];
  const pageInfo = data?.getAdmins.pageInfo;

  // Only SUPER_ADMIN can create more admins
  const canCreateAdmins = sessionData.role === "SUPER_ADMIN" && isPlatformAdmin;

  // Filter admins
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.lastName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "ALL" || admin.adminType === filterType;
    const matchesRole = filterRole === "ALL" || admin.role === filterRole;

    return matchesSearch && matchesType && matchesRole;
  });

  // Statistics
  const stats = {
    total: admins.length,
    platform: admins.filter((a) => a.adminType === "PLATFORM").length,
    business: admins.filter((a) => a.adminType === "BUSINESS").length,
    active: admins.filter((a) => a.isActive).length,
  };

  const handleCreate = async (formData: AdminFormData) => {
    try {
      await createAdmin({
        variables: {
          input: {
            email: formData.email,
            name: formData.name,
            lastName: formData.lastName,
            password: formData.password,
            adminType: formData.adminType,
            role: formData.role,
            permissions: formData.permissions,
            sellerId: formData.sellerId || null,
          },
        },
      });
      setIsModalOpened(false);
      refetch();
    } catch (err) {
      console.error("Error creating admin:", err);
      alert("Error al crear administrador: " + (err instanceof Error ? err.message : "Error desconocido"));
    }
  };

  const handleEdit = (admin: Admin) => {
    setMode("edit");
    setSelectedAdmin(admin);
    setIsModalOpened(true);
  };

  const handleUpdate = async (formData: AdminFormData) => {
    if (!selectedAdmin) return;

    try {
      await updateAdmin({
        variables: {
          id: selectedAdmin.id,
          input: {
            name: formData.name,
            lastName: formData.lastName,
            adminType: formData.adminType,
            role: formData.role,
            permissions: formData.permissions,
            sellerId: formData.sellerId || null,
          },
        },
      });
      setIsModalOpened(false);
      setSelectedAdmin(null);
      refetch();
    } catch (err) {
      console.error("Error updating admin:", err);
      alert("Error al actualizar administrador: " + (err instanceof Error ? err.message : "Error desconocido"));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este administrador?")) {
      try {
        await deleteAdmin({ variables: { id } });
        refetch();
      } catch (err) {
        console.error("Error deleting admin:", err);
        alert("Error al eliminar administrador: " + (err instanceof Error ? err.message : "Error desconocido"));
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleAdminStatus({ variables: { id, isActive: !currentStatus } });
      refetch();
    } catch (err) {
      console.error("Error toggling admin status:", err);
      alert("Error al cambiar estado: " + (err instanceof Error ? err.message : "Error desconocido"));
    }
  };

  return {
    sessionData,
    isPlatformAdmin,
    handleToggleStatus,
    handleDelete,
    handleUpdate,
    handleEdit,
    handleCreate,
    stats,
    filteredAdmins,
    canCreateAdmins,
    creating,
    updating,
    loading,
    error,
    setSearchQuery,
    setFilterType,
    setFilterRole,
    setCurrentPage,
    setPageSize,
    pageInfo,
    searchQuery,
    filterType,
    filterRole,
    currentPage,
    pageSize,
    mode,
    setMode,
    selectedAdmin,
    isModalOpened,
    setIsModalOpened,
    setSelectedAdmin,
  };
}
