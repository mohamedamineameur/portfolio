import { Link } from "react-router-dom";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { Button } from "../../components/ui/Button";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export function Error404() {
  const { t } = useLanguage();

  return (
    <PageWrapper>
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-xl"
        >
          <img
            src="/error.png"
            alt="404"
            className="w-full max-w-md mx-auto mb-8 object-contain rounded-2xl shadow-[0_0_80px_30px_rgba(0,0,0,0.12)]"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            {t("common.notFound")}
          </h1>
          <p className="text-text-secondary mb-8">
            {t("common.notFoundDescription")}
          </p>
          <Link to="/">
            <Button variant="primary" size="lg" as="span" className="inline-flex items-center">
              <ArrowLeft size={20} className="mr-2" />
              {t("common.backHome")}
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
