import { Languages } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../ui/Button";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="min-touch-target"
      aria-label="Toggle language"
    >
      <Languages size={18} className="mr-2" />
      {language.toUpperCase()}
    </Button>
  );
}
