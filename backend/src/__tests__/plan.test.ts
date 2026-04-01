import request from "supertest";
import app from "../app";
import { pool } from "../config";

describe("Plan API", () => {
  let dietitianToken: string;
  let patientToken: string;
  let patientProfileId: string;
  let planId: string;

  beforeAll(async () => {
    // 1. Get Dietitian auth
    let res = await request(app).post("/api/auth/login")
      .send({ email: "elif.kaya@nutriai.com", password: "elif1234" });
    dietitianToken = res.body.data?.tokens?.accessToken;

    // 2. Get Patient auth
    res = await request(app).post("/api/auth/login")
      .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
    patientToken = res.body.data?.tokens?.accessToken;

    // 3. Get patient PROFILE id (not user id)
    if (patientToken) {
      res = await request(app)
        .get("/api/patients/me")
        .set("Authorization", `Bearer ${patientToken}`);
      patientProfileId = res.body.data?.id;
    }
  });

  describe("POST /api/plans", () => {
    it("should return 401 without auth", async () => {
      const res = await request(app).post("/api/plans").send({});
      expect(res.status).toBe(401);
    });

    it("should allow dietitian to create plan for patient", async () => {
      if (!dietitianToken || !patientProfileId) return;
      const res = await request(app)
        .post("/api/plans")
        .set("Authorization", `Bearer ${dietitianToken}`)
        .send({
          patientId: patientProfileId,
          title: "Onemli Hafta",
          startDate: "2025-10-20",
          items: [
            {
              dayOfWeek: 1,
              mealType: "Kahvalti",
              foodName: "Yulaf ezmesi",
              amountG: 100,
              calories: 350
            }
          ]
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      planId = res.body.data.id;
    });

    it("should reject patient from creating plan", async () => {
      if (!patientToken || !patientProfileId) return;
      const res = await request(app)
        .post("/api/plans")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          patientId: patientProfileId,
          title: "Test",
          startDate: "2025-10-20",
          items: [{ dayOfWeek: 1, mealType: "Kahvalti", foodName: "Test" }]
        });
      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/plans", () => {
    it("should list plans for authenticated user", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .get("/api/plans")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("PATCH /api/plans/:id/status", () => {
    it("should update plan status", async () => {
      if (!planId || !dietitianToken) return;
      const res = await request(app)
        .patch(`/api/plans/${planId}/status`)
        .set("Authorization", `Bearer ${dietitianToken}`)
        .send({ status: "active" });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  afterAll(async () => {
    if (planId) {
      await pool.query("DELETE FROM meal_plan_items WHERE meal_plan_id = $1", [planId]).catch(() => {});
      await pool.query("DELETE FROM meal_plans WHERE id = $1", [planId]).catch(() => {});
    }
  });
});
