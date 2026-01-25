import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionTitle } from "../../components/common/SectionTitle";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { useProfile } from "../../hooks/useProfile";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { Code, Database, Globe, Smartphone, Mail, Phone, Linkedin, Github } from "lucide-react";

export function About() {
  const { profile, isLoading, error } = useProfile();
  const { t } = useLanguage();

  const skills = [
    { key: "about.skillFrontend", icon: Globe, color: "primary" },
    { key: "about.skillBackend", icon: Database, color: "accent" },
    { key: "about.skillMobile", icon: Smartphone, color: "primary" },
    { key: "about.skillDevOps", icon: Code, color: "accent" },
  ] as const;

  return (
    <PageWrapper>
      <SectionTitle subtitle={t("about.subtitle")}>
        {t("about.title")}
      </SectionTitle>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Section */}
        {isLoading && <Loader />}
        {error && <ErrorState message={error} />}
        
        {!isLoading && !error && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="flex flex-col md:flex-row gap-6">
                {profile.photo?.url && (
                  <div className="flex-shrink-0">
                    <img
                      src={profile.photo.url}
                      alt={`${profile.prenom} ${profile.nom}`}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-primary"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {profile.prenom} {profile.nom}
                  </h2>
                  <div className="space-y-2 mb-4">
                    {profile.email && (
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Mail size={18} />
                        <a
                          href={`mailto:${profile.email}`}
                          className="hover:text-primary transition-colors"
                        >
                          {profile.email}
                        </a>
                      </div>
                    )}
                    {profile.tel && (
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Phone size={18} />
                        <a
                          href={`tel:${profile.tel}`}
                          className="hover:text-primary transition-colors"
                        >
                          {profile.tel}
                        </a>
                      </div>
                    )}
                    <div className="flex gap-4 mt-4">
                      {profile.linkedIn && (
                        <a
                          href={profile.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-touch-target text-primary hover:text-accent transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={24} />
                        </a>
                      )}
                      {profile.github && (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-touch-target text-primary hover:text-accent transition-colors"
                          aria-label="GitHub"
                        >
                          <Github size={24} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {!isLoading && !error && !profile && (
          <EmptyState
            title={t("about.profileNotFound")}
            description=""
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              {t("about.whoAmI")}
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              {t("about.bio1")}
            </p>
            <p className="text-text-secondary leading-relaxed">
              {t("about.bio2")}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              {t("about.skills")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-2 flex justify-center">
                    <skill.icon
                      size={32}
                      className={`text-${
                        skill.color === "primary" ? "primary" : "accent"
                      }`}
                    />
                  </div>
                  <p className="text-text-primary font-medium">{t(skill.key)}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              {t("about.technologies")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "TypeScript",
                "Node.js",
                "Express",
                "PostgreSQL",
                "MongoDB",
                "Tailwind CSS",
                "Docker",
              ].map((tech) => (
                <Badge key={tech} variant="primary">
                  {tech}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
