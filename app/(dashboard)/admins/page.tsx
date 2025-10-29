"use client";
import { Title } from "@/ui/text/title";
import { Shield } from "lucide-react";
import { Text } from "@/ui/text/text";
import Modal from "@/ui/modals/modal";
import AdminForm from "./_ui/adminForm";
import MainLayout from "@/ui/layout/mainLayout";
import AdminsHeader from "./_ui/header";
import StatsSection from "./_ui/stats";
import AdminFilters from "./_ui/filters";
import AdminsTable from "./_ui/table";
import Pagination from "@/ui/pagination/pagination";
import useAdmins from "./_hooks/useAdmins";
import { redirect } from "next/navigation";

export default function AdministratorsPage() {
  const {
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
  } = useAdmins();

  if (!isPlatformAdmin) {
    redirect("/home");
  }

  if (!canCreateAdmins && !isPlatformAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Title variant="h2">Acceso Denegado</Title>
            <Text className="text-gray-600 dark:text-gray-400 mt-2">
              No tienes permisos para acceder a esta sección.
            </Text>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Text>Cargando administradores...</Text>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Text className="text-red-600">Error al cargar administradores: {error.message}</Text>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 mb-12">
        {/* Header */}
        <AdminsHeader canCreateAdmins={canCreateAdmins} setIsCreateModalOpen={setIsModalOpened} setMode={setMode} />

        {/* Stats */}
        <StatsSection stats={stats} />

        {/* Filters */}
        <AdminFilters
          filterRole={filterRole}
          filterType={filterType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilterRole={setFilterRole}
          setFilterType={setFilterType}
        />

        {/* Admins Table */}
        <AdminsTable
          filteredAdmins={filteredAdmins}
          canCreateAdmins={canCreateAdmins}
          handleEdit={handleEdit}
          handleToggleStatus={handleToggleStatus}
          handleDelete={handleDelete}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={pageInfo?.totalPages as number}
          setCurrentPage={setCurrentPage}
          itemsPerPage={pageSize}
          setItemsPerPage={setPageSize}
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpened && mode === "create"}
        onClose={() => setIsModalOpened(false)}
        title="Crear Administrador"
        size="xl"
      >
        <AdminForm onSubmit={handleCreate} isLoading={creating} mode={mode} currentAdminRole={sessionData.role} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpened && mode === "edit"}
        onClose={() => {
          setIsModalOpened(false);
          setSelectedAdmin(null);
        }}
        title="Editar Administrador"
        size="xl"
      >
        <AdminForm
          onSubmit={handleUpdate}
          initialData={selectedAdmin}
          isLoading={updating}
          mode={mode}
          currentAdminRole={sessionData.role}
        />
      </Modal>
    </MainLayout>
  );
}
