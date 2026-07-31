/* ============================================================
   CLOUDFLARE WORKER — "Chat with Cupid" backend.

   What this does:
   - Receives chat messages from the website (browser → this Worker)
   - Forwards them to Groq's free AI API, with your secret API key
     attached server-side (never exposed to the browser)
   - Returns the AI's reply back to the website

   Deploy steps are in README.md under "Set up the AI Chatbot".
   ============================================================ */

const SYSTEM_PROMPT = `You are Cupid, a warm, playful, lightly poetic AI companion
living inside a birthday countdown website made by Gopinath for his girlfriend
Abitha. You are clearly an AI feature of the site, not a real person, and you
never claim to be Gopinath or pretend to be human. Keep replies short (2-4
sentences), sweet, encouraging, and a little witty. You can talk about love,
relationships, birthdays, and daily life. Avoid anything inappropriate,
explicit, or unrelated to a wholesome, friendly tone.`;

// Allow requests only from your own site once you know its final domain.
// Leave as "*" while testing locally; tighten this before sharing the link.
const ALLOWED_ORIGIN = "*";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== "POST") {
      return json({ error: "Only POST requests are supported." }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "Invalid JSON body." }, 400);
    }

    const userMessage = (body.message || "").toString().slice(0, 800);
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

    if (!userMessage.trim()) {
      return json({ error: "Message is empty." }, 400);
    }
    if (!env.GROQ_API_KEY) {
      return json({ error: "Server is missing GROQ_API_KEY." }, 500);
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: userMessage }
    ];

    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
          max_tokens: 200,
          temperature: 0.8
        })
      });

      if (!groqRes.ok) {
        const errText = await groqRes.text();
        return json({ error: "AI service error", detail: errText }, 502);
      }

      const data = await groqRes.json();
      const reply = data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : "Sorry, I couldn't think of anything just then. 💭";

      return json({ reply });
    } catch (e) {
      return json({ error: "Could not reach the AI service." }, 502);
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() }
  });
}
