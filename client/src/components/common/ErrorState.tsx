import { AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { useLanguage } from "../../contexts/LanguageContext";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useLanguage();
  return (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
      <h3 className="text-xl font-semibold text-text-primary mb-2">{t("common.error")}</h3>
      <p className="text-text-secondary mb-4">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          {t("common.retry")}
        </Button>
      )}
    </div>
  );
}
