import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import { Readable } from "node:stream";

const app = express();
const port = Number.parseInt(process.env.PORT || "8792", 10);
const upstreamBaseUrl = process.env.UPSTREAM_BASE_URL || "https://www.tken.shop/v1";
const upstreamApiKey = process.env.UPSTREAM_API_KEY || "";
const localApiKey = process.env.LOCAL_API_KEY || "local-dev-key";
const routes = {
  "free-model": process.env.FREE_MODEL || "tken-free-model",
  "premium-gpt": process.env.PREMIUM_MODEL || "premium-gpt-model",
};

app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));
app.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "tken-railway-ai-gateway-template", upstreamBaseUrl, routes: Object.keys(routes) }));
app.get("/v1/models", (_req, res) => res.json({ object: "list", data: Object.keys(routes).map((id) => ({ id, object: "model", owned_by: "tken-railway-gateway" })) }));

app.post("/v1/chat/completions", async (req, res) => {
  if (localApiKey && req.headers.authorization !== `Bearer ${localApiKey}`) return res.status(401).json({ error: { message: "Unauthorized." } });
  const body = { ...req.body };
  const requestedModel = body.model || "free-model";
  body.model = routes[requestedModel] || requestedModel;

  if (!upstreamApiKey || upstreamApiKey === "your_tken_api_key") {
    return res.json({ id: `chatcmpl-demo-${Date.now()}`, object: "chat.completion", created: Math.floor(Date.now() / 1000), model: requestedModel, choices: [{ index: 0, message: { role: "assistant", content: `Railway template demo is working. Route: ${requestedModel}.` }, finish_reason: "stop" }] });
  }

  try {
    const upstream = await fetch(`${upstreamBaseUrl}/chat/completions`, { method: "POST", headers: { Authorization: `Bearer ${upstreamApiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    res.status(upstream.status);
    res.type(upstream.headers.get("content-type") || "application/json");
    if (body.stream && upstream.body) return Readable.fromWeb(upstream.body).pipe(res);
    res.send(await upstream.text());
  } catch (error) {
    res.status(502).json({ error: { message: error.message, type: "upstream_error" } });
  }
});

app.listen(port, () => console.log(`Railway AI Gateway listening on http://127.0.0.1:${port}`));
