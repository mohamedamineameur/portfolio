import { useState, useRef } from "react";
import { Upload, X, Loader } from "lucide-react";
import { Button } from "../ui/Button";
import { photoService } from "../../services/photo.service.js";
import { useUI } from "../../contexts/UIContext.js";
import { useLanguage } from "../../contexts/LanguageContext.js";
import { extractErrorMessage } from "../../utils/errorHandler.js";

interface PhotoUploadProps {
  onUploadSuccess: (photoUrl: string, photoId: string) => void;
  onCancel?: () => void;
}

export function PhotoUpload({ onUploadSuccess, onCancel }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setSuccess, setError } = useUI();
  const { t } = useLanguage();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      setError("admin.uploadError");
      return;
    }

    setSelectedFile(file);

    // Créer un aperçu
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t("admin.selectImage"));
      return;
    }

    try {
      setIsUploading(true);
      const photo = await photoService.upload(selectedFile);
      setSuccess(t("admin.photoUploaded"));
      onUploadSuccess(photo.url, photo.id);
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage || t("admin.uploadError"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-surface/50 rounded-lg p-6 text-center">
        {/* Toujours présent pour éviter de perdre le fichier quand l'UI change */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
            <button
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="absolute top-2 right-2 bg-surface/90 rounded-full p-1 hover:bg-surface"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload size={48} className="mx-auto text-text-secondary" />
            <div>
              <p className="text-text-secondary mb-2">
                {t("admin.selectPhoto")}
              </p>
              <label
                htmlFor="photo-upload"
                className="cursor-pointer inline-block"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  as="span"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }}
                >
                  {t("admin.chooseFile")}
                </Button>
              </label>
            </div>
          </div>
        )}
      </div>
      {preview && (
        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("admin.cancel")}
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader className="animate-spin mr-2" size={16} />
                {t("admin.uploading")}
              </>
            ) : (
              t("admin.upload")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
