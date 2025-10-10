"use client";
import { useState } from "react";
import { BlogCategory } from "@/types/enums";
import { getCategoryLabel } from "@/utils/blogTranslations";
import Input from "@/ui/inputs/input";
import Textarea from "@/ui/inputs/textarea";
import Select from "@/ui/inputs/select";
import clsx from "clsx";

interface BlogFormData {
  title: string;
  content: string;
  category: BlogCategory;
  isPublished: boolean;
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const categoryOptions = Object.values(BlogCategory).map((cat) => ({
  value: cat,
  label: getCategoryLabel(cat),
}));

export function BlogForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Create Post",
}: BlogFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    category: BlogCategory | "";
    isPublished: boolean;
  }>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || ("" as const),
    isPublished: initialData?.isPublished || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean | BlogCategory) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (formData.title.length < 5) {
      newErrors.title = "El título debe tener al menos 5 caracteres";
    }

    if (!formData.content.trim()) {
      newErrors.content = "El contenido es requerido";
    } else if (formData.content.length < 20) {
      newErrors.content = "El contenido debe tener al menos 20 caracteres";
    }

    if (!formData.category) {
      newErrors.category = "La categoría es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    console.log("Validation result:", validate());
    console.log("Category:", formData.category);

    if (validate() && formData.category) {
      console.log("Calling onSubmit with:", formData);
      onSubmit(formData as BlogFormData);
    } else {
      console.log("Validation failed or no category");
    }
  };

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
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      {/* Category */}
      <div>
        <Select
          label="Categoría"
          value={formData.category}
          onChange={(value) => handleInputChange("category", value as BlogCategory)}
          options={categoryOptions}
          placeholder="Selecciona una categoría"
          className={errors.category ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
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
        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            "flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium",
            isLoading && "cursor-not-allowed opacity-50"
          )}
        >
          {isLoading ? "Guardando..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
