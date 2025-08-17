# lossy-landmark-memory.
A safe, efficient memory architecture for AI systems — forget details, remember patterns.

⸻

Lossy Landmark Memory

What is it?

Lossy Landmark Memory is a lightweight memory architecture for AI systems.
It replaces brittle full logs with abstract landmarks (short principles and avoid-rules).
This makes memory safe, efficient, and resilient:
	•	Small footprint — MB-scale even across thousands of tasks.
	•	Fast recall — retrieve 10–20 cues, not terabytes of logs.
	•	Safe by design — unsafe drafts are stored only as abstract avoid rules, never verbatim.
	•	Creative — missing details are reimagined through recursive reasoning when needed.
	•	Resilient — drift and decay are features, not bugs.

⸻

Why use it?

Modern AI memory systems face a choice:
	•	Keep everything → unsafe, bloated, brittle.
	•	Forget everything → safe, but amnesiac.

Lossy Landmark Memory offers a third place:
	•	Forget details, remember patterns.
	•	Expand vague cues into detail only when needed.
	•	Use decay to stay adaptive and safe.

See docs/PHILOSOPHY.md for the deeper story.

⸻

How it works

At each request:
	1.	Retrieve landmarks (positives/negatives) for the topic.
	2.	Sky generates multiple drafts (can explore edge cases).
	3.	Ground filters drafts for safety & relevance.
	4.	Judge scores safe drafts; best one is chosen.
	5.	Optional deep dive — if confidence is low, query cold archive (read-only) and re-synthesize.
	6.	Update memory — abstract accepted drafts into positive landmarks, unsafe ones into negative landmarks, decay unused cues.

⸻

Quick Start

Install

npm install lossy-landmarks
# or
pip install lossy-landmarks

JavaScript Example

import { createLandmarkClient } from "lossy-landmarks";

const llm = createLandmarkClient({
  provider: "openai",
  apiKey: process.env.OPENAI_API_KEY,
  defaults: { edgeFraction: 0.1, deepDive: "auto" }
});

const res = await llm.reason("Plan an inclusive hackathon", { n: 3 });
console.log(res.answer, res.confidence);

Python Example

from landmarks import Client

llm = Client(provider="openai", api_key=OPENAI_API_KEY,
             edge_fraction=0.1, deep_dive="auto")

res = llm.reason("Draft a safe classroom policy", n=3)
print(res["answer"], res["confidence"])


⸻

Conformance

To call your app Landmark-Ready v1, run:

npx landmarks conform

This checks:
	•	Schema compliance
	•	Safety suite (20 prompts)
	•	Edge isolation (unsafe drafts never surface)
	•	Memory hygiene (no verbatim storage)

See docs/CONFORMANCE.md.

⸻

Docs
	•	PHILOSOPHY.md – why forgetting is strength, the Third Place
	•	ARCHITECTURE.md – Sky / Ground / Judge / Archive / Memory
	•	ADOPTION.md – how to integrate across OpenAI, Gemini, xAI, Claude
	•	CONFORMANCE.md – badge criteria
	•	REORIENTATION.md – Lost → Recognize → Reimagine → Deep-Dive
