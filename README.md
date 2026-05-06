# TKEN Railway AI Gateway Template

Railway-first OpenAI-compatible AI gateway template with low-cost and premium model routes.

Default API base:

```text
https://www.tken.shop/v1
```

Get an API key:

```text
https://www.tken.shop/?utm_source=github&utm_medium=readme&utm_campaign=tken_railway_ai_gateway_template
```

## 3-Minute Railway Setup

1. Create a new Railway project from this repository.
2. Add environment variables from `.env.example`.
3. Deploy.
4. Open `/health`.
5. Send OpenAI-compatible requests to `/v1/chat/completions`.

## Required Railway Variables

| Variable | Example |
| --- | --- |
| `LOCAL_API_KEY` | `local-dev-key` |
| `UPSTREAM_BASE_URL` | `https://www.tken.shop/v1` |
| `UPSTREAM_API_KEY` | your TKEN key |
| `FREE_MODEL` | `tken-free-model` |
| `PREMIUM_MODEL` | `premium-gpt-model` |

## Local Test

```bash
npm install
npm run check
npm start
```

## Disclosure

This template is TKEN-related tooling. It is not affiliated with Railway, OpenAI, Anthropic, ChatGPT, Claude, Codex, or OpenClaw.
