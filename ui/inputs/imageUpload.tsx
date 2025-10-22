"use client";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Text } from "@/ui/text/text";
import clsx from "clsx";

type ImageUploadProps = {
  label?: string;
  name: string;
  value?: string;
  onChange: (base64: string) => void;
  placeholder?: string;
  required?: boolean;
  maxSizeMB?: number;
};

export default function ImageUpload({
  label,
  name,
  value,
  onChange,
  placeholder = "Arrastra una imagen aquí o haz clic para seleccionar",
  required = false,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateAndProcessFile = async (file: File) => {
    setError("");

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecciona una imagen válida");
      return;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`La imagen debe ser menor a ${maxSizeMB}MB`);
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setPreview(base64);
      onChange(base64);
    } catch (error) {
      console.error("Error converting file to base64:", error);
      setError("Error al procesar la imagen");
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={clsx(
          "relative border-2 border-dashed rounded-lg transition-all cursor-pointer",
          "hover:border-lime-500 dark:hover:border-lime-400",
          "bg-gray-50 dark:bg-layout-dark-700",
          isDragging
            ? "border-lime-500 dark:border-lime-400 bg-lime-50 dark:bg-lime-900/20"
            : "border-gray-300 dark:border-layout-dark-600",
          preview ? "p-4" : "p-8"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={name}
          name={name}
        />

        {preview ? (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className={clsx(
                  "absolute top-2 right-2 p-1.5 rounded-full",
                  "bg-red-500 hover:bg-red-600",
                  "text-white transition-colors"
                )}
              >
                <X size={16} />
              </button>
            </div>
            <Text variant="span" className="text-xs text-center block text-gray-500 dark:text-gray-400">
              Haz clic o arrastra otra imagen para reemplazar
            </Text>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className={clsx(
                "p-4 rounded-full mb-4",
                "bg-gray-100 dark:bg-layout-dark-600",
                isDragging && "bg-lime-100 dark:bg-lime-900/30"
              )}
            >
              {isDragging ? (
                <Upload size={32} className="text-lime-600 dark:text-lime-400" />
              ) : (
                <ImageIcon size={32} className="text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <Text variant="p" className="font-medium mb-1">
              {placeholder}
            </Text>
            <Text variant="span" className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF hasta {maxSizeMB}MB
            </Text>
          </div>
        )}
      </div>

      {error && (
        <Text variant="span" className="text-red-500 text-sm">
          {error}
        </Text>
      )}
    </div>
  );
}
