const BASE = 'http://localhost:3001/api'

async function req(method, path, body, token) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }
  const r = await fetch(`${BASE}${path}`, opts)
  const json = await r.json().catch(() => ({}))
  console.log(`Debug ${method} ${path} -> ${r.status}`, Object.keys(json))
  return { status: r.status, data: json }
}

async function run() {
  const tryLogin = async (email, pass) => {
    const r = await req('POST', '/auth/login', { email, password: pass })
    if (r.status === 200 && r.data.data?.token) return r.data.data.token
    console.log(`Login error details:`, r.data)
    return null
  }

  let token = null
  const candidates = [
    ['elif.kaya@nutriai.com', 'elif1234'],
    ['admin@nutriai.com', 'admin123'],
    ['ayse.yilmaz@email.com', 'ayse1234'] // Seeded patient
  ]

  for (const [email, pass] of candidates) {
    token = await tryLogin(email, pass)
    if (token) { console.log(`\n✅ LOGIN OK: ${email}`); break }
    else console.log(`❌ Login fail: ${email}`)
  }

  if (!token) return process.exit(1)

  const endpoints = [
    ['GET', '/patients'],
    ['GET', '/appointments'],
    ['GET', '/messages/conversations'],
    ['GET', '/notifications'],
    ['GET', '/reports'],
    ['GET', '/recipes'],
    ['GET', '/shopping-lists'],
    ['GET', '/plans'],
  ]

  console.log('\n=== API ENDPOINT TESTS ===')
  for (const [method, path] of endpoints) {
    const r = await req(method, path, null, token)
    const count = Array.isArray(r.data?.data) ? r.data.data.length : (r.data?.data ? 'obj' : 'null')
    const icon = r.status === 200 ? '✅' : '❌'
    console.log(`${icon} ${method} ${path} → ${r.status} (${count} items)`)
  }
}

run()
