import request from "supertest";
import { app } from "../src/app.js";
import { createContact } from "./fixtures/contact.fixture.js";
import { createUser } from "./fixtures/user.fixture.js";

describe("Contacts", () => {
  describe("GET /api/contacts", () => {
    it("should return empty array initially", async () => {
      const user = await createUser();
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({
        email: user.email,
        password: "password123",
      });

      const response = await agent.get("/api/contacts").expect(200);
      expect(response.body).toEqual([]);
    });

    it("should return all contacts", async () => {
      const user = await createUser();
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({
        email: user.email,
        password: "password123",
      });

      await createContact({
        name: "Jane Doe",
        email: "jane@example.com",
        message: "Test message",
      });

      const response = await agent.get("/api/contacts").expect(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("name", "Jane Doe");
    });

    it("should require authentication", async () => {
      await request(app).get("/api/contacts").expect(401);
    });
  });

  describe("POST /api/contacts", () => {
    it("should create a contact message", async () => {
      const response = await request(app)
        .post("/api/contacts")
        .send({
          name: "John Doe",
          email: "john@example.com",
          message: "This is a test message",
        })
        .expect(201);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("contact");
      expect(response.body.contact).toHaveProperty("name", "John Doe");
    });

    it("should validate input", async () => {
      await request(app)
        .post("/api/contacts")
        .send({
          name: "",
          email: "invalid-email",
          message: "short",
        })
        .expect(400);
    });
  });
});
