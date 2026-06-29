import type { AIProviderName, AIService } from "./ai-service";
import { FixtureAIService } from "./fixture-ai";
import { LMStudioAIService } from "./lmstudio-ai";

export function createAIService(provider = (process.env.AI_PROVIDER ?? "fixture") as AIProviderName): AIService {
  if (provider === "lmstudio") return new LMStudioAIService();

  // Hosted providers are intentionally routed through fixture mode until keys,
  // prompts and cost limits are configured for Live Proof.
  return new FixtureAIService();
}

export * from "./ai-service";
export * from "./schemas";
