import request from "supertest";
import app from "../app";
import { pool } from "../config";

describe("Appointments API", () => {
  let dietitianToken: string;
  let patientToken: string;
  let dietitianId: string;
  let appointmentId: string;

  beforeAll(async () => {
    // 1. Get Dietitian auth
    let res = await request(app).post("/api/auth/login")
      .send({ email: "elif.kaya@nutriai.com", password: "elif1234" });
    dietitianToken = res.body.data?.tokens?.accessToken;
    dietitianId = res.body.data?.user?.id;

    // 2. Get Patient auth
    res = await request(app).post("/api/auth/login")
      .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
    patientToken = res.body.data?.tokens?.accessToken;
  });

  describe("POST /api/appointments", () => {
    it("should return 401 without auth", async () => {
      const res = await request(app).post("/api/appointments").send({});
      expect(res.status).toBe(401);
    });

    it("should create a new appointment", async () => {
      // Must have patient/dietitian relation (which they do by seed)
      const res = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          dietitianId: dietitianId,
          date: "2025-10-15",
          startTime: "10:00:00",
          endTime: "10:45:00",
          type: "online",
          notes: "Ilk gorusme"
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      appointmentId = res.body.data.id;
    });
  });

  describe("GET /api/appointments", () => {
    it("should list appointments for patient", async () => {
      const res = await request(app)
        .get("/api/appointments")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      
      const found = res.body.data.find((a: any) => a.id === appointmentId);
      expect(found).toBeDefined();
    });

    it("should list appointments for dietitian", async () => {
      const res = await request(app)
        .get("/api/appointments")
        .set("Authorization", `Bearer ${dietitianToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      
      const found = res.body.data.find((a: any) => a.id === appointmentId);
      expect(found).toBeDefined();
    });
  });

  describe("PATCH /api/appointments/:id/status", () => {
    it("should allow dietitian to confirm appointment", async () => {
      const res = await request(app)
        .patch(`/api/appointments/${appointmentId}/status`)
        .set("Authorization", `Bearer ${dietitianToken}`)
        .send({ status: "confirmed" });
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("confirmed");
    });

    it("should allow patient to cancel appointment", async () => {
      const res = await request(app)
        .patch(`/api/appointments/${appointmentId}/status`)
        .set("Authorization", `Bearer ${patientToken}`)
        .send({ status: "cancelled" });
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("cancelled");
    });
  });

  afterAll(async () => {
    // Delete test appointment
    if (appointmentId) {
      await pool.query("DELETE FROM appointments WHERE id = $1", [appointmentId]).catch(() => {});
    }
  });
});
