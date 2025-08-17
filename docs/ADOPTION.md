Adoption Guide — Lossy Landmark Memory

Lossy Landmark Memory is designed to be drop-in for any major LLM provider.
This guide shows you how to adopt it in your system with minimal changes.

⸻

1. Install

JavaScript

npm install lossy-landmarks

Python

pip install lossy-landmarks


⸻

2. Quick Start

JavaScript

import { createLandmarkClient } from "lossy-landmarks";

const llm = createLandmarkClient({
  provider: "openai", 
  apiKey: process.env.OPENAI_API_KEY,
  defaults: { edgeFraction: 0.1, deepDive: "auto" }
});

const res = await llm.reason("Plan an inclusive hackathon", { n: 3 });
console.log(res.answer, res.confidence);

Python

from landmarks import Client

llm = Client(provider="openai", api_key=OPENAI_API_KEY,
             edge_fraction=0.1, deep_dive="auto")

res = llm.reason("Draft a safe classroom policy", n=3)
print(res["answer"], res["confidence"])


⸻

3. Providers

OpenAI
	•	Uses chat/completions with JSON mode.
	•	Safety: built-in moderation (omni-moderation-latest).
	•	System prompt injection: landmarks provided as system context.

Gemini
	•	Uses generateContent.
	•	Safety settings map directly to our ALLOW/REDACT/REFUSE.
	•	Landmarks passed as “system” parts of the request.

xAI Grok
	•	OpenAI-compatible endpoint.
	•	Landmarks injected like system messages.

Anthropic Claude
	•	Uses messages with system and user roles.
	•	Landmarks prepended as system instructions.

⸻

4. Reverse Proxy Mode

You can run Lossy Landmark Memory as a drop-in API service in front of any model:

docker run -p 8080:8080 ghcr.io/YOUR_ORG/lossy-landmarks

Then call it with curl:

curl -X POST http://localhost:8080/reason \
  -H "Authorization: Bearer $KEY" \
  -d '{"prompt":"Propose a code of conduct","n":3}'


⸻

5. Config Knobs

Setting	Description	Default
edgeFraction	% of Sky runs allowed in Edge mode	0.1
deepDive	When to query cold archive (auto/always)	auto
K_POS / K_NEG	# of positive/negative cues injected	5 / 5
DECAY_GAMMA	Daily decay rate for unused cues	0.98
STICKINESS	Threshold above which cues stop decaying	0.9
τ_conf	Confidence threshold for deep-dive trigger	0.75


⸻

6. Failover (using Lossy Landmarks as backup memory)

If your existing vector store or RAG system drifts:
	•	Run both systems in shadow.
	•	Compare answers.
	•	If RAG confidence < landmark confidence, prefer landmark.
	•	Periodically compress RAG fossils into landmarks for resilience.

⸻

7. Conformance

Run the conformance suite:

npx landmarks conform

This ensures:
	•	Schema compliance.
	•	Unsafe drafts never leak.
	•	PII redaction in memory.
	•	Landmark update cycle (reinforce/avoid/decay) behaves correctly.

Badge: Landmark-Ready v1

⸻

8. Roadmap for Adoption
	•	Phase 1 (MVP) → Single provider adapter (OpenAI), SDKs (JS/Py), reverse proxy.
	•	Phase 2 (multi-provider) → Gemini, xAI, Claude adapters.
	•	Phase 3 (ops-ready) → multi-tenant memory, metrics API (/metrics), training export.
