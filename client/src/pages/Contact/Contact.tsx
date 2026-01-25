import { useState } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionTitle } from "../../components/common/SectionTitle";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";
import { contactService } from "../../services/contact.service";
import { useUI } from "../../contexts/UIContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { extractErrorMessage } from "../../utils/errorHandler";

export function Contact() {
  const { setSuccess, setError } = useUI();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("contact.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("contact.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.emailInvalid");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("contact.messageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("contact.messageMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await contactService.create(formData);
      setIsSuccess(true);
      setSuccess(t("contact.success"));
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage || t("contact.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <SectionTitle subtitle={t("contact.subtitle")}>
        {t("contact.title")}
      </SectionTitle>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            {isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {t("contact.successTitle")}
                </h3>
                <p className="text-text-secondary">
                  {t("contact.successDescription")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label={t("contact.name")}
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  error={errors.name}
                  placeholder={t("contact.namePlaceholder")}
                />

                <Input
                  label={t("contact.email")}
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={errors.email}
                  placeholder={t("contact.emailPlaceholder")}
                />

                <Textarea
                  label={t("contact.message")}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  error={errors.message}
                  placeholder={t("contact.messagePlaceholder")}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    t("contact.sending")
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      {t("contact.send")}
                    </>
                  )}
                </Button>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
