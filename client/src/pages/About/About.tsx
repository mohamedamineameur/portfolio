import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionTitle } from "../../components/common/SectionTitle";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { motion } from "framer-motion";
import { Code, Database, Globe, Smartphone } from "lucide-react";

export function About() {
  const skills = [
    { name: "Frontend", icon: Globe, color: "primary" },
    { name: "Backend", icon: Database, color: "accent" },
    { name: "Mobile", icon: Smartphone, color: "primary" },
    { name: "DevOps", icon: Code, color: "accent" },
  ];

  return (
    <PageWrapper>
      <SectionTitle subtitle="En savoir plus sur mon parcours et mes compétences">
        À propos de moi
      </SectionTitle>

      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Qui suis-je ?
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Développeur full stack passionné par la création d'applications web
              modernes et performantes. Je me spécialise dans les technologies
              JavaScript/TypeScript et j'aime créer des expériences utilisateur
              exceptionnelles.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Mon objectif est de combiner créativité et expertise technique pour
              développer des solutions innovantes qui répondent aux besoins réels
              des utilisateurs.
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
              Compétences
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
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
                  <p className="text-text-primary font-medium">{skill.name}</p>
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
              Technologies
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
