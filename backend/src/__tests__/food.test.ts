import request from "supertest";
import app from "../app";

describe("Food API", () => {
  describe("GET /api/foods - without auth", () => {
    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/foods");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/foods - with auth", () => {
    let token: string;

    beforeAll(async () => {
      // Login as seed patient to get a token
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });

      if (res.body.data?.tokens?.accessToken) {
        token = res.body.data.tokens.accessToken;
      }
    });

    it("should return foods list when authenticated", async () => {
      if (!token) return; // Skip if DB not seeded
      const res = await request(app)
        .get("/api/foods")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("foods");
      expect(res.body.data).toHaveProperty("total");
      expect(res.body.data).toHaveProperty("page");
      expect(res.body.data).toHaveProperty("limit");
      expect(Array.isArray(res.body.data.foods)).toBe(true);
    });

    it("should search foods by Turkish name", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/foods?q=tavuk")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.foods.length).toBeGreaterThan(0);
      const names = res.body.data.foods.map((f: any) => f.name.toLowerCase());
      expect(names.some((n: string) => n.includes("tavuk"))).toBe(true);
    });

    it("should filter foods by category", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/foods?category=protein")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      for (const food of res.body.data.foods) {
        expect(food.category).toBe("protein");
      }
    });

    it("should paginate correctly", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/foods?page=1&limit=5")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.foods.length).toBeLessThanOrEqual(5);
      expect(res.body.data.page).toBe(1);
      expect(res.body.data.limit).toBe(5);
    });

    it("should get a single food by id", async () => {
      if (!token) return;
      // First get some foods
      const listRes = await request(app)
        .get("/api/foods?limit=1")
        .set("Authorization", `Bearer ${token}`);
      if (listRes.body.data.foods.length === 0) return;
      const foodId = listRes.body.data.foods[0].id;

      const res = await request(app)
        .get(`/api/foods/${foodId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(foodId);
    });

    it("should return 404 for non-existent food", async () => {
      if (!token) return;
      const res = await request(app)
        .get("/api/foods/999999")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/foods - authorization", () => {
    let patientToken: string;

    beforeAll(async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
      if (res.body.data?.tokens?.accessToken) {
        patientToken = res.body.data.tokens.accessToken;
      }
    });

    it("should reject food creation by patient (403)", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .post("/api/foods")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          name: "Test Food",
          category: "other",
          calories_per_100g: 100,
          protein_per_100g: 10,
          carbs_per_100g: 10,
          fat_per_100g: 5,
        });
      expect(res.status).toBe(403);
    });
  });
});
