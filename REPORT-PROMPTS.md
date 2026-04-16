# NutriAI — Rapor Gorselleri Icin Promptlar

> Bu dosyadaki promptlari Gemini veya ChatGPT'ye vererek diyagramlari olustur.
> Uygulama ekran goruntuleri icin: mobili ve webi ac, ilgili ekrani goster, ekran goruntusu al.

---

## MIMARI DIYAGRAMLAR (AI ile olusturulacak)

### Prompt 1: Three-Tier System Architecture (Figure 3.1)

```
Create a clean, professional system architecture diagram for "NutriAI" - a nutrition tracking platform.

The diagram should show three tiers:

TOP TIER (Clients):
- Mobile App icon (labeled "Patient Mobile App - React Native / Expo")
- Web Panel icon (labeled "Dietitian Web Panel - React / Vite / Tailwind CSS")
- Admin Panel icon (labeled "Admin Panel - React")

MIDDLE TIER (Server):
- Large box labeled "Backend API Server"
  - Inside: "Node.js + Express.js + TypeScript"
  - Sub-boxes: "REST API (101 endpoints)", "Socket.io (Real-time)", "JWT Auth + RBAC"
  
RIGHT SIDE (External):
- Cloud icon labeled "Google Gemini 2.0 Flash API"
  - Sub-label: "Food Photo Analysis + AI Chat"

BOTTOM TIER (Data):
- Database cylinder labeled "PostgreSQL 16"
  - Sub-label: "37 Tables / 564 Columns"
- Container icon labeled "Docker"

ARROWS:
- Mobile → Backend: "HTTPS + WebSocket"
- Web → Backend: "HTTPS + WebSocket"
- Backend → PostgreSQL: "SQL Queries (pg)"
- Backend → Gemini: "REST API (Vision + Chat)"
- Backend ↔ Mobile/Web: bidirectional "Socket.io"

COLOR SCHEME: Use forest green (#1A5C37) as primary color, white backgrounds, light green (#E8F5EC) for boxes.
STYLE: Clean, minimal, professional. No 3D effects. Suitable for an academic paper.
```

### Prompt 2: Entity-Relationship Diagram (Figure 3.3)

```
Create an Entity-Relationship (ER) diagram for the NutriAI database. Show the following entities with their key attributes and relationships:

CORE ENTITIES (Blue):
- users (id, email, role, is_active)
- patient_profiles (49 columns - show key ones: birth_date, gender, height_cm, current_weight_kg, target_weight_kg, daily_calorie_target, xp_points, level)
- dietitian_profiles (27 columns - show key ones: license_number, specializations, invite_code, is_approved, rating_avg)

NUTRITION (Green):
- foods (id, name, calories_per_100g, protein, carbs, fat - 23 columns total)
- meal_logs (id, patient_id, meal_type, total_calories - 34 columns total)
- meal_items (food_id, meal_log_id, amount)
- meal_plans (patient_id, dietitian_id, status, title)
- meal_plan_items (day_of_week, meal_type, food_name)

COMMUNICATION (Orange):
- conversations (id)
- messages (sender_id, receiver_id, content)
- appointments (dietitian_id, patient_id, date, type, status)
- notifications (user_id, type, title)

GAMIFICATION (Purple):
- badges (name, category, xp_reward)
- patient_badges (patient_id, badge_id)
- weekly_challenges (title, target_value)
- xp_history (patient_id, xp_amount, reason)

TRACKING (Teal):
- weight_logs, water_logs, exercise_logs, sleep_logs
- progress_photos
- allergens, patient_allergies

RELATIONSHIPS:
- users 1:1 patient_profiles
- users 1:1 dietitian_profiles
- dietitian_profiles 1:N dietitian_patients N:1 patient_profiles
- patient_profiles 1:N meal_logs
- meal_logs 1:N meal_items
- meal_items N:1 foods
- patient_profiles 1:N meal_plans
- meal_plans 1:N meal_plan_items
- patient_profiles 1:N weight_logs, water_logs, exercise_logs, sleep_logs
- patient_profiles 1:N patient_badges N:1 badges

Total: 37 tables, 564 columns, 38 foreign keys
Style: Clean ER notation, color-coded by domain, readable text, academic quality.
```

### Prompt 3: JWT Authentication Flow (Figure 3.4)

