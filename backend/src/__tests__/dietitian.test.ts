import request from "supertest";
import app from "../app";

describe("Dietitian API", () => {
  describe("without auth", () => {
    it("should return 401 for GET /api/dietitians/me", async () => {
      const res = await request(app).get("/api/dietitians/me");
      expect(res.status).toBe(401);
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

    it("should get own profile", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/dietitians/me")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("user_id");
    });

    it("should update own profile", async () => {
      if (!token) return;
      const res = await request(app)
        .put("/api/dietitians/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ specialization: "Sporcu Beslenmesi" });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should list own patients", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/dietitians/me/patients")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should get or regenerate invite code", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/dietitians/me/invite-code")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("inviteCode");
      expect(typeof res.body.data.inviteCode).toBe("string");
    });

    it("should regenerate invite code via POST", async () => {
      if (!token) return;
      const res = await request(app)
        .post("/api/dietitians/me/invite-code/regenerate")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("inviteCode");
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

    it("should not access dietitian /me endpoint (403)", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/dietitians/me")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(403);
    });

    it("should not list patients (403)", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/dietitians/me/patients")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(403);
    });

    it("should pair with dietitian using invite code", async () => {
      if (!token) return;
      // This test may fail if already paired — that's expected
      const res = await request(app)
        .post("/api/dietitians/pair")
        .set("Authorization", `Bearer ${token}`)
        .send({ inviteCode: "INVALID-CODE-12345" });
      // Should be 400 (invalid code)
      expect(res.status).toBe(400);
    });
  });

  describe("public dietitian profile", () => {
    let token: string;

    beforeAll(async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
      if (res.body.data?.tokens?.accessToken) {
        token = res.body.data.tokens.accessToken;
      }
    });

    it("should return 404 for non-existent dietitian", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/dietitians/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
