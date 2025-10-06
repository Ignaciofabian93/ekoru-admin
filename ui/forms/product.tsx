"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Select from "../inputs/select";
import Input from "../inputs/input";

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: File[];
  tags: string[];
};

type Props = {
  onSubmit: () => Promise<void>;
  isSubmitting?: boolean;
  productId?: number;
  mode?: "create" | "edit";
};

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "home", label: "Home & Garden" },
  { value: "books", label: "Books" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "toys", label: "Toys & Games" },
];

const conditions = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export default function ProductForm({ onSubmit, isSubmitting = false, productId, mode = "create" }: Props) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    condition: "",
    images: [],
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  // Load product data if editing
  useEffect(() => {
    if (mode === "edit" && productId) {
      // TODO: Load product data from API
    }
  }, [mode, productId]);

  const handleInputChange = (field: keyof ProductFormData, value: string | number | File[] | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange("tags", [...formData.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <Input
          type="text"
          id="name"
          required
          label="Nombre del Producto *"
          value={formData.name}
          onChange={(e) => handleInputChange("name", (e as React.ChangeEvent<HTMLInputElement>).target.value)}
          placeholder="Ingresa el nombre del producto"
        />
      </motion.div>

      {/* Description */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
          placeholder="Describe your product..."
          disabled={isSubmitting}
        />
      </motion.div>

      {/* Price and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
          <Select
            options={categories}
            value={formData.category}
            onChange={(value) => handleInputChange("category", value)}
            placeholder="Select category"
            disabled={isSubmitting}
          />
        </motion.div>
      </div>

      {/* Condition */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition *</label>
        <Select
          options={conditions}
          value={formData.condition}
          onChange={(value) => handleInputChange("condition", value)}
          placeholder="Select condition"
          disabled={isSubmitting}
        />
      </motion.div>

      {/* Tags */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Add tags..."
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Add
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Image Upload */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes de producto</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleInputChange("images", Array.from(e.target.files || []))}
            className="hidden"
            id="image-upload"
            disabled={isSubmitting}
          />
          <label htmlFor="image-upload" className="cursor-pointer text-primary hover:text-primary-dark">
            Haga clic para seleccionar imágenes o arrastre y suelte aquí
          </label>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 10MB cada una</p>
          {formData.images.length > 0 && (
            <p className="text-sm text-primary mt-2">{formData.images.length} imagen(es) seleccionadas</p>
          )}
        </div>
      </motion.div>
    </form>
  );
}
