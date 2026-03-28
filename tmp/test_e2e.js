const http = require('http');

function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('--- FINAL RE-TEST KATEGORI 2 & 3 ENDPOINTLERI ---');
  
  const dLogin = await request('/api/auth/login', 'POST', { email: 'elif.kaya@nutriai.com', password: 'elif1234' });
  const dToken = dLogin.data?.data?.tokens?.accessToken;

  const pLogin = await request('/api/auth/login', 'POST', { email: 'ayse.yilmaz@email.com', password: 'ayse1234' });
  const pToken = pLogin.data?.data?.tokens?.accessToken;
  const ayseId = pLogin.data?.data?.user?.id;

  // 1. Diyetisyen - Hasta Listesi (calisiyor)
  const patientsRes = await request('/api/patients', 'GET', null, dToken);
  console.log('Hasta Listesi (GET /api/patients, Diyetisyen):', patientsRes.status);
  
  // 5. Ogunleri Web'den Okuma (Diyetisyen), proper endpoint: /api/meals/history?patientId=...
  const getMealsD = await request(`/api/meals/history?patientId=${ayseId}`, 'GET', null, dToken);
  console.log('Ogunleri Oku (GET /api/meals/history?patientId, Diyetisyen):', getMealsD.status, `Adet: ${(getMealsD.data?.data?.items || []).length || (getMealsD.data?.data || []).length}`);
  
  // 6. Rapor Ozetleri (Diyetisyen) /api/reports/summary
  const getStats = await request('/api/reports/summary', 'GET', null, dToken);
  console.log('Meal Stats (GET /api/reports/summary, Diyetisyen):', getStats.status);
}

run().catch(console.error);
