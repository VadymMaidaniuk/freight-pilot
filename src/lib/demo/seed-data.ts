import type {
  Agent,
  AgentCoverage,
  AgentMetric,
  AgentRequest,
  Attachment,
  DemoSeed,
  RFQCase,
  RFQFieldAssertion,
  RFQInput,
  RFQRound,
  RFQScenario,
  RateOption,
  RateReply,
  ReplyPlan
} from "@/lib/types";

export const DEMO_TENANT_ID = "demo_freightpilot";
const observedAt = new Date("2026-06-20T10:00:00.000Z");
const receivedAt = new Date("2026-06-28T09:40:00.000Z");

export const agentsSeed: Agent[] = [
  {
    id: "agent-andes-link",
    tenantId: DEMO_TENANT_ID,
    externalKey: "CL-ANDES-LINK",
    companyName: "Andes Link Freight",
    status: "active",
    location: "Valparaiso, Chile",
    languages: ["English", "Spanish"],
    supportedServices: ["ocean_fcl", "origin_handling", "customs_coordination"],
    cargoCapabilityTags: ["coffee", "agricultural", "dry_cargo"],
    issueFlags: []
  },
  {
    id: "agent-pacific-axis",
    tenantId: DEMO_TENANT_ID,
    externalKey: "CL-PACIFIC-AXIS",
    companyName: "Pacific Axis Logistics",
    status: "active",
    location: "San Antonio, Chile",
    languages: ["English", "Spanish"],
    supportedServices: ["ocean_fcl", "origin_handling"],
    cargoCapabilityTags: ["agricultural", "dry_cargo", "food_grade"],
    issueFlags: []
  },
  {
    id: "agent-southern-gate",
    tenantId: DEMO_TENANT_ID,
    externalKey: "CL-SOUTHERN-GATE",
    companyName: "Southern Gate Forwarding",
    status: "active",
    location: "Santiago, Chile",
    languages: ["English", "Spanish"],
    supportedServices: ["ocean_fcl", "origin_handling", "reefer"],
    cargoCapabilityTags: ["coffee", "reefer", "agricultural"],
    issueFlags: []
  },
  {
    id: "agent-pearl-river",
    tenantId: DEMO_TENANT_ID,
    externalKey: "CN-PEARL-RIVER",
    companyName: "Pearl River Forwarding",
    status: "active",
    location: "Shenzhen, China",
    languages: ["English", "Mandarin"],
    supportedServices: ["ocean_fcl", "origin_handling"],
    cargoCapabilityTags: ["electronics", "general_cargo", "dry_cargo"],
    issueFlags: []
  },
  {
    id: "agent-ningbo-harbor",
    tenantId: DEMO_TENANT_ID,
    externalKey: "CN-NINGBO-HARBOR",
    companyName: "Ningbo Harbor Partners",
    status: "active",
    location: "Ningbo, China",
    languages: ["English", "Mandarin"],
    supportedServices: ["ocean_fcl", "origin_handling", "customs_coordination"],
    cargoCapabilityTags: ["electronics", "industrial", "dry_cargo"],
    issueFlags: []
  },
  {
    id: "agent-dragon-gate",
    tenantId: DEMO_TENANT_ID,
    externalKey: "CN-DRAGON-GATE",
    companyName: "Dragon Gate Logistics",
    status: "active",
    location: "Shanghai, China",
    languages: ["English", "Mandarin"],
    supportedServices: ["ocean_fcl", "origin_handling"],
    cargoCapabilityTags: ["general_cargo", "dry_cargo"],
    issueFlags: ["documentation delays"]
  },
  {
    id: "agent-shenzhen-meridian",
    tenantId: DEMO_TENANT_ID,
    externalKey: "CN-SHENZHEN-MERIDIAN",
    companyName: "Shenzhen Meridian Cargo",
    status: "active",
    location: "Shenzhen, China",
    languages: ["English", "Mandarin"],
    supportedServices: ["ocean_fcl", "origin_handling", "special_handling"],
    cargoCapabilityTags: ["electronics", "special_handling", "dry_cargo"],
    issueFlags: []
  },
  {
    id: "agent-eastbridge",
    tenantId: DEMO_TENANT_ID,
    externalKey: "CN-EASTBRIDGE",
    companyName: "EastBridge Ocean",
    status: "active",
    location: "Shanghai, China",
    languages: ["English", "Mandarin"],
    supportedServices: ["ocean_fcl", "origin_handling"],
    cargoCapabilityTags: ["industrial", "general_cargo"],
    issueFlags: []
  },
  {
    id: "agent-red-lantern",
    tenantId: DEMO_TENANT_ID,
    externalKey: "CN-RED-LANTERN",
    companyName: "Red Lantern Freight",
    status: "inactive",
    location: "Ningbo, China",
    languages: ["English", "Mandarin"],
    supportedServices: ["ocean_fcl"],
    cargoCapabilityTags: ["general_cargo"],
    issueFlags: ["suspended onboarding"]
  },
  {
    id: "agent-durban-bluewater",
    tenantId: DEMO_TENANT_ID,
    externalKey: "ZA-DURBAN-BLUEWATER",
    companyName: "Durban Bluewater Logistics",
    status: "active",
    location: "Durban, South Africa",
    languages: ["English", "Zulu"],
    supportedServices: ["ocean_fcl", "origin_handling"],
    cargoCapabilityTags: ["automotive", "dry_cargo"],
    issueFlags: []
  },
  {
    id: "agent-cape-gateway",
    tenantId: DEMO_TENANT_ID,
    externalKey: "ZA-CAPE-GATEWAY",
    companyName: "Cape Gateway Freight",
    status: "active",
    location: "Cape Town, South Africa",
    languages: ["English", "Afrikaans"],
    supportedServices: ["ocean_fcl", "origin_handling", "reefer"],
    cargoCapabilityTags: ["reefer", "temperature_controlled", "food_grade"],
    issueFlags: []
  },
  {
    id: "agent-table-bay-cold",
    tenantId: DEMO_TENANT_ID,
    externalKey: "ZA-TABLE-BAY-COLD",
    companyName: "Table Bay Cold Chain",
    status: "active",
    location: "Cape Town, South Africa",
    languages: ["English", "Afrikaans"],
    supportedServices: ["ocean_fcl", "reefer", "origin_handling"],
    cargoCapabilityTags: ["reefer", "temperature_controlled", "pharma"],
    issueFlags: []
  },
  {
    id: "agent-umkhonto-marine",
    tenantId: DEMO_TENANT_ID,
    externalKey: "ZA-UMKHONTO",
    companyName: "Umkhonto Marine Services",
    status: "active",
    location: "Durban, South Africa",
    languages: ["English", "Zulu"],
    supportedServices: ["ocean_fcl", "origin_handling"],
    cargoCapabilityTags: ["automotive", "industrial", "dry_cargo"],
    issueFlags: ["recent incomplete surcharge"]
  }
];

