import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import { useVisitTracking } from "../hooks/useVisitTracking";
import { Home } from "../pages/Home/Home";
import { Projects } from "../pages/Projects/Projects";
import { ProjectDetails } from "../pages/ProjectDetails/ProjectDetails";
import { About } from "../pages/About/About";
import { Contact } from "../pages/Contact/Contact";
import { Admin } from "../pages/Admin/Admin";
import { Login } from "../pages/Login/Login";
import { Error404 } from "../pages/Error404/Error404";

export function Routes() {
  useVisitTracking();
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Error404 />} />
    </ReactRouterRoutes>
  );
}
