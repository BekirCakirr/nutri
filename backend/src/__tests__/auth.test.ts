import request from "supertest";
import app from "../app";
import { pool } from "../config";

describe("Auth API", () => {
  let patientToken: string;
  let dietitianToken: string;

  // We rely on existing seeded data or create temporary users
  const testPatient = {
    email: "test.patient@auth.com",
    password: "password123",
    firstName: "Test",
    lastName: "Patient"
  };

  const testDietitian = {
    email: "test.dietitian@auth.com",
    password: "password123",
    firstName: "Test",
    lastName: "Dietitian",
    licenseNumber: "LIC123456"
  };

  afterAll(async () => {
    // Cleanup generated test data
    try {
      await pool.query("DELETE FROM users WHERE email IN ($1, $2)", [testPatient.email, testDietitian.email]);
    } catch (err) {
      console.error("Cleanup failed", err);
    }
  });

  describe("POST /api/auth/register", () => {
    it("should register a new dietitian", async () => {
      const res = await request(app).post("/api/auth/register/dietitian").send(testDietitian);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty("id");
      expect(res.body.data.tokens).toHaveProperty("accessToken");
      dietitianToken = res.body.data.tokens.accessToken;
    });

    it("should register a new patient", async () => {
      const res = await request(app).post("/api/auth/register/patient").send(testPatient);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty("id");
      expect(res.body.data.tokens).toHaveProperty("accessToken");
      patientToken = res.body.data.tokens.accessToken;
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login as dietitian", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testDietitian.email,
        password: testDietitian.password
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens).toHaveProperty("accessToken");
      dietitianToken = res.body.data.tokens.accessToken;
    });

    it("should fail login with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testPatient.email,
        password: "wrongpassword"
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return 401 without auth", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("should get own profile with auth", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${patientToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.email).toBe(testPatient.email);
    });
  });
});
