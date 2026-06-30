import type { AIProviderName, AIService } from "./ai-service";
import { FixtureAIService } from "./fixture-ai";
import { LMStudioAIService } from "./lmstudio-ai";

export function createAIService(provider = (process.env.AI_PROVIDER ?? "fixture") as AIProviderName): AIService {
  if (provider === "lmstudio") return new LMStudioAIService();

  // Hosted-провайдеры намеренно идут через режим фикстуры, пока не настроены
  // ключи, промпты и лимиты стоимости для проверки AI.
  return new FixtureAIService();
}

export * from "./ai-service";
export * from "./schemas";
