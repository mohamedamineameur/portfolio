import { Github, Mail, Linkedin } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";
import { useLanguage } from "../../contexts/LanguageContext";

export function Footer() {
  const { profile } = useProfile();
  const { t } = useLanguage();
  const name = profile ? `${profile.prenom} ${profile.nom}`.trim() : "Amine Ameur";

  return (
    <footer className="bg-surface border-t border-surface/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Portfolio. {name}. {t("footer.rightsReserved")}
          </p>
          <div className="flex items-center gap-4">
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="min-touch-target text-text-secondary hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            )}
            {profile?.linkedIn && (
              <a
                href={profile.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="min-touch-target text-text-secondary hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            )}
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="min-touch-target text-text-secondary hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
