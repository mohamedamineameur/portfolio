import { useState } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionTitle } from "../../components/common/SectionTitle";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { useProjects } from "../../hooks/useProjects";
import { useLanguage } from "../../contexts/LanguageContext";
import { getImageUrl } from "../../utils/imageUrl";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import type { Project } from "../../types/api";

export function Projects() {
  const [filter, setFilter] = useState<boolean | undefined>(undefined);
  const { projects, isLoading, error } = useProjects(filter);
  const { language, t } = useLanguage();

  const getProjectTitle = (project: Project) => {
    return language === "fr" ? project.titleFr : project.titleEn;
  };

  const getProjectDescription = (project: Project) => {
    return language === "fr" ? project.descriptionFr : project.descriptionEn;
  };

  return (
    <PageWrapper>
      <SectionTitle subtitle={t("projects.subtitle")}>
        {t("projects.title")}
      </SectionTitle>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Button
          variant={filter === undefined ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter(undefined)}
        >
          {t("projects.all")}
        </Button>
        <Button
          variant={filter === true ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter(true)}
        >
          {t("projects.published")}
        </Button>
        <Button
          variant={filter === false ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilter(false)}
        >
          {t("projects.drafts")}
        </Button>
      </div>

      {isLoading && <Loader />}
      {error && <ErrorState message={error} />}
      {!isLoading && !error && projects.length === 0 && (
        <EmptyState
          title={t("projects.notFound")}
          description={t("projects.notFoundDescription")}
        />
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
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
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-text-primary">
                    {getProjectTitle(project)}
                  </h3>
                  {!project.published && (
                    <Badge variant="default" className="ml-2">
                      {t("projects.draft")}
                    </Badge>
                  )}
                </div>
                <p className="text-text-secondary text-sm mb-4 flex-1 line-clamp-3">
                  {getProjectDescription(project)}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.Technologies?.map((tech) => (
                    <Badge key={tech.id} variant="primary">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-touch-target text-primary hover:text-accent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-touch-target text-primary hover:text-accent"
                      onClick={(e) => e.stopPropagation()}
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
    </PageWrapper>
  );
}