const metric = (
  agentId: string,
  responseRate: number,
  medianResponseMinutes: number,
  quoteCompletenessRate: number,
  managerSelectedCount: number,
  sampleSize: number
): AgentMetric => ({
  id: `metric-${agentId}`,
  tenantId: DEMO_TENANT_ID,
  agentId,
  responseRate,
  medianResponseMinutes,
  quoteCompletenessRate,
  managerSelectedCount,
  sampleSize,
  lastObservedAt: observedAt
});

export const metricsSeed: AgentMetric[] = [
  metric("agent-andes-link", 94, 35, 88, 14, 31),
  metric("agent-pacific-axis", 91, 49, 71, 9, 27),
  metric("agent-southern-gate", 87, 72, 92, 11, 26),
  metric("agent-pearl-river", 93, 38, 90, 16, 44),
  metric("agent-ningbo-harbor", 96, 31, 93, 20, 52),
  metric("agent-dragon-gate", 82, 96, 76, 8, 35),
  metric("agent-shenzhen-meridian", 89, 58, 86, 10, 29),
  metric("agent-eastbridge", 85, 65, 82, 7, 28),
  metric("agent-red-lantern", 77, 110, 68, 2, 12),
  metric("agent-durban-bluewater", 95, 41, 91, 18, 39),
  metric("agent-cape-gateway", 92, 44, 89, 15, 34),
  metric("agent-table-bay-cold", 88, 57, 94, 13, 31),
  metric("agent-umkhonto-marine", 83, 85, 78, 6, 24)
];

