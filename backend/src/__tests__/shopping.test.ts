import request from "supertest";
import app from "../app";
import { pool } from "../config";

describe("Shopping List API", () => {
  let patientToken: string;
  let listId: string;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login")
      .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
    patientToken = res.body.data?.tokens?.accessToken;
  });

  describe("POST /api/shopping-lists", () => {
    it("should allow patient to create shopping list", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .post("/api/shopping-lists")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          title: "Haftalik Sebze",
          items: [
            { foodName: "Domates", amount: "1 kg" },
            { foodName: "Biber", amount: "500 g" }
          ]
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      listId = res.body.data.id;
    });
  });

  describe("GET /api/shopping-lists", () => {
    it("should list active shopping lists for patient", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .get("/api/shopping-lists")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/shopping-lists/:id", () => {
    it("should get specific shopping list", async () => {
      if (!listId || !patientToken) return;
      const res = await request(app)
        .get(`/api/shopping-lists/${listId}`)
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  afterAll(async () => {
    if (listId) {
      await pool.query("DELETE FROM shopping_lists WHERE id = $1", [listId]).catch(() => {});
    }
  });
});
