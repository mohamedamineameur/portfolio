import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

interface CarouselProps {
  images: string[];
  alt?: string;
  className?: string;
  imageClassName?: string;
  showDots?: boolean;
  onImageClick?: (imageUrl: string, index: number) => void;
}

export function Carousel({
  images,
  alt = "Project",
  className,
  imageClassName,
  showDots = true,
  onImageClick,
}: CarouselProps) {
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const handleImageClick = () => {
    onImageClick?.(images[index], index);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-surface/50 flex items-center justify-center", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={index}
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "w-full h-full object-contain",
            onImageClick && "cursor-pointer",
            imageClassName
          )}
          onClick={onImageClick ? handleImageClick : undefined}
          role={onImageClick ? "button" : undefined}
          tabIndex={onImageClick ? 0 : undefined}
          onKeyDown={
            onImageClick
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleImageClick();
                  }
                }
              : undefined
          }
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 min-touch-target flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-10"
            aria-label="Image précédente"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 min-touch-target flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-10"
            aria-label="Image suivante"
          >
            <ChevronRight size={24} />
          </button>

          {showDots && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === index ? "bg-white" : "bg-white/50 hover:bg-white/70"
                  )}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