const coverage = (
  agentId: string,
  side: AgentCoverage["side"],
  country: string,
  city: string,
  port: string,
  idSuffix: string
): AgentCoverage => ({
  id: `coverage-${agentId}-${idSuffix}`,
  tenantId: DEMO_TENANT_ID,
  agentId,
  side,
  country,
  city,
  port,
  transportMode: "ocean_fcl",
  serviceType: "origin_handling"
});

export const coveragesSeed: AgentCoverage[] = [
  coverage("agent-andes-link", "origin", "Chile", "Valparaiso", "Valparaiso", "valparaiso"),
  coverage("agent-andes-link", "origin", "Chile", "San Antonio", "San Antonio", "san-antonio"),
  coverage("agent-pacific-axis", "origin", "Chile", "San Antonio", "San Antonio", "san-antonio"),
  coverage("agent-pacific-axis", "origin", "Chile", "Valparaiso", "Valparaiso", "valparaiso"),
  coverage("agent-southern-gate", "origin", "Chile", "Valparaiso", "Valparaiso", "valparaiso"),
  coverage("agent-pearl-river", "origin", "China", "Shenzhen", "Shenzhen", "shenzhen"),
  coverage("agent-pearl-river", "origin", "China", "Ningbo", "Ningbo", "ningbo"),
  coverage("agent-ningbo-harbor", "origin", "China", "Ningbo", "Ningbo", "ningbo"),
  coverage("agent-dragon-gate", "origin", "China", "Shanghai", "Shanghai", "shanghai"),
  coverage("agent-dragon-gate", "origin", "China", "Ningbo", "Ningbo", "ningbo"),
  coverage("agent-shenzhen-meridian", "origin", "China", "Shenzhen", "Shenzhen", "shenzhen"),
  coverage("agent-eastbridge", "origin", "China", "Shanghai", "Shanghai", "shanghai"),
  coverage("agent-red-lantern", "origin", "China", "Ningbo", "Ningbo", "ningbo"),
  coverage("agent-durban-bluewater", "origin", "South Africa", "Durban", "Durban", "durban"),
  coverage("agent-cape-gateway", "origin", "South Africa", "Cape Town", "Cape Town", "cape-town"),
  coverage("agent-table-bay-cold", "origin", "South Africa", "Cape Town", "Cape Town", "cape-town"),
  coverage("agent-umkhonto-marine", "origin", "South Africa", "Durban", "Durban", "durban")
];

export const scenariosSeed: RFQScenario[] = [
  {
    id: "scenario-cl-001",
    tenantId: DEMO_TENANT_ID,
    scenarioKey: "CL-001",
    title: "Hero Chile coffee RFQ",
    routeLabel: "Valparaiso -> Gdansk",
    purpose: ["Email extraction", "Chile agent matching", "Partial comparison", "Late Excel rate", "Quote v2 decision"],
    initialStatus: "collecting"
  },
  {
    id: "scenario-cn-001",
    tenantId: DEMO_TENANT_ID,
    scenarioKey: "CN-001",
    title: "Chat conflict scenario",
    routeLabel: "Ningbo -> Hamburg",
    purpose: ["Latest-message resolution", "Conflict detection", "China agent matching"],
    initialStatus: "clarification_required"
  },
  {
    id: "scenario-za-001",
    tenantId: DEMO_TENANT_ID,
    scenarioKey: "ZA-001",
    title: "Quick capture scenario",
    routeLabel: "Durban -> Constanta",
    purpose: ["Call-note capture", "Missing-field detection", "South Africa matching"],
    initialStatus: "ready_for_routing"
  },
  {
    id: "scenario-za-002",
    tenantId: DEMO_TENANT_ID,
    scenarioKey: "ZA-002",
    title: "Manual Review scenario",
    routeLabel: "Cape Town -> Gdansk",
    purpose: ["Manual Review triggers", "Risk retention", "Manager override"],
    initialStatus: "manual_review"
  }
];

