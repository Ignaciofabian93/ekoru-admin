import React, { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClass?: string; // e.g. 'max-w-md'
}

export default function Modal({ open, onClose, title, children, widthClass = "max-w-md" }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Close modal if click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm transition-all"
      style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl p-6 w-full ${widthClass} relative animate-fadeIn`}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none text-xl font-bold"
          aria-label="Cerrar"
          type="button"
        >
          ×
        </button>
        {title && <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
