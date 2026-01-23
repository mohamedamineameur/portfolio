import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { Projects } from "../pages/Projects/Projects";
import { ProjectDetails } from "../pages/ProjectDetails/ProjectDetails";
import { About } from "../pages/About/About";
import { Contact } from "../pages/Contact/Contact";
import { Admin } from "../pages/Admin/Admin";

export function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<Admin />} />
    </ReactRouterRoutes>
  );
}