export const inputsSeed: RFQInput[] = [
  {
    id: "input-cl-001",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-cl-001",
    sourceType: "email",
    rawText:
      "Subject: Ocean quote request - Valparaiso to Gdansk\n\nPlease quote 2 x 40HC from Valparaiso, Chile to Gdansk, Poland. Cargo is green coffee beans, FOB. Cargo expected next week. Please include origin charges and advise free days."
  },
  {
    id: "input-cn-001",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-cn-001",
    sourceType: "conversation",
    rawText:
      "09:12 Customer: Need Ningbo to Hamburg for 1 x 40HC electronics.\n09:18 Desk: Please confirm quantity and ready date.\n09:24 Customer: Please revise to 2 x 40HC. Ready date still not fixed.\n09:37 Customer: Incoterms are FOB Ningbo."
  },
  {
    id: "input-za-001",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-za-001",
    sourceType: "call_notes",
    rawText:
      "Customer called: 2 x 20DC from Durban to Constanta. FOB. Automotive spare parts. Cargo expected next month. Need freight indication by Friday."
  },
  {
    id: "input-za-002",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-za-002",
    sourceType: "email",
    rawText:
      "Please quote Cape Town to Gdansk for temperature-controlled products. We do not yet have temperature range, ventilation requirements, cargo classification, or cargo-ready date."
  }
];

