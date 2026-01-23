import { useState, useEffect } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionTitle } from "../../components/common/SectionTitle";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorState } from "../../components/common/ErrorState";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import { projectService } from "../../services/project.service";
import { contactService } from "../../services/contact.service";
import { technologyService } from "../../services/technology.service";
import type { Project, Contact, Technology } from "../../types/api";
import { Trash2, Eye, EyeOff, Plus, Edit } from "lucide-react";
import { useUI } from "../../contexts/UIContext";

export function Admin() {
  const { setSuccess, setError } = useUI();
  const [activeTab, setActiveTab] = useState<"projects" | "contacts" | "technologies">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setErrorState] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorState(null);
      const [projectsData, contactsData, technologiesData] = await Promise.all([
        projectService.findAll(),
        contactService.findAll(),
        technologyService.findAll(),
      ]);
      setProjects(projectsData);
      setContacts(contactsData);
      setTechnologies(technologiesData);
    } catch (err) {
      setErrorState(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;
    try {
      await projectService.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
      setSuccess("Projet supprimé avec succès");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) return;
    try {
      await contactService.delete(id);
      setContacts(contacts.filter((c) => c.id !== id));
      setSuccess("Contact supprimé avec succès");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const updated = await contactService.markAsRead(id);
      setContacts(contacts.map((c) => (c.id === id ? updated : c)));
      setSuccess("Contact marqué comme lu");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <PageWrapper>
        <SectionTitle>Administration</SectionTitle>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button
            variant={activeTab === "projects" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab("projects")}
          >
            Projets ({projects.length})
          </Button>
          <Button
            variant={activeTab === "contacts" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab("contacts")}
          >
            Contacts ({contacts.length})
          </Button>
          <Button
            variant={activeTab === "technologies" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab("technologies")}
          >
            Technologies ({technologies.length})
          </Button>
        </div>

        {isLoading && <Loader />}
        {error && <ErrorState message={error} onRetry={fetchData} />}

        {!isLoading && !error && (
          <>
            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Button variant="primary" size="sm">
                    <Plus size={16} className="mr-2" />
                    Nouveau projet
                  </Button>
                </div>
                {projects.length === 0 ? (
                  <Card>
                    <p className="text-text-secondary text-center py-8">
                      Aucun projet
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card key={project.id}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold text-text-primary">
                                {project.title}
                              </h3>
                              {!project.published && (
                                <Badge variant="default">Brouillon</Badge>
                              )}
                            </div>
                            <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.Technologies?.map((tech) => (
                                <Badge key={tech.id} variant="primary" className="text-xs">
                                  {tech.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button variant="ghost" size="sm">
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === "contacts" && (
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <Card>
                    <p className="text-text-secondary text-center py-8">
                      Aucun message de contact
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <Card key={contact.id}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-text-primary">
                                {contact.name}
                              </h3>
                              <span className="text-text-secondary text-sm">
                                {contact.email}
                              </span>
                              {!contact.read && (
                                <Badge variant="accent">Nouveau</Badge>
                              )}
                            </div>
                            <p className="text-text-secondary text-sm mb-2 whitespace-pre-line">
                              {contact.message}
                            </p>
                            <p className="text-text-secondary text-xs">
                              {new Date(contact.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            {!contact.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(contact.id)}
                              >
                                <Eye size={16} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Technologies Tab */}
            {activeTab === "technologies" && (
              <div className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Button variant="primary" size="sm">
                    <Plus size={16} className="mr-2" />
                    Nouvelle technologie
                  </Button>
                </div>
                {technologies.length === 0 ? (
                  <Card>
                    <p className="text-text-secondary text-center py-8">
                      Aucune technologie
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technologies.map((tech) => (
                      <Card key={tech.id}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-text-primary mb-1">
                              {tech.name}
                            </h3>
                            {tech.category && (
                              <Badge variant="default" className="text-xs">
                                {tech.category}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button variant="ghost" size="sm">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </ProtectedRoute>
  );
}
