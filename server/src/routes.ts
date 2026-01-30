import { Router } from "express";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { projectRoutes } from "./modules/projects/project.routes.js";
import { technologyRoutes } from "./modules/technologies/technology.routes.js";
import { contactRoutes } from "./modules/contacts/contact.routes.js";
import { profileRoutes } from "./modules/profile/profile.routes.js";
import { photoRoutes } from "./modules/photos/photo.routes.js";
import { visitRoutes } from "./modules/visits/visit.routes.js";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/projects", projectRoutes);
routes.use("/technologies", technologyRoutes);
routes.use("/contacts", contactRoutes);
routes.use("/profile", profileRoutes);
routes.use("/photos", photoRoutes);
routes.use("/visits", visitRoutes);