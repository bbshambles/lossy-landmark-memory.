// src/index.ts
import {
  topicSig, retrieveCues,
  reinforcePositives, addNegatives
} from "./memory/landmarks";

async function main() {
  const prompt = process.argv.slice(2).join(" ") || "Plan an inclusive hackathon for neurodiverse participants.";
  const topic = topicSig(prompt);

  console.log("Topic:", topic);
  console.log("Before:", retrieveCues(topic));

  // Pretend we produced a great answer — add 2 principles
  reinforcePositives(topic, ["Offer sensory-friendly options.", "Provide quiet rooms."], 0.9);

  // Pretend one draft was bad — add an avoid rule
  addNegatives(topic, ["Avoid insensitive phrasing."], 0.8);

  console.log("After:", retrieveCues(topic));
  console.log("\nRun me again with a similar prompt and you’ll see these cues ready to inject!");
}

main().catch(err => { console.error(err); process.exit(1); });