export const casesSeed: RFQCase[] = [
  {
    id: "case-cl-001",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-cl-001",
    inputId: "input-cl-001",
    requestNumber: "RFQ-2026-041",
    sourceType: "email",
    status: "collecting",
    originCountry: "Chile",
    originCity: "Valparaiso",
    originPort: "Valparaiso",
    destinationCountry: "Poland",
    destinationCity: "Gdansk",
    destinationPort: "Gdansk",
    containerType: "40HC",
    containerQuantity: 2,
    cargoDescription: "Green coffee beans",
    packaging: "Bags on pallets",
    grossWeight: null,
    volume: null,
    incoterms: "FOB",
    serviceScope: "Origin handling and ocean FCL",
    cargoReadyInfo: "Expected next week",
    cargoReadyDate: null,
    quotationDeadline: "Today 16:00",
    responseCutoff: "Today 14:45",
    specialRequirements: "Confirm free days and major charges",
    cargoFlags: [],
    riskFlags: ["cargo_ready_date_missing"],
    manualReviewReason: null,
    clarificationDraft:
      "Please confirm cargo-ready date, gross weight per container, and whether any fumigation or food-grade documentation is required.",
    selectedRateOptionId: null
  },
  {
    id: "case-cn-001",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-cn-001",
    inputId: "input-cn-001",
    requestNumber: "RFQ-2026-042",
    sourceType: "conversation",
    status: "clarification_required",
    originCountry: "China",
    originCity: "Ningbo",
    originPort: "Ningbo",
    destinationCountry: "Germany",
    destinationCity: "Hamburg",
    destinationPort: "Hamburg",
    containerType: "40HC",
    containerQuantity: 2,
    cargoDescription: "Electronics",
    packaging: null,
    grossWeight: null,
    volume: null,
    incoterms: "FOB",
    serviceScope: "Origin handling and ocean FCL",
    cargoReadyInfo: "Not fixed",
    cargoReadyDate: null,
    quotationDeadline: "Tomorrow",
    responseCutoff: "Tomorrow 12:00",
    specialRequirements: null,
    cargoFlags: [],
    riskFlags: ["cargo_ready_date_missing", "weight_missing"],
    manualReviewReason: null,
    clarificationDraft:
      "Please confirm cargo-ready date, gross weight, packaging, and whether the electronics require humidity-control handling.",
    selectedRateOptionId: null
  },
  {
    id: "case-za-001",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-za-001",
    inputId: "input-za-001",
    requestNumber: "RFQ-2026-043",
    sourceType: "call_notes",
    status: "ready_for_routing",
    originCountry: "South Africa",
    originCity: "Durban",
    originPort: "Durban",
    destinationCountry: "Romania",
    destinationCity: "Constanta",
    destinationPort: "Constanta",
    containerType: "20DC",
    containerQuantity: 2,
    cargoDescription: "Automotive spare parts",
    packaging: null,
    grossWeight: null,
    volume: null,
    incoterms: "FOB",
    serviceScope: "Origin handling and ocean FCL",
    cargoReadyInfo: "Expected next month",
    cargoReadyDate: null,
    quotationDeadline: "Friday",
    responseCutoff: "Thursday 16:00",
    specialRequirements: null,
    cargoFlags: [],
    riskFlags: ["exact_ready_date_missing", "weight_missing"],
    manualReviewReason: null,
    clarificationDraft:
      "Please confirm exact cargo-ready date, gross weight, packing type, and whether stackability restrictions apply.",
    selectedRateOptionId: null
  },
  {
    id: "case-za-002",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-za-002",
    inputId: "input-za-002",
    requestNumber: "RFQ-2026-044",
    sourceType: "email",
    status: "manual_review",
    originCountry: "South Africa",
    originCity: "Cape Town",
    originPort: "Cape Town",
    destinationCountry: "Poland",
    destinationCity: "Gdansk",
    destinationPort: "Gdansk",
    containerType: null,
    containerQuantity: null,
    cargoDescription: "Temperature-controlled products",
    packaging: null,
    grossWeight: null,
    volume: null,
    incoterms: null,
    serviceScope: null,
    cargoReadyInfo: null,
    cargoReadyDate: null,
    quotationDeadline: "Pending",
    responseCutoff: "Pending",
    specialRequirements: "Temperature-controlled cargo",
    cargoFlags: ["temperature_controlled", "reefer"],
    riskFlags: [
      "temperature_range_missing",
      "reefer_type_missing",
      "ventilation_missing",
      "cargo_classification_missing",
      "cargo_ready_date_missing"
    ],
    manualReviewReason:
      "This RFQ requires operational validation before agent requests can be sent.",
    clarificationDraft:
      "Please confirm required temperature range, reefer container type, ventilation requirements, cargo classification, cargo-ready date, and Incoterms.",
    selectedRateOptionId: null
  }
];

const field = (
  caseId: string,
  sourceOrder: number,
  fieldName: string,
  value: string | null,
  verificationStatus: RFQFieldAssertion["verificationStatus"],
  confidence: RFQFieldAssertion["confidence"],
  evidence: string
): RFQFieldAssertion => ({
  id: `field-${caseId}-${sourceOrder}-${fieldName.replaceAll("_", "-")}`,
  tenantId: DEMO_TENANT_ID,
  caseId,
  fieldName,
  value,
  verificationStatus,
  confidence,
  evidence,
  sourceOrder
});

