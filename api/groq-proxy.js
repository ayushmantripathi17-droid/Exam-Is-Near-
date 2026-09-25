// api/groq-proxy.js — ported from exports.groqProxy in functions/index.js
// Env vars: GROQ_API_KEY, GEMINI_API_KEY, FIREBASE_SERVICE_ACCOUNT, ALLOWED_ORIGINS
//
// Same caveat as before: this in-memory rate limiter resets on cold start
// and isn't shared across instances. Matches the original Cloud Function's
// behavior exactly (it had the same limitation) — fine pre-10k-users.

const { handleCORS } = require("./_lib/cors");
const { verifyToken } = require("./_lib/auth");

const ALLOWED_GROQ_MODELS = new Set(["openai/gpt-oss-20b", "openai/gpt-oss-120b"]);
const GEMINI_FALLBACK_MODEL = "gemini-flash-lite-latest";

const _rateLimiter = new Map();
const RATE_LIMIT = 60;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(uid) {
  const now = Date.now();
  const entry = _rateLimiter.get(uid) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_WINDOW) {
    _rateLimiter.set(uid, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  _rateLimiter.set(uid, entry);
  return true;
}

module.exports = async (req, res) => {
  if (handleCORS(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const decoded = await verifyToken(req, res);
  if (!decoded) return;

  if (!checkRateLimit(decoded.uid)) {
    res.status(429).json({ error: "Too many requests. Please slow down." });
    return;
  }

  const body = req.body || {};
  if (!Array.isArray(body.messages) || !body.messages.length) {
    res.status(400).json({ error: "Invalid request: messages array required" });
    return;
  }

  const sanitizedMessages = body.messages
    .filter((m) => m && typeof m.role === "string" && typeof m.content === "string")
    .map((m) => ({
      role: ["system", "user", "assistant"].includes(m.role) ? m.role : "user",
      content: String(m.content).slice(0, 16000),
    }));

  if (!sanitizedMessages.length) {
    res.status(400).json({ error: "No valid messages after sanitization" });
    return;
  }

  const model = ALLOWED_GROQ_MODELS.has(body.model) ? body.model : "openai/gpt-oss-20b";
  const maxTokens = Math.min(typeof body.max_tokens === "number" ? body.max_tokens : 800, 6000);
  const temperature = typeof body.temperature === "number" ? Math.min(Math.max(body.temperature, 0), 1) : 0.7;

  // Primary: Groq
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({ model, max_tokens: maxTokens, messages: sanitizedMessages, temperature }),
      });
      if (groqRes.ok) {
        const data = await groqRes.json();
        res.status(200).json(data);
        return;
      }
      console.warn("[groqProxy] Groq error, falling back to Gemini:", groqRes.status);
    } catch (err) {
      console.warn("[groqProxy] Groq fetch error, falling back to Gemini:", err.message);
    }
  } else {
    console.warn("[groqProxy] GROQ_API_KEY empty, going straight to Gemini");
  }

  // Fallback: Gemini, reshaped into the OpenAI-style contract
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    res.status(500).json({ error: "AI service not configured" });
    return;
  }

  try {
    const systemText = sanitizedMessages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");
    const contents = sanitizedMessages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

    if (!contents.length) {
      res.status(400).json({ error: "No valid messages after sanitization" });
      return;
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_FALLBACK_MODEL}:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          ...(systemText ? { systemInstruction: { parts: [{ text: systemText }] } } : {}),
          generationConfig: { maxOutputTokens: maxTokens, temperature },
        }),
      }
    );
    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("[groqProxy] Gemini error:", geminiRes.status, data?.error?.message);
      res.status(geminiRes.status).json({ error: data?.error?.message || "Gemini error" });
      return;
    }

    const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");

    res.status(200).json({
      id: data.responseId || "gemini-" + Date.now(),
      model: GEMINI_FALLBACK_MODEL,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: text },
          finish_reason: data.candidates?.[0]?.finishReason === "MAX_TOKENS" ? "length" : "stop",
        },
      ],
      usage: {
        prompt_tokens: data.usageMetadata?.promptTokenCount,
        completion_tokens: data.usageMetadata?.candidatesTokenCount,
        total_tokens: data.usageMetadata?.totalTokenCount,
      },
    });
  } catch (err) {
    console.error("[groqProxy] Gemini fetch error:", err.message);
    res.status(500).json({ error: "Proxy network error" });
  }
};
