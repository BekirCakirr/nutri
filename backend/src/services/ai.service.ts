import { query } from "../config";
import { env } from "../config";

// ── Types ────────────────────────────────────────────────────────────────────

interface ChatResult {
  reply: string;
  messageId: string;
}

interface MealFood {
  name: string;
  estimatedGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealAnalysisResult {
  foods: MealFood[];
  rawAnalysis: string;
}

interface PlanGenerateInput {
  patientId?: string;
  dailyCalorieTarget?: number;
  goal?: string;
  dietaryPreferences?: string[];
  allergies?: string[];
  durationDays?: number;
  notes?: string;
}

interface GeneratedPlanItem {
  dayOfWeek: number;
  mealType: string;
  foodName: string;
  amountG: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sortOrder: number;
}

interface PlanGenerateResult {
  items: GeneratedPlanItem[];
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbTarget: number;
  dailyFatTarget: number;
  title: string;
  rawAnalysis: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

const SYSTEM_PROMPT =
  "Sen NutriAI, Turkce konusan bir beslenme ve diyet asistanisin. Hastaya beslenme, diyet, saglikli yasam konularinda yardimci ol. Tibbi teshis koyma, sadece genel beslenme onerileri sun.";

const MEAL_ANALYSIS_PROMPT = `Bu yemek fotografini analiz et. Tabakta gordugun her yiyecegi (en fazla 5 tane) Turkce ismiyle tespit et.
SADECE asagidaki JSON formatinda yanit ver, baska aciklama yazma:
[
  {"name":"Yiyecek adi (Turkce)","estimatedGrams":<sayi>,"calories":<sayi>,"protein":<sayi>,"carbs":<sayi>,"fat":<sayi>}
]
Her sayi pozitif bir tam sayi olmali. Eger yemek tanimlanamazsa bos array [] dondur.`;

const MEAL_TYPES = ["breakfast", "morning_snack", "lunch", "afternoon_snack", "dinner"] as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getPatientProfile(userId: string): Promise<any> {
  const result = await query(
    "SELECT * FROM patient_profiles WHERE user_id = $1",
    [userId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Hasta profili bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0];
}

async function getDietitianProfile(userId: string): Promise<any> {
  const result = await query(
    "SELECT * FROM dietitian_profiles WHERE user_id = $1",
    [userId]
  );
  return result.rows[0] ?? null;
}

async function getUserRole(userId: string): Promise<string | null> {
  const result = await query("SELECT role FROM users WHERE id = $1", [userId]);
  return result.rows[0]?.role ?? null;
}

// ── Service Functions ────────────────────────────────────────────────────────

export async function chat(
  userId: string,
  message: string
): Promise<ChatResult> {
  const role = await getUserRole(userId);
  const isDietitian = role === "dietitian";
  let patientId: string | null = null;
  let dynamicPrompt: string;

  if (isDietitian) {
    const dietitian = await getDietitianProfile(userId);
    if (!dietitian) {
      throw Object.assign(new Error("Diyetisyen profili bulunamadi"), {
        statusCode: 404,
      });
    }
    dynamicPrompt = `Sen NutriAI, profesyonel bir diyetisyen asistanisin. Karsindaki kullanici bir DIYETISYEN (Dr. ${dietitian.first_name || ""} ${dietitian.last_name || ""}). Diyetisyene; hasta yonetimi, diyet plani olusturma, besin analizi, hasta raporu ozetleme ve klinik beslenme onerileri konularinda yardim et. Profesyonel, oz ve uygulanabilir yanitlar ver.`;
  } else {
    const profile = await getPatientProfile(userId);
    patientId = profile.id;
    dynamicPrompt = `${SYSTEM_PROMPT}. Karsindaki hastanin bilgileri: Cinsiyet: ${profile.gender || 'Belirtilmedi'}, Kilo: ${profile.weight || '?'}kg, Hedef Kilo: ${profile.target_weight || '?'}kg. Alerjiler: ${Array.isArray(profile.allergies) ? profile.allergies.join(", ") : 'Yok'}. Diyet Tercihi: ${Array.isArray(profile.dietary_preferences) ? profile.dietary_preferences.join(", ") : 'Yok'}. Bu fiziksel ozelliklere bagli kalarak karsindaki hastaya icten, kisisellestirilmis ve motive edici yanitlar ver.`;
  }

  // Get recent chat history (last 10 messages) — only for patients (table is keyed by patient_id)
  const historyResult = patientId
    ? await query(
        `SELECT role, content
         FROM ai_chat_history
         WHERE patient_id = $1
         ORDER BY created_at DESC
         LIMIT 10`,
        [patientId]
      )
    : { rows: [] as Array<{ role: string; content: string }> };

  const recentHistory = historyResult.rows.reverse();

  // Build messages array for Gemini API
  const contents = recentHistory.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  // Add current user message
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  let reply: string;
  const fallbackReply = "Şu anda biraz yoğunluk yaşıyorum, ancak bu süreçte su içmeyi ihmal etme! Sana harika bir yeşil salata öneriyorum, kalorisi çok düşük! Başka sorun olursa daha sonra tekrar sorabilirsin.";

  if (!env.geminiApiKey) {
    reply = fallbackReply;
  } else {
    try {
      const response = await fetch(`${GEMINI_URL}?key=${env.geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: dynamicPrompt }],
          },
          contents,
        }),
      });

      if (!response.ok) {
        reply = fallbackReply;
      } else {
        const data = (await response.json()) as any;
        reply =
          data.candidates?.[0]?.content?.parts?.[0]?.text || fallbackReply;
      }
    } catch (e) {
      reply = fallbackReply;
    }
  }

  let messageId = "stateless-" + Date.now();
  if (patientId) {
    // Save user message
    await query(
      `INSERT INTO ai_chat_history (patient_id, role, content)
       VALUES ($1, 'user', $2)`,
      [patientId, message]
    );

    // Save assistant response
    const assistantResult = await query(
      `INSERT INTO ai_chat_history (patient_id, role, content)
       VALUES ($1, 'assistant', $2)
       RETURNING id`,
      [patientId, reply]
    );
    messageId = assistantResult.rows[0].id;
  }

  return {
    reply,
    messageId,
  };
}

export async function analyzeMeal(
  userId: string,
  imageUrl: string // This is expected to be a base64 string
): Promise<MealAnalysisResult> {
  // Empty fallback — frontend will show "tespit edilemedi" error and prompt user to retry.
  // No hardcoded "Izgara Somon" garbage that confuses users when Gemini fails.
  const fallbackResult: MealAnalysisResult = {
    foods: [],
    rawAnalysis: "AI yemek tespiti yapamadı. Lütfen daha net bir fotoğraf çekin veya birkaç saniye sonra tekrar deneyin.",
  };

  if (!env.geminiApiKey) {
    return fallbackResult;
  }

  try {
    const response = await fetch(`${GEMINI_URL}?key=${env.geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: MEAL_ANALYSIS_PROMPT },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: imageUrl.replace(/^data:image\/\w+;base64,/, ""), // ensure raw base64
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallbackResult;
    }

    const data = (await response.json()) as any;
    const rawAnalysis =
      data.candidates?.[0]?.content?.parts?.[0]?.text || fallbackResult.rawAnalysis;

    // Try to parse JSON from the response — Gemini sometimes wraps with ```json or extra text
    let foods: MealFood[] = fallbackResult.foods;
    try {
      // Strip markdown code fences if present, then find JSON array
      const cleaned = rawAnalysis
        .replace(/```json\s*/gi, "")
        .replace(/```\s*$/gm, "")
        .trim();
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize each food: tolerate alternative field names from Gemini
          const normalized: MealFood[] = parsed
            .map((p: any) => {
              const name =
                p?.name || p?.food || p?.foodName || p?.isim || p?.yemek || "";
              const grams = Number(
                p?.estimatedGrams ?? p?.weight_g ?? p?.weight ?? p?.miktar ?? p?.gram ?? 100
              );
              const calories = Number(p?.calories ?? p?.kalori ?? p?.kcal ?? 0);
              const protein = Number(p?.protein ?? p?.protein_g ?? 0);
              const carbs = Number(p?.carbs ?? p?.carbohydrates ?? p?.karbonhidrat ?? 0);
              const fat = Number(p?.fat ?? p?.yag ?? 0);
              return {
                name: String(name).trim() || "Bilinmeyen Besin",
                estimatedGrams: isFinite(grams) && grams > 0 ? grams : 100,
                calories: isFinite(calories) ? calories : 0,
                protein: isFinite(protein) ? protein : 0,
                carbs: isFinite(carbs) ? carbs : 0,
                fat: isFinite(fat) ? fat : 0,
              };
            })
            // Drop items where the name is missing AND no calories were detected
            .filter((f: MealFood) => f.name && f.name !== "Bilinmeyen Besin" || f.calories > 0)
            .slice(0, 8);
          if (normalized.length > 0) {
            foods = normalized;
          }
        }
      }
    } catch {
      // If parsing fails, keep fallback foods (Sandwich/Salmon defaults)
    }

    return { foods, rawAnalysis };
  } catch (error) {
    return fallbackResult;
  }
}

export async function generatePlan(
  userId: string,
  input: PlanGenerateInput
): Promise<PlanGenerateResult> {
  // Optional patient enrichment (dietitian provides patientId; patient generates for self)
  let patientCtx: { goal?: string; allergies?: string[]; preferences?: string[]; weightKg?: number; targetKg?: number; gender?: string; height?: number; dailyCalorie?: number } = {};
  if (input.patientId) {
    const r = await query(
      `SELECT goal_type, current_weight_kg, target_weight_kg, gender, height_cm, daily_calorie_target,
              diet_type, cuisine_preferences, disliked_foods
       FROM patient_profiles WHERE id = $1`,
      [input.patientId]
    );
    if (r.rows[0]) {
      const p = r.rows[0];
      const prefs: string[] = [];
      if (p.diet_type && p.diet_type !== "normal") prefs.push(p.diet_type);
      if (Array.isArray(p.cuisine_preferences)) prefs.push(...p.cuisine_preferences);
      patientCtx = {
        goal: p.goal_type,
        allergies: [],
        preferences: prefs,
        weightKg: p.current_weight_kg ? Number(p.current_weight_kg) : undefined,
        targetKg: p.target_weight_kg ? Number(p.target_weight_kg) : undefined,
        gender: p.gender,
        height: p.height_cm ? Number(p.height_cm) : undefined,
        dailyCalorie: p.daily_calorie_target ? Number(p.daily_calorie_target) : undefined,
      };
      // Fetch allergens via join
      try {
        const aRes = await query(
          `SELECT a.name FROM patient_allergies pa JOIN allergens a ON a.id = pa.allergen_id WHERE pa.patient_id = $1`,
          [input.patientId]
        );
        patientCtx.allergies = aRes.rows.map((row: any) => row.name).filter(Boolean);
      } catch {
        patientCtx.allergies = [];
      }
    }
  }

  const dailyCalories = input.dailyCalorieTarget ?? patientCtx.dailyCalorie ?? 2000;
  const goal = input.goal ?? patientCtx.goal ?? "maintenance";
  const allergies = (input.allergies && input.allergies.length > 0 ? input.allergies : patientCtx.allergies) ?? [];
  const preferences = (input.dietaryPreferences && input.dietaryPreferences.length > 0 ? input.dietaryPreferences : patientCtx.preferences) ?? [];
  const notes = input.notes ?? "";

  const dailyProtein = Math.round((dailyCalories * 0.25) / 4);
  const dailyCarb = Math.round((dailyCalories * 0.45) / 4);
  const dailyFat = Math.round((dailyCalories * 0.30) / 9);

  const prompt = `Sen profesyonel bir Türk diyetisyen asistanısın. 7 günlük (Pazartesi=1 ... Pazar=7) bir beslenme planı oluştur.
Hasta bilgileri:
- Hedef: ${goal === "weight_loss" ? "Kilo Verme" : goal === "weight_gain" ? "Kilo Alma" : goal === "muscle_gain" ? "Kas Kazanımı" : "Kilo Koruma"}
- Günlük kalori hedefi: ${dailyCalories} kcal
- Alerji/kaçınılacak: ${allergies.join(", ") || "yok"}
- Diyet tercihi: ${preferences.join(", ") || "yok"}
${patientCtx.weightKg ? `- Mevcut kilo: ${patientCtx.weightKg} kg, hedef: ${patientCtx.targetKg ?? "?"} kg` : ""}
${notes ? `- Diyetisyen notu: ${notes}` : ""}

Her gün için 5 öğün üret: kahvaltı (breakfast), kuşluk (morning_snack), öğle (lunch), ikindi (afternoon_snack), akşam (dinner).
Her öğün 1-3 yiyecek içersin. Türk mutfağına uygun, taze, ulaşılabilir besinler kullan. Her gün farklı çeşitlilik olsun.

SADECE aşağıdaki JSON formatında, başka açıklama YAZMA:
{
  "items": [
    {"dayOfWeek": 1, "mealType": "breakfast", "foodName": "Menemen", "amountG": 200, "calories": 280, "protein": 16, "carbs": 10, "fat": 18, "sortOrder": 0},
    ...
  ]
}

Toplam 7 gün × 5 öğün = en az 35 satır. Her satırda dayOfWeek (1-7), mealType (yukarıdaki 5'ten biri), foodName Türkçe, amountG/calories/protein/carbs/fat sayı (gram), sortOrder 0'dan başlayan integer. Her günün toplam kalorisi yaklaşık ${dailyCalories} kcal olmalı.`;

  const fallbackTitle = `${goal === "weight_loss" ? "Kilo Verme Programı" : goal === "weight_gain" ? "Kilo Alma Programı" : goal === "muscle_gain" ? "Kas Geliştirme Programı" : "Beslenme Programı"} - Hafta 1`;

  const fallbackItems: GeneratedPlanItem[] = [];
  // Build a lightweight 7-day fallback if Gemini fails
  const fallbackTemplates: Record<string, Array<Omit<GeneratedPlanItem, "dayOfWeek" | "sortOrder">>> = {
    breakfast: [
      { mealType: "breakfast", foodName: "Yulaf ezmesi + muz + ceviz", amountG: 200, calories: 380, protein: 12, carbs: 55, fat: 12 },
      { mealType: "breakfast", foodName: "Menemen + tam buğday ekmek", amountG: 250, calories: 420, protein: 22, carbs: 28, fat: 22 },
      { mealType: "breakfast", foodName: "Peynirli omlet + zeytin + domates", amountG: 220, calories: 400, protein: 24, carbs: 8, fat: 28 },
    ],
    morning_snack: [
      { mealType: "morning_snack", foodName: "Yoğurt + meyve", amountG: 250, calories: 180, protein: 10, carbs: 22, fat: 5 },
      { mealType: "morning_snack", foodName: "Badem (15 adet)", amountG: 20, calories: 120, protein: 4, carbs: 4, fat: 10 },
    ],
    lunch: [
      { mealType: "lunch", foodName: "Izgara tavuk + bulgur + salata", amountG: 350, calories: 550, protein: 40, carbs: 45, fat: 18 },
      { mealType: "lunch", foodName: "Mercimek çorbası + köfte + pilav", amountG: 400, calories: 580, protein: 35, carbs: 55, fat: 18 },
      { mealType: "lunch", foodName: "Fırın somon + sebzeli pilav", amountG: 350, calories: 540, protein: 38, carbs: 42, fat: 20 },
    ],
    afternoon_snack: [
      { mealType: "afternoon_snack", foodName: "Elma + fıstık ezmesi", amountG: 165, calories: 200, protein: 5, carbs: 28, fat: 9 },
      { mealType: "afternoon_snack", foodName: "Süzme yoğurt + bal", amountG: 200, calories: 180, protein: 14, carbs: 18, fat: 5 },
    ],
    dinner: [
      { mealType: "dinner", foodName: "Sebzeli güveç + cacık", amountG: 400, calories: 420, protein: 18, carbs: 35, fat: 18 },
      { mealType: "dinner", foodName: "Etli yaprak sarması + yoğurt", amountG: 350, calories: 480, protein: 22, carbs: 28, fat: 28 },
      { mealType: "dinner", foodName: "Fırın levrek + brokoli + kinoa", amountG: 380, calories: 460, protein: 38, carbs: 30, fat: 18 },
    ],
  };
  for (let day = 1; day <= 7; day++) {
    let order = 0;
    for (const mt of MEAL_TYPES) {
      const tpl = fallbackTemplates[mt];
      const pick = tpl[(day + order) % tpl.length];
      fallbackItems.push({ dayOfWeek: day, sortOrder: order++, ...pick });
    }
  }

  if (!env.geminiApiKey) {
    return {
      items: fallbackItems,
      dailyCalorieTarget: dailyCalories,
      dailyProteinTarget: dailyProtein,
      dailyCarbTarget: dailyCarb,
      dailyFatTarget: dailyFat,
      title: fallbackTitle,
      rawAnalysis: "AI servis anahtarı yok, varsayılan plan oluşturuldu.",
    };
  }

  let items: GeneratedPlanItem[] = fallbackItems;
  let rawAnalysis = "AI ile haftalık plan oluşturuldu.";
  try {
    const response = await fetch(`${GEMINI_URL}?key=${env.geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
      }),
    });
    if (response.ok) {
      const data = (await response.json()) as any;
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      rawAnalysis = raw.slice(0, 200);
      try {
        const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*$/gm, "").trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.items) && parsed.items.length >= 7) {
            const normalized: GeneratedPlanItem[] = parsed.items
              .map((p: any, i: number) => {
                const dow = Number(p?.dayOfWeek ?? p?.day ?? 1);
                const mt = String(p?.mealType ?? p?.meal ?? "lunch").toLowerCase();
                const validMt = (MEAL_TYPES as readonly string[]).includes(mt) ? mt : "lunch";
                return {
                  dayOfWeek: dow >= 1 && dow <= 7 ? dow : 1,
                  mealType: validMt,
                  foodName: String(p?.foodName ?? p?.name ?? "Yemek").slice(0, 200),
                  amountG: Number(p?.amountG ?? p?.amount ?? p?.grams ?? 100) || 100,
                  calories: Number(p?.calories ?? 0) || 0,
                  protein: Number(p?.protein ?? 0) || 0,
                  carbs: Number(p?.carbs ?? p?.carbohydrates ?? 0) || 0,
                  fat: Number(p?.fat ?? 0) || 0,
                  sortOrder: Number(p?.sortOrder ?? i) || i,
                };
              })
              .filter((it: GeneratedPlanItem) => it.foodName && it.calories >= 0);
            if (normalized.length >= 7) {
              items = normalized;
            }
          }
        }
      } catch {
        // keep fallback
      }
    }
  } catch {
    // keep fallback
  }

  return {
    items,
    dailyCalorieTarget: dailyCalories,
    dailyProteinTarget: dailyProtein,
    dailyCarbTarget: dailyCarb,
    dailyFatTarget: dailyFat,
    title: fallbackTitle,
    rawAnalysis,
  };
}

export async function getChatHistory(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const profile = await getPatientProfile(userId);
  const patientId = profile.id;

  const offset = (page - 1) * limit;

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM ai_chat_history WHERE patient_id = $1`,
    [patientId]
  );
  const total = parseInt(countResult.rows[0].total, 10);

  const messagesResult = await query(
    `SELECT id, role, content, metadata, created_at
     FROM ai_chat_history
     WHERE patient_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [patientId, limit, offset]
  );

  return {
    messages: messagesResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
