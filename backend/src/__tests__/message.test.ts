import request from "supertest";
import app from "../app";

describe("Message API", () => {
  let dietitianToken: string;
  let patientToken: string;
  let patientId: string;
  let dietitianId: string;

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

  describe("POST /api/messages/send", () => {
    it("should return 401 without auth", async () => {
      const res = await request(app).post("/api/messages/send").send({});
      expect(res.status).toBe(401);
    });

    it("should allow patient to send message to dietitian", async () => {
      if (!patientToken || !dietitianId) return;
      const res = await request(app)
        .post("/api/messages/send")
        .set("Authorization", `Bearer ${patientToken}`)
        .send({
          receiverId: dietitianId,
          content: "Merhaba Elif Hanim, bugun diyette ufak bir kacamak yaptim.",
          messageType: "text"
        });
      
      // Accept 201 or 200
      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    });

    it("should allow dietitian to reply", async () => {
      if (!dietitianToken || !patientId) return;
      const res = await request(app)
        .post("/api/messages/send")
        .set("Authorization", `Bearer ${dietitianToken}`)
        .send({
          receiverId: patientId,
          content: "Problem degil Ayse Hanim, yarin yuruyusu 15dk artiralim.",
          messageType: "text"
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/messages/conversations", () => {
    it("should get conversations for patient", async () => {
      if (!patientToken) return;
      const res = await request(app)
        .get("/api/messages/conversations")
        .set("Authorization", `Bearer ${patientToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
