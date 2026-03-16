import { useRef } from "react";
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
import { useTechnologies } from "../../hooks/useTechnologies";
import { useLanguage } from "../../contexts/LanguageContext";
import { getImageUrl } from "../../utils/imageUrl";
import { ExternalLink, Github, ChevronDown, User, Mail, Code, Layers } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import type { Project } from "../../types/api";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaRef,
    offset: ["start 80%", "end 20%"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.2]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 0.8]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.45], [1, 0]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const ctaBackgroundY = useTransform(ctaScrollProgress, [0, 1], ["0%", "30%"]);
  const ctaBackgroundScale = useTransform(ctaScrollProgress, [0, 0.7], [1, 1.08]);
  const ctaOverlayOpacity = useTransform(ctaScrollProgress, [0, 0.5], [0.75, 0.95]);
  const ctaContentOpacity = useTransform(ctaScrollProgress, [0, 0.3], [1, 0.8]);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.2 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const projectsInView = useInView(projectsRef, { once: true, amount: 0.08 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  const { projects, isLoading, error } = useProjects(true);
  const { technologies } = useTechnologies();
  const { profile } = useProfile();
  const { language, t } = useLanguage();

  const getProjectTitle = (project: Project) => {
    return language === "fr" ? project.titleFr : project.titleEn;
  };

  const getProjectDescription = (project: Project) => {
    return language === "fr" ? project.descriptionFr : project.descriptionEn;
  };

  const publishedProjects = projects.filter((p) => p.published);

  return (
    <PageWrapper>
      {/* ——— HERO PARALLAX ——— */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden mb-24"
        aria-label="Hero"
      >
        {/* Orbes de lumière décoratives */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-accent/15 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[80px]" />
        </div>

        {/* Couche parallax : image de fond */}
        <motion.div
          className="absolute inset-0 -top-[25%] -bottom-[25%]"
          style={{ y: backgroundY, scale: backgroundScale }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/background.png)" }}
          />
          <div className="absolute inset-0 bg-background/30" />
        </motion.div>

        {/* Overlay gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background"
          style={{ opacity: overlayOpacity }}
          aria-hidden
        />

        {/* Contenu hero */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-8 text-center px-4"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-8"
          >
            {profile?.photo?.url && (
              <motion.div
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-50 blur-lg" />
                <img
                  src={getImageUrl(profile.photo.url)}
                  alt={profile.prenom && profile.nom ? `${profile.prenom} ${profile.nom}` : "Profile"}
                  className="relative w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-primary shadow-2xl shadow-primary/25"
                />
              </motion.div>
            )}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight drop-shadow-lg"
              >
                {t("home.title")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm [text-shadow:0_0_20px_rgba(0,0,0,0.8),0_1px_2px_rgba(0,0,0,0.6)]"
              >
                {t("home.subtitle")}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{ opacity: scrollIndicatorOpacity }}
          aria-hidden
        >
          <span className="text-xs uppercase tracking-widest text-text-secondary/80">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-primary" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </section>

      {/* ——— SECTION À PROPOS (avec open_space) ——— */}
      <section
        ref={aboutRef}
        className="relative py-20 md:py-28 overflow-hidden"
        aria-labelledby="about-preview-heading"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/20 to-transparent pointer-events-none" />
        <motion.div
          className="relative container mx-auto px-4 max-w-6xl"
          initial="hidden"
          animate={aboutInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo open space */}
            <motion.div variants={staggerItem} className="order-2 lg:order-1">
              <img
                src="/open_space.png"
                alt="Espace de travail"
                className="w-full rounded-2xl shadow-2xl border border-surface/50 object-cover aspect-[4/3]"
              />
            </motion.div>
            {/* Texte */}
            <div className="order-1 lg:order-2">
              <motion.div variants={staggerItem}>
                <span className="inline-flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-widest mb-4">
                  <User className="w-4 h-4" />
                  {t("about.title")}
                </span>
                <h2 id="about-preview-heading" className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                  {t("about.whoAmI")}
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed mb-8">
                  {profile?.descriptionFr || profile?.descriptionEn
                    ? language === "fr"
                      ? profile?.descriptionFr
                      : profile?.descriptionEn
                    : `${t("about.bio1")} ${t("about.bio2")}`}
                </p>
              </motion.div>
              <motion.div variants={staggerItem}>
                <Link
                  to="/about"
                  className="min-touch-target inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                >
                  {t("home.discoverMe")}
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ——— SECTION CHIFFRES ——— */}
      <section
        ref={statsRef}
        className="relative py-16 md:py-20"
        aria-label="Stats"
      >
        <motion.div
          className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto"
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div
            variants={staggerItem}
            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-surface/60 border border-surface backdrop-blur-sm text-center"
          >
            <Code className="w-10 h-10 text-primary mb-4" />
            <span className="text-4xl md:text-5xl font-bold text-text-primary tabular-nums">
              {publishedProjects.length}
            </span>
            <span className="text-text-secondary mt-1">{t("home.projectsCount")}</span>
          </motion.div>
          <motion.div
            variants={staggerItem}
            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-surface/60 border border-surface backdrop-blur-sm text-center"
          >
            <Layers className="w-10 h-10 text-accent mb-4" />
            <span className="text-4xl md:text-5xl font-bold text-text-primary tabular-nums">
              {technologies.length}
            </span>
            <span className="text-text-secondary mt-1">{t("home.technologies")}</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ——— SECTION PROJETS RÉCENTS ——— */}
      <section
        ref={projectsRef}
        className="relative py-20 md:py-28"
        aria-labelledby="projects-heading"
      >
        <motion.div
          initial="hidden"
          animate={projectsInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem} className="mb-14">
            <SectionTitle subtitle="">
              {t("home.recentProjects")}
            </SectionTitle>
          </motion.div>

          {isLoading && <Loader />}
          {error && <ErrorState message={error} />}
          {!isLoading && !error && projects.length === 0 && (
            <EmptyState
              title="Aucun projet disponible"
              description="Les projets seront bientôt disponibles"
            />
          )}

          {!isLoading && !error && projects.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate={projectsInView ? "visible" : "hidden"}
            >
              {projects.slice(0, 6).map((project) => (
                <motion.div
                  key={project.id}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className="group h-full flex flex-col overflow-hidden transition-shadow hover:shadow-xl hover:shadow-primary/10"
                    onClick={() => (window.location.href = `/projects/${project.id}`)}
                  >
                    {project.imageUrls?.length > 0 && (
                      <div className="w-full h-52 bg-surface/50 rounded-t-lg flex items-center justify-center overflow-hidden border-b border-surface/50">
                        <img
                          src={getImageUrl(project.imageUrls[0])}
                          alt={getProjectTitle(project)}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold text-text-primary mb-2">
                        {getProjectTitle(project)}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4 flex-1 line-clamp-3">
                        {getProjectDescription(project)}
                      </p>
                      <ul
                        className="flex flex-wrap gap-2 mb-4 list-none p-0 m-0"
                        aria-label="Technologies used"
                      >
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
                      <div className="flex gap-3 mt-auto">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-touch-target text-primary hover:text-accent inline-flex items-center justify-center transition-colors"
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
                            className="min-touch-target text-primary hover:text-accent inline-flex items-center justify-center transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="View on GitHub"
                          >
                            <Github size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && !error && projects.length > 6 && (
            <motion.div
              variants={staggerItem}
              className="text-center mt-12"
            >
              <Link to="/projects">
                <span className="min-touch-target inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                  {t("home.viewAllProjects")}
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </span>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ——— SECTION CTA CONTACT ——— */}
      <section
        ref={ctaRef}
        className="relative py-24 md:py-32 overflow-hidden"
        aria-labelledby="cta-heading"
      >
        {/* Fond parallax mail.png */}
        <motion.div
          className="absolute inset-0 -top-[15%] -bottom-[15%]"
          style={{ y: ctaBackgroundY, scale: ctaBackgroundScale }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/mail.png)" }}
          />
        </motion.div>
        {/* Overlay sombre pour le contraste */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background"
          style={{ opacity: ctaOverlayOpacity }}
          aria-hidden
        />
        {/* Contenu CTA */}
        <motion.div
          className="relative container mx-auto px-4 max-w-3xl text-center"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={staggerContainer}
          style={{ opacity: ctaContentOpacity }}
        >
          <motion.div variants={staggerItem}>
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-widest mb-6">
              <Mail className="w-4 h-4" />
              {t("contact.title")}
            </span>
            <h2
              id="cta-heading"
              className="text-3xl md:text-5xl font-bold text-text-primary mb-6 [text-shadow:0_0_22px_rgba(0,0,0,0.95),0_2px_4px_rgba(0,0,0,0.85)]"
            >
              {t("home.ctaTitle")}
            </h2>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-xl mx-auto [text-shadow:0_0_18px_rgba(0,0,0,0.9),0_1px_3px_rgba(0,0,0,0.8)]">
              {t("home.ctaDescription")}
            </p>
            <Link
              to="/contact"
              className="min-touch-target inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              {t("home.getInTouch")}
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
