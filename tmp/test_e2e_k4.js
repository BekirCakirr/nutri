const http = require('http');

const API_URL = 'http://localhost:3000';

function request(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

(async () => {
  try {
    console.log("--- E2E KATEGORI 4 TEST (Iletisim & AI) ---");

    // 1. Auth as Patient
    const pAuth = await request('/api/auth/login', 'POST', {
      email: 'ayse.yilmaz@email.com',
      password: 'ayse1234'
    });
    if (pAuth.status !== 200) throw new Error("Patient Auth failed: " + pAuth.body);
    const pLoginData = JSON.parse(pAuth.body).data;
    const pToken = pLoginData.tokens.accessToken;
    const ayseId = pLoginData.user.id;

    // 2. Auth as Dietitian
    const dAuth = await request('/api/auth/login', 'POST', {
      email: 'elif.kaya@nutriai.com',
      password: 'elif1234'
    });
    if (dAuth.status !== 200) throw new Error("Dietitian Auth failed: " + dAuth.body);
    const dToken = JSON.parse(dAuth.body).data.tokens.accessToken;

    console.log("Tokens acquired.");

    // TEST: Randevu (Appointment) Olusturma (Dietitian olusturur)
    const aptReq = await request('/api/appointments', 'POST', {
      patientId: ayseId,
      title: "Aylik Kontrol",
      date: "2026-04-15",
      startTime: "10:00",
      endTime: "10:30",
      type: "online",
      location: "Klinik",
      notes: ""
    }, dToken);
    console.log("Appointment Create (Dietitian):", aptReq.status, aptReq.body);

    // TEST: Mesajlasma (Message API)
    const getMsgs = await request(`/api/messages/conversations`, 'GET', null, dToken);
    console.log("Get Conversations (Dietitian):", getMsgs.status);
    
    // TEST: Gemini AI Asistan
    const aiChat = await request(`/api/ai/chat`, 'POST', {
      message: "Bugun 2000 kalori aldim, hedefim 1800. Ne yapmaliyim?"
    }, pToken);
    console.log("AI Chat (Patient):", aiChat.status);

    // TEST: Vision (Ogun Fotografi - URL mock)
    const aiVision = await request(`/api/ai/analyze-meal`, 'POST', {
      imageUrl: "https://example.com/mock-salad.jpg"
    }, pToken);
    console.log("AI Vision (Patient):", aiVision.status);
  } catch(e) { console.error(e.message); }
})();
