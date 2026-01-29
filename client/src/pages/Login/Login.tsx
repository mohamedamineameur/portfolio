import { useState, FormEvent, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useUI } from "../../contexts/UIContext";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock } from "lucide-react";
import { extractErrorMessage } from "../../utils/errorHandler";

export function Login() {
  const navigate = useNavigate();
  const { user, isLoading: authChecking, login, checkAuth } = useAuth();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
      return;
    }
    if (hasChecked.current) return;
    hasChecked.current = true;
    void checkAuth().then((u) => {
      if (u) navigate("/admin", { replace: true });
    });
  }, [user, checkAuth, navigate]);
  const { t } = useLanguage();
  const { setError, setSuccess } = useUI();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t("login.fieldsRequired"));
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      setSuccess(t("login.success"));
      navigate("/admin");
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage || t("login.error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (authChecking) {
    return (
      <PageWrapper>
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <LogIn size={32} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {t("login.title")}
              </h1>
              <p className="text-text-secondary">
                {t("login.subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  {t("login.email")}
                </label>
                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("login.emailPlaceholder")}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  {t("login.password")}
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.passwordPlaceholder")}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t("login.loading") : t("login.submit")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-secondary text-sm">
                {t("login.noAccount")}{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-accent transition-colors font-medium"
                >
                  {t("login.register")}
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
