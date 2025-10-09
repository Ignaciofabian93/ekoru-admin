"use client";
import { motion } from "framer-motion";
import { Calendar, Tag, User, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { BlogCategory } from "@/types/enums";
import { getCategoryLabel } from "@/utils/blogTranslations";
import clsx from "clsx";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  authorId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, currentState: boolean) => void;
}

const categoryColors: Record<BlogCategory, string> = {
  [BlogCategory.RECYCLING]: "bg-green-100 text-green-800",
  [BlogCategory.POLLUTION]: "bg-red-100 text-red-800",
  [BlogCategory.SUSTAINABILITY]: "bg-emerald-100 text-emerald-800",
  [BlogCategory.CIRCULAR_ECONOMY]: "bg-blue-100 text-blue-800",
  [BlogCategory.USED_PRODUCTS]: "bg-purple-100 text-purple-800",
  [BlogCategory.REUSE]: "bg-teal-100 text-teal-800",
  [BlogCategory.ENVIRONMENT]: "bg-lime-100 text-lime-800",
  [BlogCategory.UPCYCLING]: "bg-cyan-100 text-cyan-800",
  [BlogCategory.RESPONSIBLE_CONSUMPTION]: "bg-indigo-100 text-indigo-800",
  [BlogCategory.ECO_TIPS]: "bg-yellow-100 text-yellow-800",
  [BlogCategory.ENVIRONMENTAL_IMPACT]: "bg-orange-100 text-orange-800",
  [BlogCategory.SUSTAINABLE_LIVING]: "bg-green-100 text-green-800",
  [BlogCategory.SECURITY]: "bg-slate-100 text-slate-800",
  [BlogCategory.OTHER]: "bg-gray-100 text-gray-800",
};

export function BlogCard({
  id,
  title,
  content,
  category,
  tags,
  isPublished,
  createdAt,
  authorId,
  onEdit,
  onDelete,
  onTogglePublish,
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
        "bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border overflow-hidden",
        isPublished ? "border-green-200" : "border-gray-200"
      )}
    >
      {/* Header with status indicator */}
      <div className="relative">
        <div className={clsx("h-2", isPublished ? "bg-green-500" : "bg-gray-400")} />
        <div className="absolute top-4 right-4">
          <span
            className={clsx(
              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
              isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
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
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{excerpt}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {tags.length > 3 && <span className="text-xs text-gray-500">+{tags.length - 3} más</span>}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {authorId.substring(0, 8)}...
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(id)}
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
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
