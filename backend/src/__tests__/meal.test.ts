import request from "supertest";
import app from "../app";

describe("Meal API", () => {
  describe("without auth", () => {
    it("should return 401 for GET /api/meals/today", async () => {
      const res = await request(app).get("/api/meals/today");
      expect(res.status).toBe(401);
    });

    it("should return 401 for POST /api/meals", async () => {
      const res = await request(app).post("/api/meals").send({});
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

    it("should return today meals", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/meals/today")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return meal history with date range", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/meals/history?startDate=2026-01-01&endDate=2026-12-31")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should create a meal with items", async () => {
      if (!token) return;
      // Get a food to use
      const foodRes = await request(app)
        .get("/api/foods?limit=1")
        .set("Authorization", `Bearer ${token}`);
      if (!foodRes.body.data?.foods?.length) return;
      const foodId = foodRes.body.data.foods[0].id;

      const res = await request(app)
        .post("/api/meals")
        .set("Authorization", `Bearer ${token}`)
        .send({
          mealType: "breakfast",
          logDate: "2026-03-05",
          items: [{ foodId, amount: 150 }],
          entryMethod: "manual",
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("total_calories");
      expect(parseFloat(res.body.data.total_calories)).toBeGreaterThan(0);
    });

    it("should reject meal with invalid mealType", async () => {
      if (!token) return;
      const res = await request(app)
        .post("/api/meals")
        .set("Authorization", `Bearer ${token}`)
        .send({
          mealType: "brunch",
          logDate: "2026-03-05",
          items: [{ foodId: 1, amount: 100 }],
          entryMethod: "manual",
        });
      expect(res.status).toBe(422);
    });

    it("should reject meal with empty items", async () => {
      if (!token) return;
      const res = await request(app)
        .post("/api/meals")
        .set("Authorization", `Bearer ${token}`)
        .send({
          mealType: "lunch",
          logDate: "2026-03-05",
          items: [],
          entryMethod: "manual",
        });
      expect(res.status).toBe(422);
    });

    it("should get a meal by id", async () => {
      if (!token) return;
      const todayRes = await request(app)
        .get("/api/meals/today")
        .set("Authorization", `Bearer ${token}`);
      if (!todayRes.body.data?.length) return;
      const mealId = todayRes.body.data[0].id;

      const res = await request(app)
        .get(`/api/meals/${mealId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(mealId);
    });

    it("should delete a meal", async () => {
      if (!token) return;
      // Create a meal to delete
      const foodRes = await request(app)
        .get("/api/foods?limit=1")
        .set("Authorization", `Bearer ${token}`);
      if (!foodRes.body.data?.foods?.length) return;

      const createRes = await request(app)
        .post("/api/meals")
        .set("Authorization", `Bearer ${token}`)
        .send({
          mealType: "dinner",
          logDate: "2026-03-05",
          items: [{ foodId: foodRes.body.data.foods[0].id, amount: 100 }],
          entryMethod: "manual",
        });
      if (createRes.status !== 201) return;

      const res = await request(app)
        .delete(`/api/meals/${createRes.body.data.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("authorization", () => {
    let dietitianToken: string;

    beforeAll(async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "elif.kaya@nutriai.com", password: "elif1234" });
      if (res.body.data?.tokens?.accessToken) {
        dietitianToken = res.body.data.tokens.accessToken;
      }
    });

    it("should reject meal creation by dietitian (403)", async () => {
      if (!dietitianToken) return;
      const res = await request(app)
        .post("/api/meals")
        .set("Authorization", `Bearer ${dietitianToken}`)
        .send({
          mealType: "lunch",
          logDate: "2026-03-05",
          items: [{ foodId: 1, amount: 100 }],
          entryMethod: "manual",
        });
      expect(res.status).toBe(403);
    });
  });
});
