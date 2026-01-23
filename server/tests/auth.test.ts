import request from "supertest";
import { app } from "../src/app.js";
import { createUser } from "./fixtures/user.fixture.js";

describe("Auth", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "newuser@test.com",
          password: "password123",
        })
        .expect(201);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("email", "newuser@test.com");
    });

    it("should reject duplicate email", async () => {
      await createUser({ email: "existing@test.com" });

    await request(app)
        .post("/api/auth/register")
        .send({
          email: "existing@test.com",
          password: "password123",
        })
        .expect(400);
        
    });

    it("should validate input", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          email: "invalid-email",
          password: "short",
        })
        .expect(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      await createUser({
        email: "login@test.com",
        password: "password123",
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@test.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("user");
    });

    it("should reject invalid credentials", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@test.com",
          password: "wrongpassword",
        })
        .expect(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user info when authenticated", async () => {
      const user = await createUser();

      const agent = request.agent(app);
      const loginResponse = await agent.post("/api/auth/login").send({
        email: user.email,
        password: "password123",
      }).expect(200);

      expect(loginResponse.body).toHaveProperty("message", "Login successful");

      const response = await agent.get("/api/auth/me").expect(200);
      expect(response.body.user).toHaveProperty("email", user.email);
    });

    it("should return 401 when not authenticated", async () => {
      await request(app).get("/api/auth/me").expect(401);
    });
  });
});
