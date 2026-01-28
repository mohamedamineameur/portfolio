import { useState, useEffect } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionTitle } from "../../components/common/SectionTitle";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { ErrorState } from "../../components/common/ErrorState";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { projectService } from "../../services/project.service";
import { contactService } from "../../services/contact.service";
import { technologyService } from "../../services/technology.service";
import { profileService } from "../../services/profile.service";
import { useProfile } from "../../hooks/useProfile";
import { PhotoSelector } from "../../components/admin/PhotoSelector";
import { useLanguage } from "../../contexts/LanguageContext";
import type { Project, Contact, Technology } from "../../types/api";
import { Trash2, Eye, Plus, Edit } from "lucide-react";
import { useUI } from "../../contexts/UIContext";
import { extractErrorMessage } from "../../utils/errorHandler";
import { getImageUrl } from "../../utils/imageUrl";

export function Admin() {
  const { setSuccess, setError } = useUI();
  const { language, t } = useLanguage();

  const getProjectTitle = (project: Project) => {
    return language === "fr" ? project.titleFr : project.titleEn;
  };

  const getProjectDescription = (project: Project) => {
    return language === "fr" ? project.descriptionFr : project.descriptionEn;
  };
  const [activeTab, setActiveTab] = useState<"projects" | "contacts" | "technologies" | "profile">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const { profile, refetch: refetchProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setErrorState] = useState<string | null>(null);

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTechnologyModalOpen, setIsTechnologyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [isPhotoSelectorOpen, setIsPhotoSelectorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);

  // Form states for projects
  const [projectForm, setProjectForm] = useState({
    titleFr: "",
    titleEn: "",
    descriptionFr: "",
    descriptionEn: "",
    url: "",
    githubUrl: "",
    imageUrls: [] as string[],
    published: true,
    technologyIds: [] as string[],
  });

  // Form states for technologies
  const [technologyForm, setTechnologyForm] = useState({
    name: "",
    icon: "",
    category: "",
  });

  // Form states for profile
  const [profileForm, setProfileForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    linkedIn: "",
    github: "",
    photoId: null as string | null,
  });

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
      const errorMessage = extractErrorMessage(err);
      setErrorState(errorMessage || t("admin.loadError"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      await projectService.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
      setSuccess(t("admin.projectDeleted"));
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage || t("admin.deleteError"));
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm(t("admin.deleteContactConfirm"))) return;
    try {
      await contactService.delete(id);
      setContacts(contacts.filter((c) => c.id !== id));
      setSuccess(t("admin.contactDeleted"));
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage || t("admin.deleteError"));
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const updated = await contactService.markAsRead(id);
      setContacts(contacts.map((c) => (c.id === id ? updated : c)));
      setSuccess(t("admin.contactMarkedRead"));
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage || t("admin.updateError"));
    }
  };

  // Project modal handlers
  const handleOpenProjectModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        titleFr: project.titleFr,
        titleEn: project.titleEn,
        descriptionFr: project.descriptionFr,
        descriptionEn: project.descriptionEn,
        url: project.url || "",
        githubUrl: project.githubUrl || "",
        imageUrls: project.imageUrls ?? [],
        published: project.published,
        technologyIds: project.Technologies?.map((t) => t.id) || [],
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        titleFr: "",
        titleEn: "",
        descriptionFr: "",
        descriptionEn: "",
        url: "",
        githubUrl: "",
        imageUrls: [],
        published: true,
        technologyIds: [],
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, {
          titleFr: projectForm.titleFr,
          titleEn: projectForm.titleEn,
          descriptionFr: projectForm.descriptionFr,
          descriptionEn: projectForm.descriptionEn,
          url: projectForm.url || null,
          githubUrl: projectForm.githubUrl || null,
          imageUrls: projectForm.imageUrls,
          published: projectForm.published,
          technologyIds: projectForm.technologyIds,
        });
        setSuccess(t("admin.projectUpdated"));
      } else {
        await projectService.create({
          titleFr: projectForm.titleFr,
          titleEn: projectForm.titleEn,
          descriptionFr: projectForm.descriptionFr,
          descriptionEn: projectForm.descriptionEn,
          url: projectForm.url || null,
          githubUrl: projectForm.githubUrl || null,
          imageUrls: projectForm.imageUrls,
          published: projectForm.published,
          technologyIds: projectForm.technologyIds,
        });
        setSuccess(t("admin.projectCreated"));
      }
      handleCloseProjectModal();
      await fetchData();
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage || t("admin.updateError"));
    }
  };

  // Technology modal handlers
  const handleOpenTechnologyModal = (technology?: Technology) => {
    if (technology) {
      setEditingTechnology(technology);
      setTechnologyForm({
        name: technology.name,
        icon: technology.icon || "",
        category: technology.category || "",
      });
    } else {
      setEditingTechnology(null);
      setTechnologyForm({
        name: "",
        icon: "",
        category: "",
      });
    }
    setIsTechnologyModalOpen(true);
  };

  const handleCloseTechnologyModal = () => {
    setIsTechnologyModalOpen(false);
    setEditingTechnology(null);
  };

  const handleSubmitTechnology = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTechnology) {
        await technologyService.update(editingTechnology.id, {
          name: technologyForm.name,
          icon: technologyForm.icon || null,
          category: technologyForm.category || null,
        });
        setSuccess(t("admin.technologyUpdated"));
      } else {
        await technologyService.create({
          name: technologyForm.name,
          icon: technologyForm.icon || null,
          category: technologyForm.category || null,
        });
        setSuccess(t("admin.technologyCreated"));
      }
      handleCloseTechnologyModal();
      await fetchData();
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage || t("admin.updateError"));
    }
  };

  const handleDeleteTechnology = async (id: string) => {
    if (!confirm(t("admin.deleteTechnologyConfirm"))) return;
    try {
      await technologyService.delete(id);
      setTechnologies(technologies.filter((t) => t.id !== id));
      setSuccess(t("admin.technologyDeleted"));
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage || t("admin.deleteError"));
    }
  };

  // Profile handlers
  const handleOpenProfileModal = () => {
    if (profile) {
      setProfileForm({
        nom: profile.nom,
        prenom: profile.prenom,
        email: profile.email,
        tel: profile.tel || "",
        linkedIn: profile.linkedIn || "",
        github: profile.github || "",
        photoId: profile.photoId,
      });
    }
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await profileService.update({
        nom: profileForm.nom,
        prenom: profileForm.prenom,
        email: profileForm.email,
        tel: profileForm.tel || null,
        linkedIn: profileForm.linkedIn || null,
        github: profileForm.github || null,
        photoId: profileForm.photoId,
      });
      setSuccess(t("admin.profileUpdated"));
      handleCloseProfileModal();
      await refetchProfile();
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage || t("admin.updateError"));
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <PageWrapper>
        <SectionTitle>{t("admin.title")}</SectionTitle>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button
            variant={activeTab === "projects" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab("projects")}
          >
            {t("admin.projects")} ({projects.length})
          </Button>
          <Button
            variant={activeTab === "contacts" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab("contacts")}
          >
            {t("admin.contacts")} ({contacts.length})
          </Button>
          <Button
            variant={activeTab === "technologies" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab("technologies")}
          >
            {t("admin.technologies")} ({technologies.length})
          </Button>
          <Button
            variant={activeTab === "profile" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab("profile")}
          >
            {t("admin.profile")}
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
                  <Button variant="primary" size="sm" onClick={() => handleOpenProjectModal()}>
                    <Plus size={16} className="mr-2" />
                    {t("admin.newProject")}
                  </Button>
                </div>
                {projects.length === 0 ? (
                  <Card>
                    <p className="text-text-secondary text-center py-8">
                      {t("admin.noProjects")}
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
                                {getProjectTitle(project)}
                              </h3>
                              {!project.published && (
                                <Badge variant="default">{t("projects.draft")}</Badge>
                              )}
                            </div>
                            <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                              {getProjectDescription(project)}
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
                            <Button variant="ghost" size="sm" onClick={() => handleOpenProjectModal(project)}>
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
                      {t("admin.noContacts")}
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
                                <Badge variant="accent">{t("admin.new")}</Badge>
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
                  <Button variant="primary" size="sm" onClick={() => handleOpenTechnologyModal()}>
                    <Plus size={16} className="mr-2" />
                    {t("admin.newTechnology")}
                  </Button>
                </div>
                {technologies.length === 0 ? (
                  <Card>
                    <p className="text-text-secondary text-center py-8">
                      {t("admin.noTechnologies")}
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
                            <Button variant="ghost" size="sm" onClick={() => handleOpenTechnologyModal(tech)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteTechnology(tech.id)}>
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

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Button variant="primary" size="sm" onClick={handleOpenProfileModal}>
                    <Edit size={16} className="mr-2" />
                    {t("admin.editProfile")}
                  </Button>
                </div>
                {profile ? (
                  <Card>
                    <div className="flex flex-col md:flex-row gap-6">
                      {profile.photo?.url && (
                        <div className="flex-shrink-0">
                          <img
                            src={getImageUrl(profile.photo.url)}
                            alt={`${profile.prenom} ${profile.nom}`}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-primary"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-text-primary mb-4">
                          {profile.prenom} {profile.nom}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-text-secondary">
                            <span className="font-medium">{t("admin.email")}:</span> {profile.email}
                          </p>
                          {profile.tel && (
                            <p className="text-text-secondary">
                              <span className="font-medium">{t("admin.tel")}:</span> {profile.tel}
                            </p>
                          )}
                          {profile.linkedIn && (
                            <p className="text-text-secondary">
                              <span className="font-medium">{t("admin.linkedIn")}:</span>{" "}
                              <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {profile.linkedIn}
                              </a>
                            </p>
                          )}
                          {profile.github && (
                            <p className="text-text-secondary">
                              <span className="font-medium">{t("admin.github")}:</span>{" "}
                              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {profile.github}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <p className="text-text-secondary text-center py-8">
                      {t("about.profileNotFound")}
                    </p>
                  </Card>
                )}
              </div>
            )}
          </>
        )}

        {/* Project Modal */}
        <Modal
          isOpen={isProjectModalOpen}
          onClose={handleCloseProjectModal}
          title={editingProject ? t("admin.editProject") : t("admin.newProject")}
          size="lg"
        >
          <form onSubmit={handleSubmitProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("admin.titleFr")}
                </label>
                <Input
                  value={projectForm.titleFr}
                  onChange={(e) => setProjectForm({ ...projectForm, titleFr: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("admin.titleEn")}
                </label>
                <Input
                  value={projectForm.titleEn}
                  onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("admin.descriptionFr")}
                </label>
                <textarea
                  value={projectForm.descriptionFr}
                  onChange={(e) => setProjectForm({ ...projectForm, descriptionFr: e.target.value })}
                  className="w-full min-h-[100px] px-4 py-2 bg-surface border border-surface/50 rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("admin.descriptionEn")}
                </label>
                <textarea
                  value={projectForm.descriptionEn}
                  onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })}
                  className="w-full min-h-[100px] px-4 py-2 bg-surface border border-surface/50 rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("admin.url")}
                </label>
                <Input
                  type="url"
                  value={projectForm.url}
                  onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("admin.githubUrl")}
                </label>
                <Input
                  type="url"
                  value={projectForm.githubUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  placeholder="https://github.com/example"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("admin.images")}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {projectForm.imageUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={getImageUrl(url)}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg border border-surface/50"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProjectForm({
                          ...projectForm,
                          imageUrls: projectForm.imageUrls.filter((_, j) => j !== i),
                        })
                      }
                      className="absolute -top-1 -right-1 min-touch-target w-6 h-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center hover:bg-red-600 transition-colors"
                      aria-label={t("admin.removeImage")}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsImageSelectorOpen(true)}
              >
                {t("admin.selectImage")}
              </Button>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={projectForm.published}
                  onChange={(e) => setProjectForm({ ...projectForm, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-text-primary">{t("admin.published")}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("admin.technologies")}
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-surface/50 rounded-lg">
                {technologies.map((tech) => (
                  <label key={tech.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectForm.technologyIds.includes(tech.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProjectForm({
                            ...projectForm,
                            technologyIds: [...projectForm.technologyIds, tech.id],
                          });
                        } else {
                          setProjectForm({
                            ...projectForm,
                            technologyIds: projectForm.technologyIds.filter((id) => id !== tech.id),
                          });
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-text-primary">{tech.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseProjectModal}>
                {t("admin.cancel")}
              </Button>
              <Button type="submit" variant="primary">
                {editingProject ? t("admin.update") : t("admin.create")}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Technology Modal */}
        <Modal
          isOpen={isTechnologyModalOpen}
          onClose={handleCloseTechnologyModal}
          title={editingTechnology ? t("admin.editTechnology") : t("admin.newTechnology")}
          size="md"
        >
          <form onSubmit={handleSubmitTechnology} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("admin.name")}
              </label>
              <Input
                value={technologyForm.name}
                onChange={(e) => setTechnologyForm({ ...technologyForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("admin.icon")}
              </label>
              <Input
                value={technologyForm.icon}
                onChange={(e) => setTechnologyForm({ ...technologyForm, icon: e.target.value })}
                placeholder="react-icon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("admin.category")}
              </label>
              <Input
                value={technologyForm.category}
                onChange={(e) => setTechnologyForm({ ...technologyForm, category: e.target.value })}
                placeholder="Frontend"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseTechnologyModal}>
                {t("admin.cancel")}
              </Button>
              <Button type="submit" variant="primary">
                {editingTechnology ? t("admin.update") : t("admin.create")}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Profile Modal */}
        <Modal
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
          title={t("admin.editProfile")}
          size="lg"
        >
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("admin.prenom")}
                </label>
                <Input
                  value={profileForm.prenom}
                  onChange={(e) => setProfileForm({ ...profileForm, prenom: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t("admin.nom")}
                </label>
                <Input
                  value={profileForm.nom}
                  onChange={(e) => setProfileForm({ ...profileForm, nom: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("admin.email")}
              </label>
              <Input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("admin.tel")}
              </label>
              <Input
                type="tel"
                value={profileForm.tel}
                onChange={(e) => setProfileForm({ ...profileForm, tel: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("admin.linkedIn")}
              </label>
              <Input
                type="url"
                value={profileForm.linkedIn}
                onChange={(e) => setProfileForm({ ...profileForm, linkedIn: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("admin.github")}
              </label>
              <Input
                type="url"
                value={profileForm.github}
                onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("admin.selectPhoto")}
              </label>
              <div className="flex gap-2 items-center">
                {profileForm.photoId && (
                  <img
                    src={getImageUrl(profile?.photo?.url || "")}
                    alt="Selected photo"
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPhotoSelectorOpen(true)}
                >
                  {profileForm.photoId ? t("admin.selectPhoto") : t("admin.selectPhoto")}
                </Button>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseProfileModal}>
                {t("admin.cancel")}
              </Button>
              <Button type="submit" variant="primary">
                {t("admin.update")}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Image Selector Modal for Projects */}
        <Modal
          isOpen={isImageSelectorOpen}
          onClose={() => setIsImageSelectorOpen(false)}
          title={t("admin.selectImage")}
          size="lg"
        >
          <PhotoSelector
            selectedPhotoId={null}
            onSelect={(_photoId, photoUrl) => {
              setProjectForm({
                ...projectForm,
                imageUrls: [...projectForm.imageUrls, photoUrl],
              });
              setIsImageSelectorOpen(false);
            }}
            onCancel={() => setIsImageSelectorOpen(false)}
          />
        </Modal>

        {/* Photo Selector Modal for Profile */}
        <Modal
          isOpen={isPhotoSelectorOpen}
          onClose={() => setIsPhotoSelectorOpen(false)}
          title={t("admin.selectPhoto")}
          size="lg"
        >
          <PhotoSelector
            selectedPhotoId={profileForm.photoId}
            onSelect={(photoId, _photoUrl) => {
              setProfileForm({ ...profileForm, photoId });
              setIsPhotoSelectorOpen(false);
            }}
            onCancel={() => setIsPhotoSelectorOpen(false)}
          />
        </Modal>
      </PageWrapper>
    </ProtectedRoute>
  );
}
