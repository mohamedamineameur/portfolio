import { Link } from "react-router-dom";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionTitle } from "../../components/common/SectionTitle";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { useProjects } from "../../hooks/useProjects";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  const { projects, isLoading, error } = useProjects(true);

  return (
    <PageWrapper>
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
            Développeur Full Stack
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Passionné par le développement web moderne et les technologies innovantes
          </p>
        </div>
      </section>

      <section>
        <SectionTitle subtitle="Découvrez mes réalisations">
          Projets récents
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
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {project.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 flex-1 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.Technologies?.slice(0, 3).map((tech) => (
                      <Badge key={tech.id} variant="primary">
                        {tech.name}
                      </Badge>
                    ))}
                    {project.Technologies && project.Technologies.length > 3 && (
                      <Badge variant="default">
                        +{project.Technologies.length - 3}
                      </Badge>
                    )}
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

        {!isLoading && !error && projects.length > 6 && (
          <div className="text-center mt-8">
            <Link to="/projects">
              <button className="min-touch-target px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Voir tous les projets
              </button>
            </Link>
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
