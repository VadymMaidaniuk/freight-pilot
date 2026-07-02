import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
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

function persistenceDisabled() {
  return process.env.VITEST === "true";
}

function persistencePath() {
  const workspaceKey = createHash("sha1").update(process.cwd()).digest("hex").slice(0, 10);
  return path.join(tmpdir(), "freight-pilot", `fallback-store-${workspaceKey}.json`);
}

function reviveStore(input: DemoSeed): DemoSeed {
  return {
    ...input,
    metrics: input.metrics.map((item) => ({ ...item, lastObservedAt: new Date(item.lastObservedAt) })),
    requests: input.requests.map((item) => ({ ...item, sentAt: item.sentAt ? new Date(item.sentAt) : null })),
    rateReplies: input.rateReplies.map((item) => ({ ...item, receivedAt: new Date(item.receivedAt) })),
    quoteVersions: input.quoteVersions.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
    activityEvents: input.activityEvents.map((item) => ({ ...item, createdAt: new Date(item.createdAt) }))
  };
}

function loadPersistedStore() {
  if (persistenceDisabled()) return null;

  const filePath = persistencePath();
  if (!existsSync(filePath)) return null;

  try {
    return reviveStore(JSON.parse(readFileSync(filePath, "utf8")) as DemoSeed);
  } catch {
    return null;
  }
}

export function persistFallbackStore() {
  if (persistenceDisabled()) return;

  const filePath = persistencePath();
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(store), "utf8");
}

store = loadPersistedStore() ?? store;

export function getFallbackStore() {
  store = loadPersistedStore() ?? store;
  return store;
}

export function resetFallbackStore() {
  store = cloneSeed();
  persistFallbackStore();
  return store;
}
