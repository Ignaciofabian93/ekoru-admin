"use client";
import { useState } from "react";
import { BlogCategory } from "@/types/enums";
import { getCategoryLabel } from "@/utils/blogTranslations";
import Input from "@/ui/inputs/input";
import Textarea from "@/ui/inputs/textarea";
import Select from "@/ui/inputs/select";
import { X, Plus } from "lucide-react";
import clsx from "clsx";

interface BlogFormData {
  title: string;
  content: string;
  category: BlogCategory;
  tags: string[];
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
    tags: string[];
    isPublished: boolean;
  }>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || ("" as const),
    tags: initialData?.tags || [],
    isPublished: initialData?.isPublished || false,
  });

  const [tagInput, setTagInput] = useState("");
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

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
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

      {/* Tags */}
      <div>
        <div className="flex gap-2 mb-2 items-end">
          <Input
            label="Etiquetas"
            type="text"
            value={tagInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Agregar etiqueta..."
            className="flex-1"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={isLoading || !tagInput.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={isLoading}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
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
