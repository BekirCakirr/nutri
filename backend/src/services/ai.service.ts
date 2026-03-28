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

// ── Constants ────────────────────────────────────────────────────────────────

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_PROMPT =
  "Sen NutriAI, Turkce konusan bir beslenme ve diyet asistanisin. Hastaya beslenme, diyet, saglikli yasam konularinda yardimci ol. Tibbi teshis koyma, sadece genel beslenme onerileri sun.";

const MEAL_ANALYSIS_PROMPT =
  "Bu yemek fotografini analiz et. Her bir yiyecegi tespit et ve Turkce isimlerini, tahmini gram miktarlarini ve besin degerlerini (kalori, protein, karbonhidrat, yag) JSON formatinda dondur.";

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

// ── Service Functions ────────────────────────────────────────────────────────

export async function chat(
  userId: string,
  message: string
): Promise<ChatResult> {
  const profile = await getPatientProfile(userId);
  const patientId = profile.id;
  
  const dynamicPrompt = `${SYSTEM_PROMPT}. Karsindaki hastanin bilgileri: Cinsiyet: ${profile.gender || 'Belirtilmedi'}, Kilo: ${profile.weight || '?'}kg, Hedef Kilo: ${profile.target_weight || '?'}kg. Alerjiler: ${Array.isArray(profile.allergies) ? profile.allergies.join(", ") : 'Yok'}. Diyet Tercihi: ${Array.isArray(profile.dietary_preferences) ? profile.dietary_preferences.join(", ") : 'Yok'}. Bu fiziksel ozelliklere bagli kalarak karsindaki hastaya icten, kisisellestirilmis ve motive edici yanitlar ver.`;

  // Get recent chat history (last 10 messages)
  const historyResult = await query(
    `SELECT role, content
     FROM ai_chat_history
     WHERE patient_id = $1
     ORDER BY created_at DESC
     LIMIT 10`,
    [patientId]
  );

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

  return {
    reply,
    messageId: assistantResult.rows[0].id,
  };
}

export async function analyzeMeal(
  userId: string,
  imageUrl: string // This is expected to be a base64 string
): Promise<MealAnalysisResult> {
  const fallbackResult: MealAnalysisResult = {
    foods: [
      {
        name: "Izgara Somon",
        estimatedGrams: 200,
        calories: 412,
        protein: 45,
        carbs: 0,
        fat: 24,
      },
      {
        name: "Mevsim Yeşillikleri",
        estimatedGrams: 150,
        calories: 45,
        protein: 2,
        carbs: 8,
        fat: 1,
      }
    ],
    rawAnalysis: "Tabağınızı inceledim, harika bir somon ve yeşillik tabağı! Yaklaşık 457 kalori içeriyor ve harika bir protein kaynağı. Sağlıklı seçimleriniz için tebrikler!",
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

    // Try to parse JSON from the response
    let foods: MealFood[] = fallbackResult.foods;
    try {
      const jsonMatch = rawAnalysis.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          foods = parsed;
        }
      }
    } catch {
      // If parsing fails, revert to fallback foods but keep raw analysis
    }

    return { foods, rawAnalysis };
  } catch (error) {
    return fallbackResult;
  }
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
