import request from "supertest";
import app from "../app";
import { pool } from "../config";

describe("Notification API", () => {
  let patientToken: string;

  beforeAll(async () => {
    // 1. Get Patient auth
    const res = await request(app).post("/api/auth/login")
      .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
    patientToken = res.body.data?.tokens?.accessToken;
  });

  describe("GET /api/notifications", () => {
    it("should get notifications for authenticated user", async () => {
      const res = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return unread count", async () => {
      const res = await request(app)
        .get("/api/notifications/unread-count")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data.count).toBe("number");
    });
  });

  describe("PATCH /api/notifications/:id/read", () => {
    it("should return 404 for invalid notification", async () => {
      const res = await request(app)
        .patch("/api/notifications/99999/read")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(404);
    });
  });
});
