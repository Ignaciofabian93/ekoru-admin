import { useEffect, useRef, useState } from "react";
import useSessionStore from "@/store/session";

export default function useCoverImage() {
  const { data } = useSessionStore();
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    if (data.profile?.coverImage) {
      setCoverImage(data.profile?.coverImage);
    } else {
      setCoverImage(null);
    }
  }, [data.profile?.coverImage]);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo debe ser menor a 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      // Create blob URL for immediate preview
      const blobUrl = URL.createObjectURL(file);
      setCoverImage(blobUrl);

      // Upload file and get URL
      const imageUrl = await uploadCoverImage(file);

      // Update state with permanent URL
      setCoverImage(imageUrl);
    } catch (error) {
      console.error("Error uploading cover image:", error);
      alert("Error al subir la imagen. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Function to upload file to storage service
  const uploadCoverImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", data.id);

    const response = await fetch("/api/upload/cover-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload cover image");
    }

    const { imageUrl } = await response.json();
    return imageUrl;
  };

  return {
    coverImage,
    isUploading,
    fileInputRef,
    handleCoverImageUpload,
    triggerFileUpload,
  };
}
