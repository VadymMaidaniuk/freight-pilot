import type { AIProviderName, AIService } from "./ai-service";
import { FixtureAIService } from "./fixture-ai";
import { LMStudioAIService } from "./lmstudio-ai";
import { OpenRouterAIService } from "./openrouter-ai";

export function createAIService(provider = (process.env.AI_PROVIDER ?? "fixture") as AIProviderName): AIService {
  if (provider === "lmstudio") return new LMStudioAIService();
  if (provider === "openrouter") return new OpenRouterAIService();

  // Claude пока остается через режим фикстуры, пока не настроены ключи,
  // промпты и лимиты стоимости для отдельной интеграции.
  return new FixtureAIService();
}

export * from "./ai-service";
export * from "./schemas";
