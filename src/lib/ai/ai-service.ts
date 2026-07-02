import type { RateExtraction, RFQExtraction } from "./schemas";
import type { SourceType } from "@/lib/types";

export type AIProviderName = "fixture" | "claude" | "openrouter" | "lmstudio";

export interface AIService {
  extractRFQ(input: {
    sourceType: SourceType;
    rawText: string;
  }): Promise<RFQExtraction>;

  normalizeRateReply(input: {
    rawText: string;
    sourceType: "email" | "messy_text" | "xlsx";
  }): Promise<RateExtraction>;

  generateClarificationDraft(rfqCaseId: string): Promise<string>;
  generateRFQDraft(rfqCaseId: string, agentId: string): Promise<string>;
  generateCustomerQuoteDraft(quoteId: string): Promise<string>;
}

export class AIValidationFallbackError extends Error {
  constructor(
    message = "Оперативное извлечение не прошло безопасную валидацию. Использован безопасный демо-резерв.",
    readonly fallbackPayload?: unknown,
    readonly details?: string
  ) {
    super(message);
    this.name = "AIValidationFallbackError";
  }
}
