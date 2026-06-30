import { AIValidationFallbackError, type AIService } from "./ai-service";
import { FixtureAIService } from "./fixture-ai";
import { rateExtractionSchema, rfqExtractionSchema, type RateExtraction, type RFQExtraction } from "./schemas";

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const nullableString = { type: ["string", "null"] };

const rfqExtractionJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fields: {
      type: "object",
      additionalProperties: false,
      properties: {
        incoterms: nullableString,
        originCountry: nullableString,
        originCity: nullableString,
        originPort: nullableString,
        destinationCountry: nullableString,
        destinationCity: nullableString,
        destinationPort: nullableString,
        containerType: nullableString,
        containerQuantity: { type: ["integer", "null"] },
        cargoDescription: nullableString,
        packaging: nullableString,
        grossWeight: nullableString,
        volume: nullableString,
        cargoReadyDate: nullableString,
        quotationDeadline: nullableString,
        specialRequirements: nullableString,
        cargoFlags: {
          type: "array",
          items: {
            type: "string",
            enum: ["dangerous_goods", "temperature_controlled", "reefer", "out_of_gauge", "special_handling"]
          }
        }
      },
      required: [
        "incoterms",
        "originCountry",
        "originCity",
        "originPort",
        "destinationCountry",
        "destinationCity",
        "destinationPort",
        "containerType",
        "containerQuantity",
        "cargoDescription",
        "packaging",
        "grossWeight",
        "volume",
        "cargoReadyDate",
        "quotationDeadline",
        "specialRequirements",
        "cargoFlags"
      ]
    },
    assertions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          fieldName: { type: "string" },
          value: nullableString,
          verificationStatus: { type: "string", enum: ["Confirmed", "Needs confirmation", "Missing", "Conflict detected"] },
          confidence: { type: "string", enum: ["High", "Medium", "Low"] },
          evidence: { type: "string" }
        },
        required: ["fieldName", "value", "verificationStatus", "confidence", "evidence"]
      }
    },
    missingFields: { type: "array", items: { type: "string" } },
    riskFlags: { type: "array", items: { type: "string" } },
    clarificationDraft: { type: "string" }
  },
  required: ["fields", "assertions", "missingFields", "riskFlags", "clarificationDraft"]
};

const rateExtractionJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agentName: nullableString,
    oceanFreight: { type: "number" },
    currency: { type: "string" },
    rateUnit: { type: "string" },
    originCharges: { type: "number" },
    documentationFee: { type: "number" },
    destinationCharges: { type: "number" },
    shippingLine: { type: "string" },
    transitDays: { type: "integer" },
    route: { type: "string" },
    validityDate: { type: "string" },
    freeDays: { type: "integer" },
    inclusions: { type: "array", items: { type: "string" } },
    exclusions: { type: "array", items: { type: "string" } },
    conditions: { type: "array", items: { type: "string" } },
    completenessScore: { type: "integer", minimum: 0, maximum: 100 },
    reviewRequired: { type: "boolean" },
    sourceEvidence: { type: "string" }
  },
  required: [
    "agentName",
    "oceanFreight",
    "currency",
    "rateUnit",
    "originCharges",
    "documentationFee",
    "destinationCharges",
    "shippingLine",
    "transitDays",
    "route",
    "validityDate",
    "freeDays",
    "inclusions",
    "exclusions",
    "conditions",
    "completenessScore",
    "reviewRequired",
    "sourceEvidence"
  ]
};

function extractJson(content: string) {
  const trimmed = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  if (trimmed.startsWith("{")) return trimmed;

  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match?.[1]) return match[1].trim();

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) return trimmed.slice(firstBrace, lastBrace + 1);

  return trimmed;
}

export class LMStudioAIService implements AIService {
  private readonly fallback = new FixtureAIService();

  constructor(
    private readonly baseUrl = process.env.LMSTUDIO_BASE_URL ?? "http://192.168.50.232:1234/v1",
    private readonly model = process.env.LMSTUDIO_MODEL ?? "google/gemma-4-12b-qat",
    private readonly timeoutMs = Number(process.env.LMSTUDIO_TIMEOUT_MS ?? 10000),
    private readonly maxTokens = Number(process.env.LMSTUDIO_MAX_TOKENS ?? 700),
    private readonly temperature = Number(process.env.LMSTUDIO_TEMPERATURE ?? 0),
    private readonly topP = Number(process.env.LMSTUDIO_TOP_P ?? 0.1),
    private readonly structuredOutput = process.env.LMSTUDIO_STRUCTURED_OUTPUT !== "false",
    private readonly reasoningEffort = process.env.LMSTUDIO_REASONING_EFFORT
  ) {}

