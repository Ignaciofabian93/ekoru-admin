"use client";
import { BlogCategory } from "@/types/blog";
import { List, Pencil, Save } from "lucide-react";
import Input from "@/ui/inputs/input";
import Textarea from "@/ui/inputs/textarea";
import Select from "@/ui/inputs/select";
import MainButton from "@/ui/buttons/mainButton";
import useBlogForm from "../_hooks/useBlogForm";

export type BlogFormData = {
  title: string;
  content: string;
  blogCategoryId: number;
  isPublished: boolean;
};

export type BlogFormProps = {
  initialData?: {
    title?: string;
    content?: string;
    blogCategory?: BlogCategory;
    isPublished?: boolean;
  };
  onSubmit: (data: BlogFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export default function BlogForm({ initialData, onSubmit, onCancel, isLoading = false }: BlogFormProps) {
  const { handleSubmit, formData, handleInputChange, errors, categoryOptions, loadingCategories } = useBlogForm({
    initialData,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <Input
          label="Título"
          type="text"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("title", e.target.value)}
          placeholder="Ingresa el título del post..."
          className={errors.title ? "border-red-500" : ""}
          icon={Pencil}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      {/* Category */}
      <div>
        <Select
          label="Categoría"
          value={formData.blogCategoryId.toString()}
          onChange={(value) => {
            const numValue = typeof value === "string" ? parseInt(value) : value;
            handleInputChange("blogCategoryId", numValue);
          }}
          options={categoryOptions}
          placeholder="Selecciona una categoría"
          className={errors.blogCategoryId ? "border-red-500" : ""}
          disabled={isLoading || loadingCategories}
          icon={List}
        />
        {errors.blogCategoryId && <p className="mt-1 text-sm text-red-500">{errors.blogCategoryId}</p>}
      </div>

      {/* Content */}
      <div>
        <Textarea
          label="Contenido"
          value={formData.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("content", e.target.value)}
          placeholder="Escribe el contenido del post..."
          className={errors.content ? "border-red-500" : ""}
        />
        {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
        <p className="mt-1 text-xs text-gray-500">{formData.content.length} caracteres</p>
      </div>

      {/* Publish Toggle */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => handleInputChange("isPublished", e.target.checked)}
          disabled={isLoading}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 cursor-pointer">
          Publicar inmediatamente
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <MainButton
          type="submit"
          text="Guardar"
          loadingText="Guardando..."
          onClick={handleSubmit}
          isLoading={isLoading}
          hasIcon
          icon={Save}
        />
        <MainButton variant="outline" text="Cancelar" onClick={onCancel} disabled={isLoading} hasIcon={false} />
      </div>
    </form>
  );
}
