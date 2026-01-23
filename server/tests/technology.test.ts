import request from "supertest";
import { app } from "../src/app.js";
import { createUser } from "./fixtures/user.fixture.js";
import { createTechnology } from "./fixtures/technology.fixture.js";

describe("Technologies", () => {
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

  describe("GET /api/technologies", () => {
    it("should return empty array initially", async () => {
      const response = await request(app)
        .get("/api/technologies")
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it("should return all technologies", async () => {
      await createTechnology({
        name: "TypeScript",
        icon: "typescript-icon",
        category: "Language",
      });

      const response = await request(app)
        .get("/api/technologies")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("name", "TypeScript");
    });
  });

  describe("GET /api/technologies/:id", () => {
    it("should return 404 for non-existent technology", async () => {
      await request(app).get("/api/technologies/999").expect(404);
    });

    it("should return technology by id", async () => {
      const technology = await createTechnology({
        name: "React",
        icon: "react-icon",
        category: "Framework",
      });

      const response = await request(app)
        .get(`/api/technologies/${technology.id}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", technology.id);
      expect(response.body).toHaveProperty("name", "React");
    });
  });

  describe("POST /api/technologies", () => {
    it("should create a technology when authenticated", async () => {
      const response = await agent
        .post("/api/technologies")
        .set("Cookie", authCookie)
        .send({
          name: "Node.js",
          icon: "nodejs-icon",
          category: "Runtime",
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name", "Node.js");
      expect(response.body).toHaveProperty("icon", "nodejs-icon");
      expect(response.body).toHaveProperty("category", "Runtime");
    });

    it("should require authentication", async () => {
      await request(app)
        .post("/api/technologies")
        .send({
          name: "Vue.js",
          icon: "vue-icon",
          category: "Framework",
        })
        .expect(401);
    });

    it("should validate input", async () => {
      await agent
        .post("/api/technologies")
        .set("Cookie", authCookie)
        .send({
          name: "",
        })
        .expect(400);
    });
  });

  describe("PUT /api/technologies/:id", () => {
    it("should update a technology when authenticated", async () => {
      // Create a technology first
      const createResponse = await agent
        .post("/api/technologies")
        .set("Cookie", authCookie)
        .send({
          name: "JavaScript",
          icon: "js-icon",
          category: "Language",
        })
        .expect(201);

      const technologyId = createResponse.body.id;

      const response = await agent
        .put(`/api/technologies/${technologyId}`)
        .set("Cookie", authCookie)
        .send({
          name: "JavaScript ES6+",
          category: "Programming Language",
        })
        .expect(200);

      expect(response.body).toHaveProperty("id", technologyId);
      expect(response.body).toHaveProperty("name", "JavaScript ES6+");
      expect(response.body).toHaveProperty("category", "Programming Language");
    });

    it("should require authentication", async () => {
      await request(app)
        .put("/api/technologies/1")
        .send({
          name: "Updated Name",
        })
        .expect(401);
    });

    it("should return 404 for non-existent technology", async () => {
      await agent
        .put("/api/technologies/999")
        .set("Cookie", authCookie)
        .send({
          name: "Updated Name",
        })
        .expect(404);
    });
  });

  describe("DELETE /api/technologies/:id", () => {
    it("should delete a technology when authenticated", async () => {
      // Create a technology first
      const createResponse = await agent
        .post("/api/technologies")
        .set("Cookie", authCookie)
        .send({
          name: "Python",
          icon: "python-icon",
          category: "Language",
        })
        .expect(201);

      const technologyId = createResponse.body.id;

      await agent
        .delete(`/api/technologies/${technologyId}`)
        .set("Cookie", authCookie)
        .expect(204);

      // Verify it's deleted
      await request(app).get(`/api/technologies/${technologyId}`).expect(404);
    });

    it("should require authentication", async () => {
      await request(app).delete("/api/technologies/1").expect(401);
    });

    it("should return 404 for non-existent technology", async () => {
      await agent
        .delete("/api/technologies/999")
        .set("Cookie", authCookie)
        .expect(404);
    });
  });
});
