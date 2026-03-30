import request from "supertest";
import app from "../app";
import { pool } from "../config";

describe("Tracking API (Habits & Metrics)", () => {
  let patientToken: string;

  beforeAll(async () => {
    // 1. Get Patient auth
    const res = await request(app).post("/api/auth/login")
      .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
    patientToken = res.body.data?.tokens?.accessToken;
  });

  describe("POST /api/tracking/water", () => {
    it("should allow patient to log water intake", async () => {
      const res = await request(app)
        .post("/api/tracking/water")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          amountMl: 250,
          date: new Date().toISOString().split('T')[0]
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/tracking/water", () => {
    it("should get today's water intake for patient", async () => {
      const date = new Date().toISOString().split('T')[0];
      const res = await request(app)
        .get("/api/tracking/water")
        .set("Authorization", `Bearer ${patientToken}`)
        .query({ date });
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("total_ml");
    });
  });

  describe("POST /api/tracking/metrics", () => {
    it("should log daily metrics (weight, mood)", async () => {
      const res = await request(app)
        .post("/api/tracking/metrics")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          weightKg: 68.5,
          mood: "good",
          sleepHours: 8,
          energyLevel: 4,
          date: new Date().toISOString().split('T')[0]
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/tracking/metrics", () => {
    it("should get daily metrics for patient", async () => {
      const date = new Date().toISOString().split('T')[0];
      const res = await request(app)
        .get("/api/tracking/metrics")
        .set("Authorization", `Bearer ${patientToken}`)
        .query({ start_date: date, end_date: date });
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