export const fieldAssertionsSeed: RFQFieldAssertion[] = [
  field("case-cl-001", 1, "origin_port", "Valparaiso", "Confirmed", "High", "from Valparaiso, Chile"),
  field("case-cl-001", 2, "destination_port", "Gdansk", "Confirmed", "High", "to Gdansk, Poland"),
  field("case-cl-001", 3, "container_quantity", "2", "Confirmed", "High", "2 x 40HC"),
  field("case-cl-001", 4, "container_type", "40HC", "Confirmed", "High", "2 x 40HC"),
  field("case-cl-001", 5, "cargo_description", "Green coffee beans", "Confirmed", "High", "Cargo is green coffee beans"),
  field("case-cl-001", 6, "incoterms", "FOB", "Confirmed", "High", "FOB"),
  field("case-cl-001", 7, "cargo_ready_date", null, "Needs confirmation", "Medium", "Cargo expected next week"),
  field("case-cl-001", 8, "gross_weight", null, "Missing", "Low", "No weight found in source email"),
  field("case-cn-001", 1, "container_quantity", "1", "Needs confirmation", "Medium", "09:12 Customer: 1 x 40HC"),
  field("case-cn-001", 2, "container_quantity", "2", "Confirmed", "High", "09:24 Customer: Please revise to 2 x 40HC"),
  field("case-cn-001", 3, "origin_port", "Ningbo", "Confirmed", "High", "Need Ningbo to Hamburg"),
  field("case-cn-001", 4, "destination_port", "Hamburg", "Confirmed", "High", "Need Ningbo to Hamburg"),
  field("case-cn-001", 5, "cargo_ready_date", null, "Missing", "High", "Ready date still not fixed"),
  field("case-cn-001", 6, "gross_weight", null, "Missing", "Low", "No weight found in chat"),
  field("case-za-001", 1, "origin_port", "Durban", "Confirmed", "High", "from Durban"),
  field("case-za-001", 2, "destination_port", "Constanta", "Confirmed", "High", "to Constanta"),
  field("case-za-001", 3, "container_quantity", "2", "Confirmed", "High", "2 x 20DC"),
  field("case-za-001", 4, "container_type", "20DC", "Confirmed", "High", "2 x 20DC"),
  field("case-za-001", 5, "cargo_ready_date", null, "Needs confirmation", "Medium", "expected next month"),
  field("case-za-002", 1, "cargo_description", "Temperature-controlled products", "Confirmed", "High", "temperature-controlled products"),
  field("case-za-002", 2, "temperature_range", null, "Missing", "High", "We do not yet have temperature range"),
  field("case-za-002", 3, "reefer_container_type", null, "Missing", "High", "No reefer container type provided"),
  field("case-za-002", 4, "ventilation_requirements", null, "Missing", "High", "ventilation requirements not available"),
  field("case-za-002", 5, "incoterms", null, "Missing", "Medium", "No Incoterm found")
];

export const roundsSeed: RFQRound[] = [
  {
    id: "round-cl-001-a",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    status: "enough_responses",
    responseCutoff: "Today 14:45",
    selectedAgentIds: ["agent-andes-link", "agent-pacific-axis", "agent-southern-gate"]
  }
];

export const requestsSeed: AgentRequest[] = [
  {
    id: "request-cl-andes",
    tenantId: DEMO_TENANT_ID,
    roundId: "round-cl-001-a",
    caseId: "case-cl-001",
    agentId: "agent-andes-link",
    status: "Rate received",
    sentAt: new Date("2026-06-28T09:00:00.000Z")
  },
  {
    id: "request-cl-pacific",
    tenantId: DEMO_TENANT_ID,
    roundId: "round-cl-001-a",
    caseId: "case-cl-001",
    agentId: "agent-pacific-axis",
    status: "Incomplete rate",
    sentAt: new Date("2026-06-28T09:00:00.000Z")
  },
  {
    id: "request-cl-southern",
    tenantId: DEMO_TENANT_ID,
    roundId: "round-cl-001-a",
    caseId: "case-cl-001",
    agentId: "agent-southern-gate",
    status: "Awaiting response",
    sentAt: new Date("2026-06-28T09:00:00.000Z")
  }
];

export const attachmentsSeed: Attachment[] = [
  {
    id: "attachment-cl-southern-xlsx",
    tenantId: DEMO_TENANT_ID,
    storageBucket: "synthetic-rate-sheets",
    objectKey: "guided-demo/cl-001/southern-gate-late-rate.xlsx",
    fileName: "southern-gate-late-rate.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sourceKind: "guided_demo_rate_sheet",
    localPath: "fixtures/synthetic-rate-sheets/southern-gate-late-rate.xlsx"
  }
];

