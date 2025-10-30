"use client";
import { Title } from "@/ui/text/title";
import { Text } from "@/ui/text/text";
import MainLayout from "@/ui/layout/mainLayout";
import StatsSection from "./_ui/stats";
import Modal from "@/ui/modals/modal";
import ControlsSection from "./_ui/controls";
import BlogsGridSection from "./_ui/blogsGrid";
import BlogForm from "./_ui/blogForm";
import useBlogs from "./_hooks/useBlogs";

export default function BlogPage() {
  const {
    posts,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    setIsCreateModalOpen,
    filteredPosts,
    loading,
    error,
    handleEdit,
    handleDelete,
    handleTogglePublish,
    totalPages,
    itemsPerPage,
    currentPage,
    handleItemsPerPageChange,
    handleCurrentPageChange,
    handleCreate,
    creating,
    handleUpdate,
    updating,
    isCreateModalOpen,
    isEditModalOpen,
    setEditingPost,
    setIsEditModalOpen,
    editingPost,
  } = useBlogs();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Title variant="h2" className="text-3xl font-bold text-gray-900 mb-2">
            Posts
          </Title>
          <Text variant="p" className="">
            Administra el contenido y las publicaciones
          </Text>
        </div>

        {/* Stats */}
        <StatsSection posts={posts} />

        {/* Controls */}
        <ControlsSection
          searchQuery={searchQuery}
          setSearchQuery={(e) => setSearchQuery(e.target.value)}
          filterType={filterType}
          setFilterType={setFilterType}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />

        {/* Blog Posts Grid */}
        <BlogsGridSection
          filterType={filterType}
          filteredPosts={filteredPosts}
          loading={loading}
          error={error}
          searchQuery={searchQuery}
          setIsCreateModalOpen={setIsCreateModalOpen}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleTogglePublish={handleTogglePublish}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          handleCurrentPageChange={handleCurrentPageChange}
        />

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Crear Nuevo Post"
          size="xl"
        >
          <BlogForm onSubmit={handleCreate} onCancel={() => setIsCreateModalOpen(false)} isLoading={creating} />
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPost(null);
          }}
          title="Editar Post"
          size="xl"
        >
          {editingPost && (
            <BlogForm
              initialData={{
                title: editingPost.title,
                content: editingPost.content,
                blogCategory: editingPost.blogCategory,
                isPublished: editingPost.isPublished,
              }}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingPost(null);
              }}
              isLoading={updating}
            />
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
