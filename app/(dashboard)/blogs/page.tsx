"use client";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { BlogForm } from "@/ui/forms/blog/blogForm";
import { BlogCategory } from "@/types/enums";
import { GET_BLOG_POSTS } from "@/graphql/blog/queries";
import {
  CREATE_BLOG_POST,
  UPDATE_BLOG_POST,
  DELETE_BLOG_POST,
  PUBLISH_BLOG_POST,
  UNPUBLISH_BLOG_POST,
} from "@/graphql/blog/mutations";
import { Title } from "@/ui/text/title";
import { Text } from "@/ui/text/text";
import { BlogPost } from "@/types/blog";
import MainLayout from "@/ui/layout/mainLayout";
import StatsSection from "./_ui/stats";
import Modal from "@/ui/modals/modal";
import ControlsSection from "./_ui/controls";
import BlogsGridSection from "./_ui/blogsGrid";

type FilterType = "all" | "published" | "draft";
type QueryConnection = {
  pageInfo: {
    currentPage: number;
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    startCursor: string | null;
    totalCount: number;
    totalPages: number;
  };
  nodes: BlogPost[];
};

export default function BlogPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery<{ getBlogPosts: QueryConnection }>(GET_BLOG_POSTS);
  const [createBlogPost, { loading: creating }] = useMutation(CREATE_BLOG_POST);
  const [updateBlogPost, { loading: updating }] = useMutation(UPDATE_BLOG_POST);
  const [deleteBlogPost] = useMutation(DELETE_BLOG_POST);
  const [publishBlogPost] = useMutation(PUBLISH_BLOG_POST);
  const [unpublishBlogPost] = useMutation(UNPUBLISH_BLOG_POST);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleCurrentPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const posts: BlogPost[] = data?.getBlogPosts.nodes || [];
  const totalPages: number = data?.getBlogPosts.pageInfo.totalPages || 1;

  // Filter posts based on search, status, and category
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "published" && post.isPublished) ||
      (filterType === "draft" && !post.isPublished);

    return matchesSearch && matchesFilter;
  });

  const handleCreate = async (formData: {
    title: string;
    content: string;
    category: BlogCategory;
    isPublished: boolean;
  }) => {
    try {
      const result = await createBlogPost({
        variables: {
          input: {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            isPublished: formData.isPublished,
          },
        },
      });
      if (result.data) {
        setIsCreateModalOpen(false);
        refetch();
      }
    } catch (err) {
      console.error("Error creating blog post:", err);
      alert("Error al crear el post: " + (err instanceof Error ? err.message : "Error desconocido"));
    }
  };

  const handleEdit = (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      setEditingPost(post);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdate = async (formData: {
    title: string;
    content: string;
    category: BlogCategory;
    isPublished: boolean;
  }) => {
    if (!editingPost) return;

    try {
      await updateBlogPost({
        variables: {
          id: editingPost.id,
          input: {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            isPublished: formData.isPublished,
          },
        },
      });
      setIsEditModalOpen(false);
      setEditingPost(null);
      refetch();
    } catch (err) {
      console.error("Error updating blog post:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este post?")) {
      try {
        await deleteBlogPost({ variables: { id } });
        refetch();
      } catch (err) {
        console.error("Error deleting blog post:", err);
      }
    }
  };

  const handleTogglePublish = async (id: number, currentState: boolean) => {
    try {
      if (currentState) {
        await unpublishBlogPost({ variables: { id } });
      } else {
        await publishBlogPost({ variables: { id } });
      }
      refetch();
    } catch (err) {
      console.error("Error toggling publish state:", err);
    }
  };

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
                category: editingPost.category,
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
