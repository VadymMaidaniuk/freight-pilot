import { demoSeed } from "@/lib/demo/seed-data";
import type { DemoSeed } from "@/lib/types";

function cloneSeed(): DemoSeed {
  return {
    tenant: { ...demoSeed.tenant },
    agents: demoSeed.agents.map((item) => ({ ...item, languages: [...item.languages], supportedServices: [...item.supportedServices], cargoCapabilityTags: [...item.cargoCapabilityTags], issueFlags: [...item.issueFlags] })),
    coverages: demoSeed.coverages.map((item) => ({ ...item })),
    metrics: demoSeed.metrics.map((item) => ({ ...item, lastObservedAt: new Date(item.lastObservedAt) })),
    scenarios: demoSeed.scenarios.map((item) => ({ ...item, purpose: [...item.purpose] })),
    inputs: demoSeed.inputs.map((item) => ({ ...item })),
    cases: demoSeed.cases.map((item) => ({ ...item, cargoFlags: [...item.cargoFlags], riskFlags: [...item.riskFlags] })),
    fieldAssertions: demoSeed.fieldAssertions.map((item) => ({ ...item })),
    rounds: demoSeed.rounds.map((item) => ({ ...item, selectedAgentIds: [...item.selectedAgentIds] })),
    requests: demoSeed.requests.map((item) => ({ ...item, sentAt: item.sentAt ? new Date(item.sentAt) : null })),
    attachments: demoSeed.attachments.map((item) => ({ ...item })),
    replyPlans: demoSeed.replyPlans.map((item) => ({ ...item })),
    rateReplies: demoSeed.rateReplies.map((item) => ({ ...item, receivedAt: new Date(item.receivedAt) })),
    rateOptions: demoSeed.rateOptions.map((item) => ({ ...item, inclusions: [...item.inclusions], exclusions: [...item.exclusions], conditions: [...item.conditions] })),
    quotes: demoSeed.quotes.map((item) => ({ ...item })),
    quoteVersions: demoSeed.quoteVersions.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
    activityEvents: demoSeed.activityEvents.map((item) => ({ ...item, createdAt: new Date(item.createdAt) }))
  };
}

let store = cloneSeed();

export function getFallbackStore() {
  return store;
}

export function resetFallbackStore() {
  store = cloneSeed();
  return store;
}
