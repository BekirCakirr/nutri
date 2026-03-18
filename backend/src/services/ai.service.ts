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

async function getPatientId(userId: string): Promise<string> {
  const result = await query(
    "SELECT id FROM patient_profiles WHERE user_id = $1",
    [userId]
  );

  if (result.rows.length === 0) {
    throw Object.assign(new Error("Hasta profili bulunamadi"), {
      statusCode: 404,
    });
  }

  return result.rows[0].id;
}

// ── Service Functions ────────────────────────────────────────────────────────

export async function chat(
  userId: string,
  message: string
): Promise<ChatResult> {
  const patientId = await getPatientId(userId);

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

  if (!env.geminiApiKey) {
    reply =
      "AI servisi su anda aktif degil. Lutfen daha sonra tekrar deneyin.";
  } else {
    const response = await fetch(`${GEMINI_URL}?key=${env.geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw Object.assign(
        new Error(`Gemini API hatasi: ${response.status} - ${errorBody}`),
        { statusCode: 502 }
      );
    }

    const data = (await response.json()) as any;
    reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Yanit alinamadi. Lutfen tekrar deneyin.";
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
  imageUrl: string
): Promise<MealAnalysisResult> {
  if (!env.geminiApiKey) {
    return {
      foods: [
        {
          name: "Analiz edilemedi",
          estimatedGrams: 0,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
      ],
      rawAnalysis:
        "AI servisi su anda aktif degil. Lutfen daha sonra tekrar deneyin.",
    };
  }

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
                data: imageUrl,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw Object.assign(
      new Error(`Gemini API hatasi: ${response.status} - ${errorBody}`),
      { statusCode: 502 }
    );
  }

  const data = (await response.json()) as any;
  const rawAnalysis =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Analiz sonucu alinamadi.";

  // Try to parse JSON from the response
  let foods: MealFood[] = [];
  try {
    const jsonMatch = rawAnalysis.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      foods = JSON.parse(jsonMatch[0]);
    }
  } catch {
    // If parsing fails, return empty foods array with raw analysis
  }

  return { foods, rawAnalysis };
}

export async function getChatHistory(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const patientId = await getPatientId(userId);

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
