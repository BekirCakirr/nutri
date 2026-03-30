import request from "supertest";
import app from "../app";
import { pool } from "../config";

describe("Recipe API", () => {
  let dietitianToken: string;
  let patientToken: string;
  let recipeId: string;

  beforeAll(async () => {
    // 1. Get Dietitian auth
    let res = await request(app).post("/api/auth/login")
      .send({ email: "elif.kaya@nutriai.com", password: "elif1234" });
    dietitianToken = res.body.data?.tokens?.accessToken;

    // 2. Get Patient auth
    res = await request(app).post("/api/auth/login")
      .send({ email: "ayse.yilmaz@email.com", password: "ayse1234" });
    patientToken = res.body.data?.tokens?.accessToken;
  });

  describe("POST /api/recipes", () => {
    it("should allow dietitian to create recipe", async () => {
      const res = await request(app)
        .post("/api/recipes")
        .set("Authorization", `Bearer ${dietitianToken}`)
        .send({
          name: "Test Omlet",
          description: "Protein deposu nefis omlet",
          difficulty: "easy",
          caloriesPerServing: 320,
          ingredients: [
            { foodId: 1, amount: 2, unit: "adet" }
          ],
          steps: [
            { stepNumber: 1, instruction: "Yumurtalari cirp." }
          ]
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      recipeId = res.body.data.id;
    });

    it("should forbid patient to create recipe", async () => {
      const res = await request(app)
        .post("/api/recipes")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({ name: "Patient Recipe" });
      
      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/recipes", () => {
    it("should list approved recipes for patient", async () => {
      const res = await request(app)
        .get("/api/recipes")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      
      // Patient might not see the unapproved test recipe
      const found = res.body.data.find((r: any) => r.id === recipeId);
      expect(found).toBeUndefined(); // Assuming default is_approved = false
    });
  });

  afterAll(async () => {
    // Delete test recipe
    if (recipeId) {
      await pool.query("DELETE FROM recipes WHERE id = $1", [recipeId]).catch(() => {});
    }
  });
});