```
Create a sequence diagram showing the JWT authentication flow for NutriAI:

ACTORS: Client (Mobile/Web), API Server, Database

FLOW:
1. Client → API Server: POST /api/auth/login {email, password}
2. API Server → Database: SELECT user WHERE email = ?
3. Database → API Server: User record
4. API Server: bcrypt.compare(password, hash)
5. API Server: Generate Access Token (JWT, 15min expiry)
6. API Server: Generate Refresh Token (JWT, 7 days expiry)
7. API Server → Database: INSERT refresh_token
8. API Server → Client: {accessToken, refreshToken, user}

SUBSEQUENT REQUESTS:
9. Client → API Server: GET /api/meals (Authorization: Bearer <accessToken>)
10. API Server: jwt.verify(token) → extract userId, role
11. API Server: authorize(role) → check permissions
12. API Server → Database: Query data
13. API Server → Client: {success: true, data: [...]}

TOKEN REFRESH:
14. Client → API Server: POST /api/auth/refresh-token {refreshToken}
15. API Server: Verify refresh token
16. API Server: Generate new access token
17. API Server → Client: {accessToken: <new>}

Style: Clean UML sequence diagram, professional, readable.
```

### Prompt 4: Performance Metrics Dashboard (Figure 5.2)

```
Create a performance metrics dashboard for NutriAI system evaluation:

METRICS TO SHOW:
1. API Response Time: 45ms average (bar chart, green if <100ms)
2. Database Latency: 25ms average (gauge)
3. Backend Startup: <3 seconds (indicator)
4. Mobile Bundle: ~15MB (size indicator)
5. Web Build (gzipped): 110KB main + 124KB recharts (stacked bar)
6. DB Connection Pool: 20 max (utilization gauge)
7. WebSocket Ping: 25s interval
8. Endpoints: 101 total, 101 passing (100% success ring)
9. TypeScript: 0 errors across 3 codebases (green checkmarks)
10. Database: 37 tables, 564 columns, 41 indexes (stat cards)

COLOR SCHEME: Forest green (#1A5C37), white, light green
STYLE: Dashboard layout, clean cards, suitable for academic paper
```

---

## UYGULAMA EKRAN GORUNTULERI (Manuel alinacak)

### Mobilden Alinacak Ekran Goruntuleri:

| Figure | Ekran | Nasil Alinir |
|---|---|---|
| 4.1 | Welcome Screen | Uygulamayi ac, ilk ekran |
| 4.2 | Login Screen | "Giris Yap" tikla |
| 4.3 | Onboarding (3 ekran) | Kayit ol → BasicInfo + Goal + Allergy yan yana |
| 4.4 | Dietitian Code | Onboarding → DietitianCode ekrani |
| 4.5 | Dashboard | Ayse ile giris yap → ana sayfa |
| 4.6 | Meal Log | Ogunler tab → MealLog ekrani |
| 4.7 | Food Search | Ogun ekle → Yiyecek Ara → "tavuk" yaz |
| 4.8 | AI Photo (2 ekran) | Kamera tab → foto cek + analiz sonucu |
| 4.9 | AI Chat | AI Chat modal → bir soru sor |
| 4.10 | Diet Plan (2 ekran) | Ogunler → Plan → gun detayi |
| 4.11 | Messaging (2 ekran) | Mesajlar → konusma listesi + sohbet |
| 4.12 | Progress (3 ekran) | Ilerleme → Kilo + Su + Egzersiz |
| 4.13 | Gamification (2 ekran) | Rozetler + Gorevler modal |
| 4.14 | Profile (2 ekran) | Profil tab + Profil Duzenle |

### Webden Alinacak Ekran Goruntuleri:

| Figure | Ekran | Nasil Alinir |
|---|---|---|
| 4.15 | Login | http://localhost:5173 → login ekrani |
| 4.16 | Dashboard | elif.kaya ile giris → ana sayfa |
| 4.17 | Patient List + Detail | Hastalar → Ayse'ye tikla (yan yana) |
| 4.18 | Meal Review | Ogun Inceleme → kanban board |
| 4.19 | Plan Creator | Plan Olustur → drag-drop arayuzu |
| 4.20 | Messages | Mesajlar → bir konusma ac |
| 4.21 | AI Assistant | AI Asistan → bir soru sor |
| 4.22 | Appointments | Randevular ekrani |
| 4.23 | Admin Dashboard | admin ile giris → admin dashboard |
| 4.24 | Admin Food DB | Admin → Besin Veritabani |

### Terminalden Alinacak:

| Figure | Icerik | Nasil Alinir |
|---|---|---|
| 5.1 | API Health Check | `curl http://localhost:3001/api/health \| jq` terminalde calistir, ekran goruntusu al |

---

## EKRAN GORUNTUSU ALMA IPUCLARI

1. **Mobil:** Telefondan ekran goruntusu al (guc + ses kisma)
2. **Web:** Chrome → F12 → Device toolbar → responsive goruntum veya tam ekran
3. **Yan yana gosterim:** 2-3 ekran goruntusunu Canva veya PowerPoint'te yan yana koy
4. **Kalite:** PNG formatinda, minimum 1080px genislik
5. **Temiz veri:** Test hesaplariyla giris yap, gercekci veri gorunsun
6. **Dark mode KAPALI:** Tum goruntulerde light mode kullan
