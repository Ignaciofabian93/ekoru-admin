"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import { FieldConfig } from "../_constants/newRecordFields";
import { Text } from "@/ui/text/text";
import Input from "@/ui/inputs/input";
import Select from "@/ui/inputs/select";
import Textarea from "@/ui/inputs/textarea";
import Checkbox from "@/ui/inputs/checkbox";
import ImageUpload from "@/ui/inputs/imageUpload";
import MainButton from "@/ui/buttons/mainButton";

type DynamicFormProps = {
  fields: FieldConfig[];
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialValues?: Record<string, unknown>; // Add this for editing
};

export default function DynamicForm({
  fields,
  onSubmit,
  onCancel,
  isLoading = false,
  initialValues = {},
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initialData: Record<string, unknown> = {};
    fields.forEach((field) => {
      // Prioritize initialValues, then defaultValue
      if (initialValues[field.name] !== undefined) {
        initialData[field.name] = initialValues[field.name];
      } else if (field.defaultValue !== undefined) {
        initialData[field.name] = field.defaultValue;
      }
    });
    return initialData;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      // Required validation
      if (field.required && (value === undefined || value === null || value === "")) {
        newErrors[field.name] = `${field.label} es requerido`;
        return;
      }

      // Skip further validation if field is empty and not required
      if (!value && !field.required) return;

      // Type-specific validation
      if (field.type === "email" && typeof value === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = "Email inválido";
        }
      }

      // Custom validation
      if (field.validation) {
        if (field.validation.pattern && typeof value === "string") {
          if (!field.validation.pattern.test(value)) {
            newErrors[field.name] = field.validation.message || "Formato inválido";
          }
        }
        if (field.validation.minLength && typeof value === "string") {
          if (value.length < field.validation.minLength) {
            newErrors[field.name] = `Mínimo ${field.validation.minLength} caracteres`;
          }
        }
        if (field.validation.maxLength && typeof value === "string") {
          if (value.length > field.validation.maxLength) {
            newErrors[field.name] = `Máximo ${field.validation.maxLength} caracteres`;
          }
        }
      }

      // Number validation
      if (field.type === "number" && typeof value === "number") {
        if (field.min !== undefined && value < field.min) {
          newErrors[field.name] = `Valor mínimo: ${field.min}`;
        }
        if (field.max !== undefined && value > field.max) {
          newErrors[field.name] = `Valor máximo: ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FieldConfig) => {
    if (field.hidden) return null;

    const value = formData[field.name];
    const error = errors[field.name];

    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <div key={field.name} className="space-y-1">
            <Input
              label={field.label}
              name={field.name}
              type={field.type}
              value={(value as string) || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              size="full"
              hasIcon={false}
            />
            {error && (
              <Text variant="span" className="text-red-500 text-sm">
                {error}
              </Text>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="space-y-1">
            <Input
              label={field.label}
              name={field.name}
              type="number"
              value={String(value || "")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(field.name, parseFloat(e.target.value) || 0)
              }
              placeholder={field.placeholder}
              required={field.required}
              size="full"
              hasIcon={false}
            />
            {error && (
              <Text variant="span" className="text-red-500 text-sm">
                {error}
              </Text>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className="space-y-1">
            <Textarea
              label={field.label}
              name={field.name}
              value={(value as string) || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
            {error && (
              <Text variant="span" className="text-red-500 text-sm">
                {error}
              </Text>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="space-y-1">
            <Select
              label={field.label}
              name={field.name}
              value={(value as string | number) || ""}
              onChange={(newValue) => handleChange(field.name, newValue)}
              options={field.options || []}
              placeholder={field.placeholder || "Seleccione..."}
              size="full"
              hasIcon={false}
            />
            {error && (
              <Text variant="span" className="text-red-500 text-sm">
                {error}
              </Text>
            )}
          </div>
        );

      case "boolean":
        return (
          <div key={field.name} className="space-y-1">
            <Checkbox
              id={field.name}
              label={field.label}
              name={field.name}
              checked={(value as boolean) || false}
              onChange={(checked) => handleChange(field.name, checked)}
              size="md"
            />
            {error && (
              <Text variant="span" className="text-red-500 text-sm">
                {error}
              </Text>
            )}
          </div>
        );

      case "array":
        return (
          <div key={field.name} className="space-y-1">
            <Input
              label={field.label}
              name={field.name}
              type="text"
              value={Array.isArray(value) ? value.join(", ") : ""}
              onChange={(e) => {
                const inputValue = (e.target as HTMLInputElement).value;
                const arrayValue = inputValue
                  .split(",")
                  .map((item: string) => item.trim())
                  .filter(Boolean);
                handleChange(field.name, arrayValue);
              }}
              placeholder={field.placeholder}
              required={field.required}
              size="full"
              hasIcon={false}
            />
            <Text variant="span" className="text-xs text-gray-500">
              Separar con comas
            </Text>
            {error && (
              <Text variant="span" className="text-red-500 text-sm">
                {error}
              </Text>
            )}
          </div>
        );

      case "relation":
        return (
          <div key={field.name} className="space-y-1">
            <Select
              label={field.label}
              name={field.name}
              value={(value as string | number) || ""}
              onChange={(newValue) => handleChange(field.name, newValue)}
              options={[]}
              placeholder={`Seleccione ${field.label}...`}
              size="full"
              hasIcon={false}
            />
            <Text variant="span" className="text-xs text-gray-500">
              Relacionado con: {field.relatedTable}
            </Text>
            {error && (
              <Text variant="span" className="text-red-500 text-sm">
                {error}
              </Text>
            )}
          </div>
        );

      case "date":
      case "datetime":
        return (
          <div key={field.name} className="space-y-1">
            <Input
              label={field.label}
              name={field.name}
              type="text"
              value={(value as string) || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.name, e.target.value)}
              placeholder={field.type === "datetime" ? "YYYY-MM-DD HH:MM" : "YYYY-MM-DD"}
              required={field.required}
              size="full"
              hasIcon={false}
            />
            <Text variant="span" className="text-xs text-gray-500">
              Formato: {field.type === "datetime" ? "YYYY-MM-DD HH:MM" : "YYYY-MM-DD"}
            </Text>
            {error && (
              <Text variant="span" className="text-red-500 text-sm">
                {error}
              </Text>
            )}
          </div>
        );

      case "json":
        return (
          <div key={field.name} className="space-y-1">
            <Textarea
              label={field.label}
              name={field.name}
              value={typeof value === "object" ? JSON.stringify(value, null, 2) : (value as string) || ""}
              onChange={(e) => {
                const target = e.target as HTMLTextAreaElement;
                try {
                  const parsed = JSON.parse(target.value);
                  handleChange(field.name, parsed);
                } catch {
                  handleChange(field.name, target.value);
                }
              }}
              placeholder={field.placeholder || "{}"}
            />
            <Text variant="span" className="text-xs text-gray-500">
              Formato JSON válido
            </Text>
            {error && (
              <Text variant="span" className="text-red-500 text-sm">
                {error}
              </Text>
            )}
          </div>
        );

      case "image":
        return (
          <div key={field.name} className="space-y-1">
            <ImageUpload
              label={field.label}
              name={field.name}
              value={(value as string) || ""}
              onChange={(base64) => handleChange(field.name, base64)}
              placeholder={field.placeholder}
              required={field.required}
              maxSizeMB={5}
            />
            {error && (
              <Text variant="span" className="text-red-500 text-sm">
                {error}
              </Text>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form Fields */}
      <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">{fields.map((field) => renderField(field))}</div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-layout-light-200 dark:border-layout-dark-700">
        <MainButton variant="outline" type="button" text="Cancelar" onClick={onCancel} hasIcon={false} />
        <MainButton type="submit" text="Guardar" isLoading={isLoading} loadingText="Guardando..." icon={Save} />
      </div>
    </form>
  );
}
