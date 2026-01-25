import { useState, useEffect } from "react";
import { Loader, X } from "lucide-react";
import { Button } from "../ui/Button";
import { photoService } from "../../services/photo.service.js";
import { useUI } from "../../contexts/UIContext.js";
import { useLanguage } from "../../contexts/LanguageContext.js";
import type { Photo } from "../../types/api.js";
import { PhotoUpload } from "./PhotoUpload.js";
import { extractErrorMessage } from "../../utils/errorHandler.js";

interface PhotoSelectorProps {
  selectedPhotoId: string | null;
  onSelect: (photoId: string, photoUrl: string) => void;
  onCancel?: () => void;
}

export function PhotoSelector({
  selectedPhotoId,
  onSelect,
  onCancel,
}: PhotoSelectorProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const { setError } = useUI();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        const data = await photoService.findAll();
        setPhotos(data);
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        setError(errorMessage || t("admin.loadError"));
      } finally {
        setIsLoading(false);
      }
    };

    if (!showUpload) {
      fetchPhotos();
    }
  }, [showUpload, setError, t]);

  const handleUploadSuccess = (photoUrl: string, photoId: string) => {
    setShowUpload(false);
    onSelect(photoId, photoUrl);
    // Recharger la liste des photos
    photoService.findAll().then(setPhotos).catch(() => {
      // Ignore errors
    });
  };

  if (showUpload) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            {t("admin.uploadPhoto")}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
            <X size={20} />
          </Button>
        </div>
        <PhotoUpload
          onUploadSuccess={handleUploadSuccess}
          onCancel={() => setShowUpload(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">
          {t("admin.selectPhoto")}
        </h3>
        <Button variant="primary" size="sm" onClick={() => setShowUpload(true)}>
          {t("admin.uploadNew")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          {t("admin.noPhotos")}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => onSelect(photo.id, photo.url)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedPhotoId === photo.id
                  ? "border-primary ring-2 ring-primary"
                  : "border-surface/50 hover:border-primary/50"
              }`}
            >
              <img
                src={photo.url}
                alt={`Photo ${photo.id}`}
                className="w-full h-full object-cover"
              />
              {selectedPhotoId === photo.id && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="bg-primary text-white rounded-full p-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            {t("admin.cancel")}
          </Button>
        )}
        <Button
          variant="primary"
          onClick={() => {
            if (selectedPhotoId) {
              const selectedPhoto = photos.find((p) => p.id === selectedPhotoId);
              if (selectedPhoto) {
                onSelect(selectedPhotoId, selectedPhoto.url);
              }
            }
          }}
          disabled={!selectedPhotoId}
        >
          {t("admin.select")}
        </Button>
      </div>
    </div>
  );
}
