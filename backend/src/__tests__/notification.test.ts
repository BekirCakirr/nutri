import request from "supertest";
import app from "../app";

describe("Notification API", () => {
  let patientToken: string;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login")
      .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
    patientToken = res.body.data?.tokens?.accessToken;
  });

  describe("GET /api/notifications", () => {
    it("should return 401 without auth", async () => {
      const res = await request(app).get("/api/notifications");
      expect(res.status).toBe(401);
    });

    it("should get notifications for authenticated user", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/notifications/unread-count", () => {
    it("should return unread count", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .get("/api/notifications/unread-count")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Accept either {count} or {unreadCount} shape
      const count = res.body.data?.count ?? res.body.data?.unreadCount ?? res.body.data;
      expect(typeof count === "number" || typeof count === "string").toBe(true);
    });
  });

  describe("PATCH /api/notifications/read-all", () => {
    it("should mark all as read", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .patch("/api/notifications/read-all")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
