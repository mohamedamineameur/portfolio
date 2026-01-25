export { User } from "./User.model.js";
export { Project } from "./Project.model.js";
export { Technology } from "./Technology.model.js";
export { Contact } from "./Contact.model.js";
export { Profile } from "./Profile.model.js";
export { Photo } from "./Photo.model.js";

// Initialize associations after all models are loaded
import { initializeAssociations } from "./associations.js";
initializeAssociations();
