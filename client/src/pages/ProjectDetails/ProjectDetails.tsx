import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorState } from "../../components/common/ErrorState";
import { projectService } from "../../services/project.service";
import { useLanguage } from "../../contexts/LanguageContext";
import { getImageUrl } from "../../utils/imageUrl";
import type { Project } from "../../types/api";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Carousel } from "../../components/ui/Carousel";
import { ImageLightbox } from "../../components/ui/ImageLightbox";
import { motion } from "framer-motion";

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const getProjectTitle = (project: Project) => {
    return language === "fr" ? project.titleFr : project.titleEn;
  };

  const getProjectDescription = (project: Project) => {
    return language === "fr" ? project.descriptionFr : project.descriptionEn;
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await projectService.findById(id);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("projects.notFound"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <PageWrapper>
        <Loader />
      </PageWrapper>
    );
  }

  if (error || !project) {
    return (
      <PageWrapper>
        <ErrorState
          message={error || t("projects.notFound")}
          onRetry={() => navigate("/projects")}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            {t("projects.back")}
          </Button>
        </Link>

        {project.imageUrls?.length > 0 && (
          <>
            <Carousel
              images={project.imageUrls.map(getImageUrl)}
              alt={getProjectTitle(project)}
              className="w-full h-64 md:h-96 mb-8"
              imageClassName="rounded-xl"
              onImageClick={(url) => setLightboxImage(url)}
            />
            <ImageLightbox
              isOpen={!!lightboxImage}
              imageUrl={lightboxImage}
              alt={getProjectTitle(project)}
              onClose={() => setLightboxImage(null)}
            />
          </>
        )}

        <Card className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              {getProjectTitle(project)}
            </h1>
            {!project.published && (
              <Badge variant="default">{t("projects.draft")}</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.Technologies?.map((tech) => (
              <Badge key={tech.id} variant="primary">
                {tech.name}
              </Badge>
            ))}
          </div>

          <p className="text-text-secondary text-lg leading-relaxed mb-6 whitespace-pre-line">
            {getProjectDescription(project)}
          </p>

          <div className="flex flex-wrap gap-4">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-touch-target flex items-center gap-2 text-primary hover:text-accent transition-colors"
              >
                <ExternalLink size={20} />
                <span>{t("projects.viewProject")}</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-touch-target flex items-center gap-2 text-primary hover:text-accent transition-colors"
              >
                <Github size={20} />
                <span>{t("projects.sourceCode")}</span>
              </a>
            )}
          </div>
        </Card>
      </motion.div>
    </PageWrapper>
  );
}
