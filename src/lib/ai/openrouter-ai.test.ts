import { afterEach, describe, expect, it, vi } from "vitest";
import { OpenRouterAIService } from "./openrouter-ai";

const envKeys = [
  "OPENROUTER_API_KEY",
  "OPENROUTER_PROVIDER_SLUG",
  "OPENROUTER_PROVIDER_ORDER",
  "OPENROUTER_PROVIDER_ONLY",
  "OPENROUTER_PROVIDER_IGNORE",
  "OPENROUTER_PROVIDER_SORT",
  "OPENROUTER_ALLOW_FALLBACKS",
  "OPENROUTER_REQUIRE_PARAMETERS",
  "OPENROUTER_RESPONSE_FORMAT",
  "OPENROUTER_DATA_COLLECTION",
  "OPENROUTER_HTTP_REFERER",
  "OPENROUTER_APP_TITLE"
];

const validRFQExtraction = {
  fields: {
    incoterms: "FOB",
    originCountry: "Chile",
    originCity: "Valparaiso",
    originPort: "Valparaiso",
    destinationCountry: "Poland",
    destinationCity: "Gdansk",
    destinationPort: "Gdansk",
    containerType: "40HC",
    containerQuantity: 2,
    cargoDescription: "Зеленые кофейные зерна",
    packaging: null,
    grossWeight: null,
    volume: null,
    cargoReadyDate: null,
    quotationDeadline: null,
    specialRequirements: null,
    cargoFlags: []
  },
  assertions: [
    {
      fieldName: "origin_port",
      value: "Valparaiso",
      verificationStatus: "Confirmed",
      confidence: "High",
      evidence: "из Valparaiso"
    }
  ],
  missingFields: [],
  riskFlags: [],
  clarificationDraft: "Пожалуйста, подтвердите дату готовности груза."
};

describe("OpenRouterAIService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    for (const key of envKeys) delete process.env[key];
  });

  it("фиксирует Gemma free на Google AI Studio provider", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: JSON.stringify(validRFQExtraction) } }]
        }),
        { status: 200 }
      )
    );

    const ai = new OpenRouterAIService();
    await ai.extractRFQ({
      sourceType: "email",
      rawText: "2 x 40HC Valparaiso to Gdansk, FOB"
    });

    const request = fetchMock.mock.calls[0]?.[1];
    const body = JSON.parse(String(request?.body));
    const headers = request?.headers as Record<string, string>;

    expect(body.model).toBe("google/gemma-4-26b-a4b-it:free");
    expect(body.provider).toMatchObject({
      order: ["google-ai-studio"],
      only: ["google-ai-studio"],
      allow_fallbacks: false,
      require_parameters: true
    });
    expect(body.response_format).toEqual({ type: "json_object" });
    expect(headers.authorization).toBe("Bearer test-key");
  });
});
