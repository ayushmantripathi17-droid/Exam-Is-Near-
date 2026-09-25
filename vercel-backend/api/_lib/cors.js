// api/_lib/cors.js
// Same allowlist behavior as the original handleCORS() in functions/index.js.

const DEFAULT_ORIGINS = [
  "https://exam-is-near.web.app",
  "https://exam-is-near.firebaseapp.com",
  "http://localhost:5000",
  "http://localhost:3000",
];

function allowedOrigins() {
  return process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : DEFAULT_ORIGINS;
}

// Returns true if the request was an OPTIONS preflight (already responded to).
function handleCORS(req, res) {
  const origins = allowedOrigins();
  const origin = req.headers.origin || "";
  const allow = origins.includes(origin) ? origin : origins[0];

  res.setHeader("Access-Control-Allow-Origin", allow);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "3600");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = { handleCORS };
