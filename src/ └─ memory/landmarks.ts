// src/memory/landmarks.ts

export type TopicSig = string;
export type Cue = { cue: string; w: number; ts: string };
export type Bucket = { topic: TopicSig; positives: Cue[]; negatives: Cue[] };

// Tunables (safe defaults)
export const K_POS = 5;          // keep top K positive cues
export const K_NEG = 5;          // keep top K negative cues
export const DECAY_GAMMA = 0.995; // daily decay (~20% per month)
export const STICKINESS = 0.80;   // cues >= this don't decay

const store = new Map<TopicSig, Bucket>();

function nowISO() { return new Date().toISOString(); }

// Very simple topic bucket (we’ll replace with embeddings later)
export function topicSig(prompt: string): TopicSig {
  const words = (prompt.toLowerCase().match(/[a-z]+/g) || []).slice(0, 3).join("_");
  return "topic_" + (words || "general");
}

export function getBucket(topic: TopicSig): Bucket {
  if (!store.has(topic)) store.set(topic, { topic, positives: [], negatives: [] });
  return store.get(topic)!;
}

function upsert(list: Cue[], text: string, boost: number) {
  const cue = text.trim().slice(0, 120);
  let item = list.find(c => c.cue === cue);
  if (!item) { item = { cue, w: 0.5, ts: nowISO() }; list.push(item); }
  // multiplicative weight update (bandit-ish)
  item.w = Math.min(1, item.w * Math.exp(0.5 * boost));
  item.ts = nowISO();
}

function decay(list: Cue[]) {
  for (const c of list) if (c.w < STICKINESS) c.w *= DECAY_GAMMA;
}

function topK(list: Cue[], k: number): string[] {
  return list.slice().sort((a,b)=>b.w-a.w).slice(0, k).map(c=>c.cue);
}

export function retrieveCues(topic: TopicSig) {
  const b = getBucket(topic);
  return { positives: topK(b.positives, K_POS), negatives: topK(b.negatives, K_NEG) };
}

export function reinforcePositives(topic: TopicSig, principles: string[], reward: number) {
  const b = getBucket(topic);
  for (const p of principles) upsert(b.positives, p, reward);
  tidy(b);
}

export function addNegatives(topic: TopicSig, avoids: string[], strength = 0.8) {
  const b = getBucket(topic);
  for (const a of avoids) upsert(b.negatives, a, strength);
  tidy(b);
}

function tidy(b: Bucket) {
  decay(b.positives); decay(b.negatives);
  b.positives = b.positives.sort((a,b)=>b.w-a.w).slice(0, K_POS);
  b.negatives = b.negatives.sort((a,b)=>b.w-a.w).slice(0, K_NEG);
}
