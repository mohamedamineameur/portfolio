import { useEffect } from "react";
import { X } from "lucide-react";

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string | null;
  alt?: string;
  onClose: () => void;
}

export function ImageLightbox({ isOpen, imageUrl, alt = "", onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image en plein écran"}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 min-touch-target z-10 flex items-center justify-center rounded-lg text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Fermer"
      >
        <X size={24} />
      </button>
      <img
        src={imageUrl}
        alt={alt}
        className="max-w-full max-h-[calc(100vh-2rem)] w-auto h-auto object-contain"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
    </div>
  );
}
