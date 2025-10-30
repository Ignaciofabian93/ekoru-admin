import {
  CREATE_BLOG_POST,
  DELETE_BLOG_POST,
  PUBLISH_BLOG_POST,
  UNPUBLISH_BLOG_POST,
  UPDATE_BLOG_POST,
} from "@/graphql/blog/mutations";
import { GET_BLOG_POSTS } from "@/graphql/blog/queries";
import useAlert from "@/hooks/useAlert";
import { BlogPost } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

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

export default function useBlogs() {
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

  const { notify, notifyError } = useAlert();

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
    blogCategoryId: number;
    isPublished: boolean;
  }) => {
    try {
      const result = await createBlogPost({
        variables: {
          input: {
            title: formData.title,
            content: formData.content,
            blogCategoryId: formData.blogCategoryId,
            isPublished: formData.isPublished,
          },
        },
      });
      if (result.data) {
        setIsCreateModalOpen(false);
        refetch();
        notify("Post creado exitosamente");
      }
    } catch (err) {
      console.error("Error creating blog post:", err);
      notifyError("Error al crear el post");
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
    blogCategoryId: number;
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
            blogCategoryId: formData.blogCategoryId,
            isPublished: formData.isPublished,
          },
        },
      });
      setIsEditModalOpen(false);
      setEditingPost(null);
      refetch();
      notify("Post actualizado exitosamente");
    } catch (err) {
      console.error("Error updating blog post:", err);
      notifyError("Error al actualizar el post");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este post?")) {
      try {
        await deleteBlogPost({ variables: { id } });
        refetch();
        notify("Post eliminado exitosamente");
      } catch (err) {
        console.error("Error deleting blog post:", err);
        notifyError("Error al eliminar el post");
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
      notify(`Post ${currentState ? "despublicado" : "publicado"} exitosamente`);
    } catch (err) {
      console.error("Error toggling publish state:", err);
      notifyError(`Error al ${currentState ? "despublicar" : "publicar"} el post`);
    }
  };

  return {
    handleTogglePublish,
    handleDelete,
    handleUpdate,
    handleEdit,
    handleCreate,
    filteredPosts,
    totalPages,
    itemsPerPage,
    currentPage,
    handleCurrentPageChange,
    handleItemsPerPageChange,
    loading,
    error,
    creating,
    updating,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    editingPost,
    setEditingPost,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    posts,
  };
}
