"use client";
import { motion } from "framer-motion";
import { Calendar, Edit, Trash2, CheckCircle, XCircle, UserRound } from "lucide-react";
import { BlogCategory } from "@/types/enums";
import { getCategoryLabel } from "@/utils/blogTranslations";
import { Title } from "@/ui/text/title";
import { Text } from "@/ui/text/text";
import clsx from "clsx";

interface BlogCardProps {
  id: number;
  title: string;
  content: string;
  category: BlogCategory;
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onTogglePublish: (id: number, currentState: boolean) => void;
  authorName?: string;
}

const categoryColors: Record<BlogCategory, string> = {
  RECYCLING: "bg-green-100 text-green-800",
  POLLUTION: "bg-red-100 text-red-800",
  SUSTAINABILITY: "bg-emerald-100 text-emerald-800",
  CIRCULAR_ECONOMY: "bg-blue-100 text-blue-800",
  USED_PRODUCTS: "bg-purple-100 text-purple-800",
  REUSE: "bg-teal-100 text-teal-800",
  ENVIRONMENT: "bg-lime-100 text-lime-800",
  UPCYCLING: "bg-cyan-100 text-cyan-800",
  RESPONSIBLE_CONSUMPTION: "bg-indigo-100 text-indigo-800",
  ECO_TIPS: "bg-yellow-100 text-yellow-800",
  ENVIRONMENTAL_IMPACT: "bg-orange-100 text-orange-800",
  SUSTAINABLE_LIVING: "bg-green-100 text-green-800",
  SECURITY: "bg-slate-100 text-slate-800",
  OTHER: "bg-gray-100 text-gray-800",
};

export function BlogCard({
  id,
  title,
  content,
  category,
  isPublished,
  createdAt,
  onEdit,
  onDelete,
  onTogglePublish,
  authorName,
}: BlogCardProps) {
  const excerpt = content.substring(0, 150) + (content.length > 150 ? "..." : "");
  const formattedDate = new Date(createdAt).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "bg-white dark:bg-stone-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border overflow-hidden",
        isPublished ? "border-lime-200" : "border-gray-200"
      )}
    >
      {/* Header with status indicator */}
      <div className="relative">
        <div className={clsx("h-2", isPublished ? "bg-lime-500" : "bg-gray-400")} />
        <div className="absolute top-4 right-4">
          <span
            className={clsx(
              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
              isPublished ? "bg-green-100 text-lime-800" : "bg-gray-100 text-gray-800"
            )}
          >
            {isPublished ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {isPublished ? "Publicado" : "Borrador"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <span className={clsx("inline-block px-3 py-1 rounded-full text-xs font-semibold", categoryColors[category])}>
            {getCategoryLabel(category)}
          </span>
        </div>

        {/* Title */}
        <Title variant="h4" className="font-bold mb-2 line-clamp-2">
          {title}
        </Title>

        {/* Excerpt */}
        <Text variant="p" className="text-sm leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </Text>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-800 dark:text-gray-50 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <UserRound className="w-3.5 h-3.5" />
            {authorName}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-start flex-wrap gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(Number(id))}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => onTogglePublish(id, isPublished)}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
              isPublished
                ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
                : "bg-green-50 hover:bg-green-100 text-green-700"
            )}
          >
            {isPublished ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {isPublished ? "Despublicar" : "Publicar"}
          </button>
          <button
            onClick={() => onDelete(id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
