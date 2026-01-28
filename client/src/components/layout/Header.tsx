import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../ui/Button";
import { LanguageToggle } from "../common/LanguageToggle";
import { cn } from "../../utils/cn";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { path: "/", label: t("home") },
    { path: "/projects", label: t("projects") },
    { path: "/about", label: t("about") },
    { path: "/contact", label: t("contact") },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-surface/50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Amine Ameur
            <p className="text-sm text-text-secondary" style={{ paddingLeft: "8px" }}>Full-Stack Developer</p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors min-touch-target flex items-center",
                  isActive(item.path)
                    ? "text-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
            <LanguageToggle />
            {user && (
              <>
                {user.role === "admin" && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      {t("admin")}
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  {t("logout")}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden min-touch-target text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block py-2 px-4 rounded-lg text-sm font-medium transition-colors min-touch-target",
                  isActive(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-surface/50">
              <LanguageToggle />
            </div>
            {user && (
              <div className="pt-2 border-t border-surface/50 space-y-2">
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block py-2 px-4 rounded-lg text-sm font-medium text-text-primary hover:bg-surface min-touch-target"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("admin")}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-4 rounded-lg text-sm font-medium text-text-primary hover:bg-surface min-touch-target"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
