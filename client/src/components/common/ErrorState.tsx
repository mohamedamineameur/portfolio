import { AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
      <h3 className="text-xl font-semibold text-text-primary mb-2">Erreur</h3>
      <p className="text-text-secondary mb-4">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  );
}
