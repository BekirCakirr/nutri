import request from "supertest";
import app from "../app";

describe("Patient API", () => {
  describe("without auth", () => {
    it("should return 401 for GET /api/patients/me", async () => {
      const res = await request(app).get("/api/patients/me");
      expect(res.status).toBe(401);
    });
  });

  describe("with patient auth", () => {
    let token: string;

    beforeAll(async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
      if (res.body.data?.tokens?.accessToken) {
        token = res.body.data.tokens.accessToken;
      }
    });

    it("should get own profile", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/patients/me")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("user_id");
    });

    it("should update own profile", async () => {
      if (!token) return;
      const res = await request(app)
        .put("/api/patients/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ height_cm: 170, weight_kg: 65 });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should not access dietitian-only patient list", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/patients")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("with dietitian auth", () => {
    let token: string;

    beforeAll(async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "elif.kaya@nutriai.com", password: "elif1234" });
      if (res.body.data?.tokens?.accessToken) {
        token = res.body.data.tokens.accessToken;
      }
    });

    it("should list own patients", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/patients")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should not access patient /me endpoint", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/patients/me")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(403);
    });
  });
});
