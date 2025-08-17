Reorientation in Lossy Landmark Memory

AI systems inevitably face drift: noisy inputs, sparse cues, or low confidence.
Lossy Landmark Memory provides a structured way to reorient itself without collapsing.

This loop mirrors how humans “get lost, recognize a pattern, and reimagine their way back.”

⸻

The Reorientation Loop

Steps
	1.	Lost → System detects sparse cues or low prior confidence.
	2.	Recognize → Nearest-topic motifs are retrieved as rescue cues.
	3.	Reimagine → Recursive reasoning expands vague cues into drafts.
	4.	Vet → Ground filters unsafe/irrelevant material.
	5.	Judge → Scores drafts for safety, coherence, usefulness.
	6.	Deep-Dive (optional) → If confidence < τ or policy requires, query the cold archive.
	7.	Update → Final draft chosen, landmarks updated, unsafe compressed into avoid-rules.

⸻

State Machine

@startuml
title Reorientation Loop - Lossy Landmark Memory

[*] --> Sense : receive prompt
State Sense {
  :topic_sig = bucket(prompt);
  :cues = landmarks.get(topic_sig);
}

Sense --> Lost : cues sparse OR low prior confidence
Sense --> Compose : cues sufficient

Lost --> Recognize : nearest motifs retrieved
Recognize --> Reimagine : recursive reasoning from vague cues
Reimagine --> Vet
Compose --> Vet

Vet --> Judge
Judge --> GoodEnough : confidence >= τ
Judge --> DeepDive : confidence < τ OR policy requires

DeepDive --> Vet
Vet --> Judge
Judge --> ArchiveUpdate : pick best safe answer
ArchiveUpdate --> Learn : reinforce / avoid / decay
Learn --> [*]
@enduml


⸻

Detection Rules
	•	Sparse cues → |positives| + |negatives| < 2.
	•	Low confidence → prior moving average < 0.5.
	•	Nearest-topic rescue → cosine similarity ≥ 0.75 to any topic centroid.
	•	Deep-dive trigger → confidence < τ (default 0.75) or policy requires (medical, finance, etc.).

⸻

Pseudocode

cues = memory.get_cues(topic)
sparse = len(cues.pos) + len(cues.neg) < 2
prior_conf = metrics.topic_conf(topic)

if sparse or prior_conf < 0.5:
    neighbors = topic_index.nearest(topic_vec, k=3)
    rescue_cues = merge(neighbors)
    draft = sky.compose(prompt, rescue_cues)
    draft = recursive_refine(draft, rescue_cues)
else:
    draft = sky.compose(prompt, cues)

vetted = ground.filter(draft)
scored = judge.score(vetted)

if scored.best.conf < τ or policy.requires(prompt):
    facts = archive.query(prompt, k=5)
    draft = sky.compose(prompt, cues + rescue_cues, facts)
    vetted = ground.filter(draft)
    scored = judge.score(vetted)

memory.update(scored, vetted)
return scored.best


⸻

Example

Prompt: “How should I prepare for a lunar landing?”
	•	Lost → No direct landmarks for “lunar landing.”
	•	Recognize → Nearest motifs: “precision landing,” “hazard avoidance,” “fuel management.”
	•	Reimagine → Recursive drafts combine cues into an outline.
	•	Vet → Redacts unsafe engineering details.
	•	Judge → Scores for coherence/usefulness.
	•	Deep-Dive → Archive query fetches NASA safe-practice docs.
	•	Update → Positive cue: “Prioritize hazard avoidance during descent.”
Negative cue: “Avoid unverified engineering procedures.”

⸻

Why It Matters

Reorientation is how Lossy Landmark Memory survives drift:
	•	Never collapses into silence.
	•	Never repeats unsafe material.
	•	Always learns from the experience — promoting vague cues into reinforced landmarks.

It allows AI to get lost, recover, and grow stronger — just like humans.

