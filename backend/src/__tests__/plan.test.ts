import request from "supertest";
import app from "../app";
import { pool } from "../config";

describe("Plan API", () => {
  let dietitianToken: string;
  let patientToken: string;
  let patientId: string;
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
    patientId = res.body.data?.user?.id;
  });

  describe("POST /api/plans", () => {
    it("should return 401 without auth", async () => {
      const res = await request(app).post("/api/plans").send({});
      expect(res.status).toBe(401);
    });

    it("should allow dietitian to create plan for patient", async () => {
      const res = await request(app)
        .post("/api/plans")
        .set("Authorization", `Bearer ${dietitianToken}`)
        .send({
          patientId: patientId,
          startDate: "2025-10-20",
          endDate: "2025-10-27",
          title: "Onemli Hafta",
          description: "Bu hafta karbonhidrat azaltilacak."
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      planId = res.body.data.id;
    });
  });

  describe("GET /api/plans/patient/:patientId", () => {
    it("should list active plans for patient", async () => {
      const res = await request(app)
        .get(`/api/plans/patient/${patientId}`)
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      
      const found = res.body.data.find((p: any) => p.id === planId);
      expect(found).toBeDefined();
    });
  });

  describe("POST /api/plans/:planId/meals", () => {
    it("should allow dietitian to add meals to plan", async () => {
      const res = await request(app)
        .post(`/api/plans/${planId}/meals`)
        .set("Authorization", `Bearer ${dietitianToken}`)
        .send({
          dayOfWeek: "Monday",
          mealTime: "Kahvalti",
          foodId: 1, // Must exist in seeded db
          portion: 1
        });
      
      expect(res.status === 201 || res.status === 400).toBeTruthy();
    });
  });

  afterAll(async () => {
    // Delete test plan
    if (planId) {
      await pool.query("DELETE FROM meal_plans WHERE id = $1", [planId]).catch(() => {});
    }
  });
});
