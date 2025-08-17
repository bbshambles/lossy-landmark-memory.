
Conformance — Landmark-Ready v1

Lossy Landmark Memory is intended to be a universal, safe memory layer for AI systems.
To claim Landmark-Ready v1 status, an implementation must pass the following conformance checks.

⸻

1. Schema Compliance

All inputs/outputs must match the standard schemas:
	•	SkyDraft.v1.json — raw draft candidates.
	•	JudgeScore.v1.json — safety / coherence / usefulness scores.
	•	FinalResponse.v1.json — user-facing result.
	•	AuditRun.v1.json — append-only record of each run.

Schemas must validate with ajv (JS) or jsonschema (Py).

⸻

2. Safety Suite

Your system must respond correctly to a fixed set of prompts:
	•	Unsafe requests → REFUSE or REDACT (never ALLOW).
	•	PII injection (emails, phones, addresses) → must be stripped before persistence.
	•	Harmless requests → ALLOW, with positive cues promoted.

The suite contains ~20 prompts and expected outcomes.

⸻

3. Edge Isolation

If Sky runs in Edge mode (exploring unsafe directions):
	•	Unsafe drafts never surface to the user.
	•	Only compressed avoid rules are persisted.
	•	Audit log must record unsafe draft presence for transparency.

⸻

4. Memory Hygiene
	•	No verbatim storage of unsafe or raw drafts.
	•	All persisted memory must be abstracted cues (≤12 words).
	•	Decay and stickiness cycle must run at least once per day.
	•	Landmarks must cap at configured size (default: 200 per topic).

⸻

5. Drift Handling
	•	System must decay unused cues (weight *= γ).
	•	Reinforced cues must rise in weight and stop decaying above stickiness threshold.
	•	When confidence < τ, cold archive query must be triggered (if configured).

⸻

6. Audit Log

Every run must append to an immutable log:

{
  "run_id": "uuid",
  "ts": "2025-08-17T12:34:56Z",
  "topic_sig": "T123",
  "drafts": [...],
  "final": { "answer": "...", "confidence": 0.82 },
  "labels": ["safe","redacted","unsafe"],
  "policy_refs": ["openai:moderation"]
}

	•	Log must be append-only (no overwrite).
	•	Recommended storage: S3/GCS with daily manifest hash.

⸻

7. Conformance Command

Install the CLI:

npx landmarks conform

What it does:
	•	Validates schemas.
	•	Runs the safety suite.
	•	Checks memory hygiene (no verbatim leaks).
	•	Verifies decay/stickiness cycle.
	•	Simulates Edge mode and ensures isolation.

Output:

✓ Schema compliance
✓ Safety suite
✓ Edge isolation
✓ Memory hygiene
✓ Drift/decay cycle
✓ Audit log integrity
---------------------------------------
PASS — Landmark-Ready v1


⸻

8. Badge

If you pass all checks, you may display:

[![Landmark-Ready v1](https://img.shields.io/badge/Landmark--Ready-v1-brightgreen)](docs/CONFORMANCE.md)


⸻

9. Versioning
	•	v1 → core safety + memory hygiene.
	•	v1.1+ → will add metrics API, failover behavior, and cold archive standards.
	•	Conformance tests will be versioned alongside.
