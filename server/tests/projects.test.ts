import request from "supertest";
import { app } from "../src/app.js";
import { createUser } from "./fixtures/user.fixture.js";
import { createProject } from "./fixtures/project.fixture.js";
import { createTechnology } from "./fixtures/technology.fixture.js";

describe("Projects", () => {
  let authCookie: string;
  const agent = request(app);

  beforeEach(async () => {
    const user = await createUser();
    const loginResponse = await agent.post("/api/auth/login").send({
      email: user.email,
      password: "password123",
    });
    const setCookieHeader = loginResponse.headers["set-cookie"];
    if (Array.isArray(setCookieHeader) && setCookieHeader[0]) {
      authCookie = setCookieHeader[0];
    } else {
      throw new Error("No cookie set in login response");
    }
  });

  describe("GET /api/projects", () => {
    it("should return empty array initially", async () => {
      const response = await agent.get("/api/projects").expect(200);

      expect(response.body).toEqual([]);
    });

    it("should return all projects", async () => {
      const technology = await createTechnology({ name: "React" });
      await createProject({
        titleFr: "Mon Portfolio",
        titleEn: "My Portfolio",
        descriptionFr: "Un beau site portfolio",
        descriptionEn: "A beautiful portfolio website",
        published: true,
        technologyIds: [technology.id],
      });

      const response = await agent.get("/api/projects").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("titleFr", "Mon Portfolio");
      expect(response.body[0]).toHaveProperty("titleEn", "My Portfolio");
      expect(response.body[0]).toHaveProperty("Technologies");
    });

    it("should filter by published status", async () => {
      await createProject({
        titleFr: "Projet publié",
        titleEn: "Published Project",
        descriptionFr: "Ceci est publié",
        descriptionEn: "This is published",
        published: true,
      });
      await createProject({
        titleFr: "Projet brouillon",
        titleEn: "Draft Project",
        descriptionFr: "Ceci est un brouillon",
        descriptionEn: "This is a draft",
        published: false,
      });

      const publishedResponse = await agent
        .get("/api/projects?published=true")
        .expect(200);
      expect(publishedResponse.body.length).toBeGreaterThan(0);
      expect(publishedResponse.body.every((p: { published: boolean }) => p.published)).toBe(true);

      const draftResponse = await agent
        .get("/api/projects?published=false")
        .expect(200);
      expect(draftResponse.body.length).toBeGreaterThan(0);
      expect(draftResponse.body.every((p: { published: boolean }) => !p.published)).toBe(true);
    });
  });

  describe("GET /api/projects/:id", () => {
    it("should return 404 for non-existent project", async () => {
      await agent
        .get("/api/projects/00000000-0000-0000-0000-000000000000")
        .expect(404);
    });

    it("should return project by id", async () => {
      const technology = await createTechnology({ name: "Vue.js" });
      const project = await createProject({
        titleFr: "App Vue",
        titleEn: "Vue App",
        descriptionFr: "Une application Vue.js",
        descriptionEn: "A Vue.js application",
        technologyIds: [technology.id],
      });

      const response = await agent.get(`/api/projects/${project.id}`).expect(200);

      expect(response.body).toHaveProperty("id", project.id);
      expect(response.body).toHaveProperty("titleFr", "App Vue");
      expect(response.body).toHaveProperty("titleEn", "Vue App");
      expect(response.body).toHaveProperty("Technologies");
    });
  });

  describe("POST /api/projects", () => {
    it("should create a project when authenticated", async () => {
      const response = await agent
        .post("/api/projects")
        .set("Cookie", authCookie)
        .send({
          titleFr: "Projet test",
          titleEn: "Test Project",
          descriptionFr: "Description de test du projet",
          descriptionEn: "This is a test project description",
          url: "https://example.com",
          published: true,
        })
        .expect(201);

      expect(response.body).toHaveProperty("titleFr", "Projet test");
      expect(response.body).toHaveProperty("titleEn", "Test Project");
    });

    it("should require authentication", async () => {
      await agent
        .post("/api/projects")
        .send({
          titleFr: "Projet test",
          titleEn: "Test Project",
          descriptionFr: "Description de test",
          descriptionEn: "This is a test project description",
        })
        .expect(401);
    });
  });
});
