"use client";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import MainLayout from "@/ui/layout/mainLayout";
import { BlogCard } from "@/ui/cards/blog/blogCard";
import { BlogForm } from "@/ui/forms/blog/blogForm";
import Modal from "@/ui/modals/modal";
import { BlogCategory } from "@/types/enums";
import { GET_BLOG_POSTS } from "@/graphql/blog/queries";
import {
  CREATE_BLOG_POST,
  UPDATE_BLOG_POST,
  DELETE_BLOG_POST,
  PUBLISH_BLOG_POST,
  UNPUBLISH_BLOG_POST,
} from "@/graphql/blog/mutations";
import { Search, Plus, Filter, FileText, CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";
import { Title } from "@/ui/text/title";
import { Text } from "@/ui/text/text";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  authorId: string;
}

type FilterType = "all" | "published" | "draft";

export default function BlogPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(GET_BLOG_POSTS);
  const [createBlogPost, { loading: creating }] = useMutation(CREATE_BLOG_POST);
  const [updateBlogPost, { loading: updating }] = useMutation(UPDATE_BLOG_POST);
  const [deleteBlogPost] = useMutation(DELETE_BLOG_POST);
  const [publishBlogPost] = useMutation(PUBLISH_BLOG_POST);
  const [unpublishBlogPost] = useMutation(UNPUBLISH_BLOG_POST);

  const posts: BlogPost[] = data?.getBlogPosts || [];

  // Filter posts based on search, status, and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filterType === "all" ||
      (filterType === "published" && post.isPublished) ||
      (filterType === "draft" && !post.isPublished);

    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.isPublished).length,
    draft: posts.filter((p) => !p.isPublished).length,
  };

  const handleCreate = async (formData: {
    title: string;
    content: string;
    category: BlogCategory;
    tags: string[];
    isPublished: boolean;
  }) => {
    try {
      console.log("Creating post with data:", formData);

      const result = await createBlogPost({
        variables: {
          input: {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            tags: formData.tags,
            isPublished: formData.isPublished,
          },
        },
      });

      console.log("Post created successfully:", result);
      setIsCreateModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Error creating blog post:", err);
      alert("Error al crear el post: " + (err instanceof Error ? err.message : "Error desconocido"));
    }
  };

  const handleEdit = (id: string) => {
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
    tags: string[];
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
            tags: formData.tags,
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

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este post?")) {
      try {
        await deleteBlogPost({ variables: { id } });
        refetch();
      } catch (err) {
        console.error("Error deleting blog post:", err);
      }
    }
  };

  const handleTogglePublish = async (id: string, currentState: boolean) => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="label" className="mb-1">
                  Total
                </Text>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="label" className="mb-1">
                  Publicados
                </Text>
                <p className="text-3xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="label" className="mb-1">
                  Borrador
                </Text>
                <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <XCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Busca posts por título, contenido o etiquetas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                  filterType === "all" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <Filter className="w-4 h-4" />
                Todos
              </button>
              <button
                onClick={() => setFilterType("published")}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                  filterType === "published" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <CheckCircle className="w-4 h-4" />
                Publicados
              </button>
              <button
                onClick={() => setFilterType("draft")}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                  filterType === "draft" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <XCircle className="w-4 h-4" />
                Borrador
              </button>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Nuevo Post
            </button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Cargando posts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error al cargar los posts. Por favor intenta nuevamente.</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron posts</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterType !== "all"
                ? "Intenta ajustar tu búsqueda o filtros"
                : "Comienza creando tu primer post"}
            </p>
            {!searchQuery && filterType === "all" && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Crear tu Primer Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                {...post}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
              />
            ))}
          </div>
        )}

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Crear Nuevo Post"
          size="xl"
        >
          <BlogForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={creating}
            submitLabel="Crear Post"
          />
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
                tags: editingPost.tags,
                isPublished: editingPost.isPublished,
              }}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingPost(null);
              }}
              isLoading={updating}
              submitLabel="Actualizar Post"
            />
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
