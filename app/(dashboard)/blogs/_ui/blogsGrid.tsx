import { BlogPost } from "@/types/blog";
import MainButton from "@/ui/buttons/mainButton";
import { BlogCard } from "@/ui/cards/blog";
import { Text } from "@/ui/text/text";
import { Title } from "@/ui/text/title";
import { ApolloError } from "@apollo/client";
import { FileText, Plus } from "lucide-react";

type Props = {
  filteredPosts: BlogPost[];
  loading: boolean;
  error: ApolloError | undefined;
  searchQuery: string;
  filterType: "all" | "published" | "draft";
  setIsCreateModalOpen: (open: boolean) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  handleTogglePublish: (id: number, currentState: boolean) => void;
};

export default function BlogsGridSection({
  filteredPosts,
  loading,
  error,
  searchQuery,
  filterType,
  setIsCreateModalOpen,
  handleEdit,
  handleDelete,
  handleTogglePublish,
}: Props) {
  console.log("posts in grid section:", filteredPosts);

  return (
    <section>
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <Text variant="p" className="mt-4 text-gray-600">
            Cargando posts...
          </Text>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Text variant="p" className="text-red-600">
            Error al cargar los posts. Por favor intenta nuevamente.
          </Text>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Title variant="h4" className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron posts
          </Title>
          <Text variant="p" className="mb-6">
            {searchQuery || filterType !== "all"
              ? "Intenta ajustar tu búsqueda o filtros"
              : "Comienza creando tu primer post"}
          </Text>
          {!searchQuery && filterType === "all" && (
            <MainButton text="Crear tu Primer Post" onClick={() => setIsCreateModalOpen(true)} hasIcon icon={Plus} />
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
              authorName={`${post.author.name} ${post.author.lastName}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