export const replyPlansSeed: ReplyPlan[] = [
  {
    id: "reply-plan-cl-andes",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-cl-001",
    caseId: "case-cl-001",
    agentId: "agent-andes-link",
    delaySeconds: 10,
    sourceType: "structured_email",
    attachmentId: null,
    rawSourceReference: "Structured email reply with all major charges disclosed",
    behavior: "complete_comparable",
    statusAfterProcessing: "Rate received"
  },
  {
    id: "reply-plan-cl-pacific",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-cl-001",
    caseId: "case-cl-001",
    agentId: "agent-pacific-axis",
    delaySeconds: 25,
    sourceType: "messy_text",
    attachmentId: null,
    rawSourceReference: "Messy free-text reply missing validity and destination charges",
    behavior: "incomplete_follow_up",
    statusAfterProcessing: "Incomplete rate"
  },
  {
    id: "reply-plan-cl-southern",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-cl-001",
    caseId: "case-cl-001",
    agentId: "agent-southern-gate",
    delaySeconds: 75,
    sourceType: "xlsx",
    attachmentId: "attachment-cl-southern-xlsx",
    rawSourceReference: "Synthetic Excel rate sheet",
    behavior: "late_after_quote_v1",
    statusAfterProcessing: "Late response"
  }
];

export const rateRepliesSeed: RateReply[] = [
  {
    id: "reply-cl-andes",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    agentId: "agent-andes-link",
    sourceType: "structured_email",
    rawText:
      "Andes Link Freight quote: Maersk, Valparaiso to Gdansk, 2 x 40HC. Ocean freight USD 3900 total, origin charges USD 420, documentation USD 90, destination charges USD 240. Transit 38 days. Valid until 2026-07-15. 14 free days.",
    processingResult: "validated",
    attachmentId: null,
    receivedAt
  },
  {
    id: "reply-cl-pacific",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    agentId: "agent-pacific-axis",
    sourceType: "messy_text",
    rawText:
      "Can do VALP-GDN coffee 2x40HC, freight maybe 3.75k all in ocean side, MSC, 44 days, local charges to follow, validity not sure.",
    processingResult: "needs_follow_up",
    attachmentId: null,
    receivedAt: new Date("2026-06-28T09:58:00.000Z")
  }
];

export const initialRateOptionsSeed: RateOption[] = [
  {
    id: "rate-cl-andes",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    agentId: "agent-andes-link",
    replyId: "reply-cl-andes",
    sourceType: "structured_email",
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
    conditions: ["Subject to equipment availability", "Coffee cargo declared as non-DG"],
    knownTotal: 4650,
    completenessScore: 96,
    reviewRequired: false,
    status: "Recommended",
    sourceEvidence: "Major charges, validity, free days and transit time disclosed in structured email."
  },
  {
    id: "rate-cl-pacific",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    agentId: "agent-pacific-axis",
    replyId: "reply-cl-pacific",
    sourceType: "messy_text",
    oceanFreight: 3750,
    currency: "USD",
    rateUnit: "2 x 40HC",
    originCharges: 0,
    documentationFee: 0,
    destinationCharges: 0,
    shippingLine: "MSC",
    transitDays: 44,
    route: "Valparaiso -> Gdansk",
    validityDate: "Missing",
    freeDays: 7,
    inclusions: ["Ocean freight only"],
    exclusions: ["Origin charges not disclosed", "Destination charges not disclosed", "Validity missing"],
    conditions: ["Follow-up required before customer quote"],
    knownTotal: 3750,
    completenessScore: 54,
    reviewRequired: true,
    status: "Incomplete",
    sourceEvidence: "Reply says local charges to follow and validity not sure."
  }
];

export const southernGateLateReply: RateReply = {
  id: "reply-cl-southern-late",
  tenantId: DEMO_TENANT_ID,
  caseId: "case-cl-001",
  agentId: "agent-southern-gate",
  sourceType: "xlsx",
  rawText: "Loaded from synthetic Excel fixture: southern-gate-late-rate.xlsx",
  processingResult: "validated",
  attachmentId: "attachment-cl-southern-xlsx",
  receivedAt: new Date("2026-06-28T10:16:00.000Z")
};

