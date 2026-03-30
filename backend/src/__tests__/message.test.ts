import request from "supertest";
import app from "../app";
import { pool } from "../config";

describe("Message API", () => {
  let dietitianToken: string;
  let patientToken: string;
  let patientId: string;
  let dietitianId: string;
  let messageId: string;

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
    patientId = res.body.data?.user?.id;
  });

  describe("POST /api/messages", () => {
    it("should return 401 without auth", async () => {
      const res = await request(app).post("/api/messages").send({});
      expect(res.status).toBe(401);
    });

    it("should allow patient to send message to dietitian", async () => {
      const res = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          receiverId: dietitianId,
          content: "Merhaba Elif Hanim, bugun diyette ufak bir kacamak yaptim.",
          messageType: "text"
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      messageId = res.body.data.id;
    });

    it("should allow dietitian to reply", async () => {
      const res = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${dietitianToken}`)
        .send({
          receiverId: patientId,
          content: "Problem degil Ayse Hanim, yarin yuruyusu 15dk artiralim.",
          messageType: "text"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/messages/:userId", () => {
    it("should get conversation history between user and other user", async () => {
      const res = await request(app)
        .get(`/api/messages/${dietitianId}`)
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      
      const found = res.body.data.find((m: any) => m.id === messageId);
      expect(found).toBeDefined();
    });
  });

  afterAll(async () => {
    // Delete test messages
    if (patientId) {
      await pool.query("DELETE FROM messages WHERE sender_id = $1 OR receiver_id = $1", [patientId]).catch(() => {});
    }
  });
});
