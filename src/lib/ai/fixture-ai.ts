import type { AIService } from "./ai-service";
import type { RateExtraction, RFQExtraction } from "./schemas";

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
    cargoDescription: "Green coffee beans",
    packaging: null,
    grossWeight: null,
    volume: null,
    cargoReadyDate: null,
    quotationDeadline: null,
    specialRequirements: "Confirm free days and major charges",
    cargoFlags: []
  },
  assertions: [
    {
      fieldName: "origin_port",
      value: "Valparaiso",
      verificationStatus: "Confirmed",
      confidence: "High",
      evidence: "from Valparaiso, Chile"
    },
    {
      fieldName: "destination_port",
      value: "Gdansk",
      verificationStatus: "Confirmed",
      confidence: "High",
      evidence: "to Gdansk, Poland"
    },
    {
      fieldName: "cargo_ready_date",
      value: null,
      verificationStatus: "Needs confirmation",
      confidence: "Medium",
      evidence: "Cargo expected next week"
    }
  ],
  missingFields: ["gross_weight", "cargo_ready_date"],
  riskFlags: ["cargo_ready_date_missing"],
  clarificationDraft:
    "Please confirm cargo-ready date, gross weight per container, and whether any food-grade documentation is required."
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
  inclusions: ["Ocean freight", "Origin charges", "Documentation", "Destination handling"],
  exclusions: ["Customs duties", "Demurrage after free days"],
  conditions: ["Subject to equipment availability"],
  completenessScore: 96,
  reviewRequired: false,
  sourceEvidence: "Fixture output used for guided demo safe mode."
};

export class FixtureAIService implements AIService {
  async extractRFQ(input?: { sourceType: "email" | "conversation" | "call_notes"; rawText: string }): Promise<RFQExtraction> {
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

  async generateRFQDraft(_rfqCaseId: string, agentId: string) {
    return `Please provide a full FCL ocean quote for this RFQ, including major local charges, validity, transit time, free days, exclusions, and conditions. Agent: ${agentId}.`;
  }

  async generateCustomerQuoteDraft(quoteId: string) {
    return `Customer quote draft ${quoteId}. Status: Draft - commercial approval required.`;
  }
}
