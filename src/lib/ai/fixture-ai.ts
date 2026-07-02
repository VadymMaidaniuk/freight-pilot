import type { AIService } from "./ai-service";
import type { RateExtraction, RFQExtraction } from "./schemas";
import type { SourceType } from "@/lib/types";

const defaultExtraction: RFQExtraction = {
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
    specialRequirements: "Подтвердить свободные дни и основные сборы",
    cargoFlags: []
  },
  assertions: [
    {
      fieldName: "origin_port",
      value: "Valparaiso",
      verificationStatus: "Confirmed",
      confidence: "High",
      evidence: "из Valparaiso, Chile"
    },
    {
      fieldName: "destination_port",
      value: "Gdansk",
      verificationStatus: "Confirmed",
      confidence: "High",
      evidence: "в Gdansk, Poland"
    },
    {
      fieldName: "cargo_ready_date",
      value: null,
      verificationStatus: "Needs confirmation",
      confidence: "Medium",
      evidence: "Груз ожидается на следующей неделе"
    }
  ],
  missingFields: ["gross_weight", "cargo_ready_date"],
  riskFlags: ["cargo_ready_date_missing"],
  clarificationDraft:
    "Пожалуйста, подтвердите дату готовности груза, вес брутто на контейнер и нужна ли документация для пищевого груза."
};

const defaultRate: RateExtraction = {
  agentName: null,
  oceanFreight: 3900,
  currency: "USD",
  rateUnit: "2 x 40HC",
  originCharges: 420,
  documentationFee: 90,
  destinationCharges: 240,
  shippingLine: "Maersk",
  transitDays: 38,
  route: "Valparaiso -> Gdansk",
  validityDate: "2026-07-15",
  freeDays: 14,
  inclusions: ["Морской фрахт", "Сборы в порту отправления", "Документация", "Обработка в порту назначения"],
  exclusions: ["Таможенные пошлины", "Демередж после свободных дней"],
  conditions: ["При условии наличия оборудования"],
  completenessScore: 96,
  reviewRequired: false,
  sourceEvidence: "Fixture-результат использован для безопасного режима управляемого демо."
};

export class FixtureAIService implements AIService {
  async extractRFQ(input?: { sourceType: SourceType; rawText: string }): Promise<RFQExtraction> {
    void input;
    return defaultExtraction;
  }

  async normalizeRateReply(input?: { rawText: string; sourceType: "email" | "messy_text" | "xlsx" }): Promise<RateExtraction> {
    void input;
    return defaultRate;
  }

  async generateClarificationDraft() {
    return defaultExtraction.clarificationDraft;
  }

  async generateRFQDraft(_rfqCaseId: string, agentId: string, context?: string) {
    return [
      `Пожалуйста, предоставьте полную ставку ocean FCL по этому RFQ. Агент: ${agentId}.`,
      "Нужно раскрыть ocean freight, локальные сборы отправления и назначения, документацию, срок действия, транзит, free days, исключения и условия.",
      context ? `Контекст RFQ:\n${context}` : null
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  async generateCustomerQuoteDraft(quoteId: string, context?: string) {
    return [
      `Subject: Freight quote ${quoteId}`,
      "",
      "Здравствуйте,",
      "",
      "Подготовили ставку по вашему запросу. Ниже приведены маршрут, контейнеры, выбранный вариант перевозки, итоговая цена и ключевые условия.",
      context,
      "",
      "Ставка действует при наличии места и оборудования. Готовы подтвердить букинг после вашего согласования.",
      "",
      "С уважением,",
      "FreightPilot Quote Desk"
    ]
      .filter(Boolean)
      .join("\n");
  }
}