  async extractRFQ(input: { sourceType: "email" | "conversation" | "call_notes"; rawText: string }): Promise<RFQExtraction> {
    const prompt = [
      "Извлеки freight RFQ из пользовательского текста.",
      "Верни только JSON по этой форме:",
      "{ fields: { incoterms, originCountry, originCity, originPort, destinationCountry, destinationCity, destinationPort, containerType, containerQuantity, cargoDescription, packaging, grossWeight, volume, cargoReadyDate, quotationDeadline, specialRequirements, cargoFlags }, assertions: [{ fieldName, value, verificationStatus, confidence, evidence }], missingFields: [], riskFlags: [], clarificationDraft: string }",
      "verificationStatus должен быть одним из: Confirmed, Needs confirmation, Missing, Conflict detected.",
      "confidence должен быть High, Medium или Low.",
      "Не выдумывай отсутствующие факты.",
      "Пользовательские текстовые поля, evidence и clarificationDraft возвращай на русском языке.",
      `Тип источника: ${input.sourceType}`,
      input.rawText
    ].join("\n\n");

    try {
      const json = await this.completeJson(prompt, "rfq_extraction", rfqExtractionJsonSchema);
      return rfqExtractionSchema.parse(JSON.parse(json));
    } catch {
      const fallback = await this.fallback.extractRFQ(input);
      throw new AIValidationFallbackError(undefined, fallback);
    }
  }

  async normalizeRateReply(input: { rawText: string; sourceType: "email" | "messy_text" | "xlsx" }): Promise<RateExtraction> {
    const prompt = [
      "Нормализуй ответ агента по freight rate.",
      "Верни только JSON по этой форме:",
      "{ agentName, oceanFreight, currency, rateUnit, originCharges, documentationFee, destinationCharges, shippingLine, transitDays, route, validityDate, freeDays, inclusions, exclusions, conditions, completenessScore, reviewRequired, sourceEvidence }",
      "Все числовые суммы должны быть числами. Никогда не рассчитывай клиентскую продажную цену.",
      "Пользовательские пояснения, inclusions, exclusions, conditions и sourceEvidence возвращай на русском языке.",
      `Тип источника: ${input.sourceType}`,
      input.rawText
    ].join("\n\n");

    try {
      const json = await this.completeJson(prompt, "rate_extraction", rateExtractionJsonSchema);
      return rateExtractionSchema.parse(JSON.parse(json));
    } catch {
      const fallback = await this.fallback.normalizeRateReply(input);
      throw new AIValidationFallbackError(undefined, fallback);
    }
  }

  async generateClarificationDraft(rfqCaseId: string) {
    return `Пожалуйста, подтвердите недостающие операционные поля для ${rfqCaseId} перед подготовкой финальной клиентской котировки.`;
  }

  async generateRFQDraft(rfqCaseId: string, agentId: string) {
    return `RFQ ${rfqCaseId}: пожалуйста, предоставьте ставку ocean FCL, срок действия, свободные дни, включения, исключения и транзитное время. Агент ${agentId}.`;
  }

  async generateCustomerQuoteDraft(quoteId: string) {
    return `Quote ${quoteId}: черновик создан на основе выбранной валидированной ставки. Требуется коммерческое согласование.`;
  }

  private async completeJson(prompt: string, schemaName: string, schema: object) {
    const requestBody: Record<string, unknown> = {
      model: this.model,
      temperature: this.temperature,
      top_p: this.topP,
      max_tokens: this.maxTokens,
      stream: false,
      messages: [
        {
          role: "system",
          content: [
            "Ты движок извлечения данных для freight operations.",
            "Сразу возвращай финальный JSON-объект.",
            "Не рассуждай пошагово.",
            "Не выводи reasoning, analysis, markdown, comments или <think> blocks.",
            "Если факт отсутствует, используй null или Missing. Никогда не выдумывай отсутствующие факты."
          ].join(" ")
        },
        {
          role: "user",
          content: prompt
        }
      ]
    };

    if (this.structuredOutput) {
      requestBody.response_format = {
        type: "json_schema",
        json_schema: {
          name: schemaName,
          strict: true,
          schema
        }
      };
    }

    if (this.reasoningEffort) {
      requestBody.reasoning = { effort: this.reasoningEffort };
    }

    const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.timeoutMs)
    });

    if (!response.ok) {
      throw new Error(`Запрос к LM Studio завершился ошибкой: ${response.status}`);
    }

    const payload = (await response.json()) as ChatCompletionResponse;
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("LM Studio вернула пустой ответ");

    return extractJson(content);
  }
}
