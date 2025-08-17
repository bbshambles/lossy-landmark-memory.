Architecture of Lossy Landmark Memory

Overview

Lossy Landmark Memory introduces a three-strata memory system wrapped in a safety-first reasoning loop.
It is designed to be drop-in for any LLM provider (OpenAI, Gemini, xAI, Claude).

⸻

Memory Strata
	1.	Current Data (live stream)
	•	Fresh prompts and drafts.
	•	Ephemeral, working memory.
	2.	Lossy Landmark Memory (hot store)
	•	Abstract positive principles and negative avoid-rules.
	•	Compact (MB scale).
	•	Decay unused cues, reinforce used ones.
	3.	Cold Archive (fossils)
	•	Optional vector/log store.
	•	Read-only, only queried when detail/precision required.

⸻

Reasoning Components
	•	Sky (explore) → Generates multiple candidate drafts. Can run in “Edge mode” (unsafe exploration) but never outputs directly to user.
	•	Ground (contain) → Filters drafts for safety, policy, and PII. Unsafe material is quarantined and abstracted into avoid-rules.
	•	Judge (choose) → Scores safe drafts for safety, coherence, and usefulness. Picks best candidate or requests a retry.
	•	Orchestrator → Coordinates Sky/Ground/Judge, retrieves landmarks, and updates memory.

⸻

Flow

@startuml
title Lossy Landmark Memory - Core Loop

actor User
participant Orchestrator
participant Memory as "Landmarks"
participant Archive as "Cold Archive"
participant Sky
participant Ground
participant Judge
database Log as "Immutable Audit"

User -> Orchestrator: Prompt
Orchestrator -> Memory: Get landmarks (pos/neg)
Orchestrator -> Sky: Prompt + landmarks (N drafts)
Sky -> Ground: Drafts
Ground -> Judge: Safe/redacted drafts
Judge --> Orchestrator: Best draft + confidence

alt Low confidence or policy requires
  Orchestrator -> Archive: Query facts
  Orchestrator -> Sky: Prompt + landmarks + facts
  Sky -> Ground -> Judge --> Orchestrator
end

Orchestrator -> Memory: Reinforce positives, add avoids, decay others
Orchestrator -> Log: Store drafts + scores
Orchestrator -> User: Final safe answer
@enduml


⸻

Update Cycle
	1.	Accepted drafts → compressed into positive principles.
	2.	Unsafe/rejected drafts → compressed into negative avoid-rules.
	3.	Decay → unused landmarks gradually fade, unless reinforced.
	4.	Stickiness → highly reinforced landmarks stop decaying.

⸻

Safety by Design
	•	Unsafe drafts are never stored verbatim.
	•	Only abstract principles persist (≤12 words).
	•	PII redaction occurs before persistence.
	•	Append-only immutable audit log tracks all decisions.

⸻

Advantages
	•	Efficiency → MB-scale memory for thousands of tasks.
	•	Safety → unsafe material compressed to avoid-rules, never replayed.
	•	Creativity → recursive reasoning fills gaps from vague cues.
	•	Resilience → drift is tolerated and harnessed, not feared.
	•	Portability → works across all major LLM providers via adapters.

