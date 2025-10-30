import { GET_BLOG_CATEGORIES } from "@/graphql/blog/queries";
import { BlogCategory } from "@/types";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { BlogFormData } from "../_ui/blogForm";

export default function useBlogForm({
  initialData,
  onSubmit,
}: {
  initialData?: {
    title?: string;
    content?: string;
    blogCategory?: BlogCategory;
    isPublished?: boolean;
  };
  onSubmit: (data: BlogFormData) => void;
}) {
  const { data: categoriesData, loading: loadingCategories } = useQuery<{
    getBlogCategories: BlogCategory[];
  }>(GET_BLOG_CATEGORIES);

  console.log("Categories data:: ", categoriesData);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    blogCategoryId: initialData?.blogCategory?.id || 0,
    isPublished: initialData?.isPublished || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions =
    categoriesData?.getBlogCategories.map((cat) => ({
      value: cat.id.toString(),
      label: cat.name,
    })) || [];

  const handleInputChange = (field: keyof typeof formData, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    if (!formData.blogCategoryId || formData.blogCategoryId === 0) {
      newErrors.blogCategoryId = "La categoría es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData as BlogFormData);
    }
  };

  return {
    categoriesData,
    loadingCategories,
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    categoryOptions,
  };
}
