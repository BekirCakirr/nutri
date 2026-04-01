import request from "supertest";
import app from "../app";

describe("Tracking API", () => {
  let patientToken: string;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login")
      .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
    patientToken = res.body.data?.tokens?.accessToken;
  });

  describe("POST /api/tracking/water", () => {
    it("should allow patient to log water intake", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .post("/api/tracking/water")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({ glasses: 1 });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/tracking/water", () => {
    it("should get water history for patient", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .get("/api/tracking/water")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/tracking/water/today", () => {
    it("should get today's water intake", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .get("/api/tracking/water/today")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/tracking/summary/today", () => {
    it("should get today's tracking summary", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .get("/api/tracking/summary/today")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/tracking/weight", () => {
    it("should log weight for patient", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .post("/api/tracking/weight")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({ weightKg: 68.5 });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/tracking/weight", () => {
    it("should get weight history", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .get("/api/tracking/weight")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
