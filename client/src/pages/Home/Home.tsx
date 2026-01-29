import { Link } from "react-router-dom";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionTitle } from "../../components/common/SectionTitle";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { useProjects } from "../../hooks/useProjects";
import { useProfile } from "../../hooks/useProfile";
import { useLanguage } from "../../contexts/LanguageContext";
import { getImageUrl } from "../../utils/imageUrl";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import type { Project } from "../../types/api";

export function Home() {
  const { projects, isLoading, error } = useProjects(true);
  const { profile } = useProfile();
  const { language, t } = useLanguage();

  const getProjectTitle = (project: Project) => {
    return language === "fr" ? project.titleFr : project.titleEn;
  };

  const getProjectDescription = (project: Project) => {
    return language === "fr" ? project.descriptionFr : project.descriptionEn;
  };

  return (
    <PageWrapper>
      <section className="mb-16">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            {profile?.photo?.url && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <img
                  src={getImageUrl(profile.photo.url)}
                  alt={profile.prenom && profile.nom ? `${profile.prenom} ${profile.nom}` : "Profile"}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary shadow-lg"
                />
              </motion.div>
            )}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
                {t("home.title")}
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                {t("home.subtitle")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <SectionTitle subtitle={''}>
          {t("home.recentProjects")}
        </SectionTitle>

        {isLoading && <Loader />}
        {error && <ErrorState message={error} />}
        {!isLoading && !error && projects.length === 0 && (
          <EmptyState
            title="Aucun projet disponible"
            description="Les projets seront bientôt disponibles"
          />
        )}

        {!isLoading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="h-full flex flex-col"
                  onClick={() => (window.location.href = `/projects/${project.id}`)}
                >
                  {project.imageUrls?.length > 0 && (
                    <div className="w-full h-48 bg-surface/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={getImageUrl(project.imageUrls[0])}
                        alt={getProjectTitle(project)}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {getProjectTitle(project)}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 flex-1 line-clamp-3">
                    {getProjectDescription(project)}
                  </p>
                  <ul className="flex flex-wrap gap-2 mb-4 list-none p-0 m-0" aria-label="Technologies used">
                    {project.Technologies?.slice(0, 3).map((tech) => (
                      <li key={tech.id}>
                        <Badge variant="primary">{tech.name}</Badge>
                      </li>
                    ))}
                    {project.Technologies && project.Technologies.length > 3 && (
                      <li>
                        <Badge variant="default">
                          +{project.Technologies.length - 3}
                        </Badge>
                      </li>
                    )}
                  </ul>
                  <div className="flex gap-2">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-touch-target text-primary hover:text-accent inline-flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Open project"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-touch-target text-primary hover:text-accent inline-flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="View on GitHub"
                      >
                        <Github size={20} />
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !error && projects.length > 6 && (
          <div className="text-center mt-8">
            <Link to="/projects">
              <button className="min-touch-target px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                {t("home.viewAllProjects")}
              </button>
            </Link>
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