export const southernGateLateRate: RateOption = {
  id: "rate-cl-southern-late",
  tenantId: DEMO_TENANT_ID,
  caseId: "case-cl-001",
  agentId: "agent-southern-gate",
  replyId: "reply-cl-southern-late",
  sourceType: "xlsx",
  oceanFreight: 3650,
  currency: "USD",
  rateUnit: "2 x 40HC",
  originCharges: 390,
  documentationFee: 70,
  destinationCharges: 220,
  shippingLine: "CMA CGM",
  transitDays: 41,
  route: "Valparaiso -> Gdansk",
  validityDate: "2026-07-18",
  freeDays: 10,
  inclusions: ["Ocean freight", "Origin charges", "Documentation", "Destination handling"],
  exclusions: ["Customs duties", "Demurrage after free days"],
  conditions: ["Subject to vessel space confirmation", "Late rate received after Quote v1"],
  knownTotal: 4330,
  completenessScore: 91,
  reviewRequired: false,
  status: "Late response",
  sourceEvidence: "Synthetic Excel sheet disclosed freight, local charges, validity and free days."
};

export const activityEventsSeed = [
  {
    id: "event-cl-created",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    eventType: "input_received",
    title: "Customer email parsed",
    body: "FreightPilot extracted lane, container count, cargo and Incoterm from the email.",
    createdAt: new Date("2026-06-28T08:45:00.000Z")
  },
  {
    id: "event-cl-clarification",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    eventType: "clarification",
    title: "Clarification drafted",
    body: "Cargo-ready date and gross weight remain unresolved, but RFQ can proceed with manager oversight.",
    createdAt: new Date("2026-06-28T08:47:00.000Z")
  },
  {
    id: "event-cl-approved",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    eventType: "approval",
    title: "RFQ round approved",
    body: "Manager selected Andes Link Freight, Pacific Axis Logistics and Southern Gate Forwarding.",
    createdAt: new Date("2026-06-28T09:00:00.000Z")
  },
  {
    id: "event-cl-andes",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    eventType: "rate_received",
    title: "Complete rate received",
    body: "Andes Link Freight returned a comparable structured email rate after 10 simulated seconds.",
    createdAt: new Date("2026-06-28T09:40:00.000Z")
  },
  {
    id: "event-cl-pacific",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    eventType: "rate_incomplete",
    title: "Incomplete rate received",
    body: "Pacific Axis reply lacks validity and destination charges. Follow-up is required.",
    createdAt: new Date("2026-06-28T09:58:00.000Z")
  },
  {
    id: "event-cn-conflict",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cn-001",
    eventType: "chat_resolution",
    title: "Latest explicit quantity selected",
    body: "The customer revised quantity from 1 x 40HC to 2 x 40HC in a later message. Ready date remains missing.",
    createdAt: new Date("2026-06-28T08:30:00.000Z")
  },
  {
    id: "event-za-ready",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-za-001",
    eventType: "quick_capture",
    title: "Call notes converted to RFQ",
    body: "Core lane and cargo fields are available. Exact ready date and weight need confirmation.",
    createdAt: new Date("2026-06-28T08:15:00.000Z")
  },
  {
    id: "event-za-manual-review",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-za-002",
    eventType: "manual_review",
    title: "Manual review required",
    body: "Temperature-controlled cargo lacks temperature range, reefer type, ventilation requirements and cargo-ready date.",
    createdAt: new Date("2026-06-28T08:10:00.000Z")
  }
];

export const demoSeed: DemoSeed = {
  tenant: { id: DEMO_TENANT_ID, name: "FreightPilot Demo Tenant" },
  agents: agentsSeed,
  coverages: coveragesSeed,
  metrics: metricsSeed,
  scenarios: scenariosSeed,
  inputs: inputsSeed,
  cases: casesSeed,
  fieldAssertions: fieldAssertionsSeed,
  rounds: roundsSeed,
  requests: requestsSeed,
  attachments: attachmentsSeed,
  replyPlans: replyPlansSeed,
  rateReplies: rateRepliesSeed,
  rateOptions: initialRateOptionsSeed,
  quotes: [],
  quoteVersions: [],
  activityEvents: activityEventsSeed
};
