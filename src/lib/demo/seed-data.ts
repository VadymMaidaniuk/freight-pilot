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
    location: "Вальпараисо, Чили",
    languages: ["Английский", "Испанский"],
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
    location: "Сан-Антонио, Чили",
    languages: ["Английский", "Испанский"],
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
    location: "Сантьяго, Чили",
    languages: ["Английский", "Испанский"],
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
    location: "Шэньчжэнь, Китай",
    languages: ["Английский", "Китайский"],
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
    location: "Нинбо, Китай",
    languages: ["Английский", "Китайский"],
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
    location: "Шанхай, Китай",
    languages: ["Английский", "Китайский"],
    supportedServices: ["ocean_fcl", "origin_handling"],
    cargoCapabilityTags: ["general_cargo", "dry_cargo"],
    issueFlags: ["задержки по документам"]
  },
  {
    id: "agent-shenzhen-meridian",
    tenantId: DEMO_TENANT_ID,
    externalKey: "CN-SHENZHEN-MERIDIAN",
    companyName: "Shenzhen Meridian Cargo",
    status: "active",
    location: "Шэньчжэнь, Китай",
    languages: ["Английский", "Китайский"],
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
    location: "Шанхай, Китай",
    languages: ["Английский", "Китайский"],
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
    location: "Нинбо, Китай",
    languages: ["Английский", "Китайский"],
    supportedServices: ["ocean_fcl"],
    cargoCapabilityTags: ["general_cargo"],
    issueFlags: ["приостановлено подключение"]
  },
  {
    id: "agent-durban-bluewater",
    tenantId: DEMO_TENANT_ID,
    externalKey: "ZA-DURBAN-BLUEWATER",
    companyName: "Durban Bluewater Logistics",
    status: "active",
    location: "Дурбан, ЮАР",
    languages: ["Английский", "Зулу"],
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
    location: "Кейптаун, ЮАР",
    languages: ["Английский", "Африкаанс"],
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
    location: "Кейптаун, ЮАР",
    languages: ["Английский", "Африкаанс"],
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
    location: "Дурбан, ЮАР",
    languages: ["Английский", "Зулу"],
    supportedServices: ["ocean_fcl", "origin_handling"],
    cargoCapabilityTags: ["automotive", "industrial", "dry_cargo"],
    issueFlags: ["недавно неполный сбор"]
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
    title: "Ключевой RFQ по кофе из Чили",
    routeLabel: "Valparaiso -> Gdansk",
    purpose: ["Извлечение из письма", "Подбор агентов в Чили", "Частичное сравнение", "Поздняя Excel-ставка", "Решение по Quote v2"],
    initialStatus: "collecting"
  },
  {
    id: "scenario-cn-001",
    tenantId: DEMO_TENANT_ID,
    scenarioKey: "CN-001",
    title: "Сценарий конфликта в чате",
    routeLabel: "Ningbo -> Hamburg",
    purpose: ["Разрешение по последнему сообщению", "Обнаружение конфликта", "Подбор агентов в Китае"],
    initialStatus: "clarification_required"
  },
  {
    id: "scenario-za-001",
    tenantId: DEMO_TENANT_ID,
    scenarioKey: "ZA-001",
    title: "Сценарий быстрого захвата",
    routeLabel: "Durban -> Constanta",
    purpose: ["Захват заметок звонка", "Поиск недостающих полей", "Подбор агентов в ЮАР"],
    initialStatus: "ready_for_routing"
  },
  {
    id: "scenario-za-002",
    tenantId: DEMO_TENANT_ID,
    scenarioKey: "ZA-002",
    title: "Сценарий ручной проверки",
    routeLabel: "Cape Town -> Gdansk",
    purpose: ["Триггеры ручной проверки", "Сохранение рисков", "Решение менеджера"],
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
      "Тема: Запрос морской ставки - Valparaiso to Gdansk\n\nПожалуйста, рассчитайте 2 x 40HC из Valparaiso, Chile в Gdansk, Poland. Груз - зеленые кофейные зерна, FOB. Груз ожидается на следующей неделе. Включите сборы отправления и укажите свободные дни."
  },
  {
    id: "input-cn-001",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-cn-001",
    sourceType: "conversation",
    rawText:
      "09:12 Клиент: Нужно Ningbo - Hamburg для 1 x 40HC, электроника.\n09:18 Деск: Подтвердите количество и дату готовности.\n09:24 Клиент: Пожалуйста, измените на 2 x 40HC. Дата готовности пока не фиксирована.\n09:37 Клиент: Incoterms - FOB Ningbo."
  },
  {
    id: "input-za-001",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-za-001",
    sourceType: "call_notes",
    rawText:
      "Звонок клиента: 2 x 20DC из Durban в Constanta. FOB. Автозапчасти. Груз ожидается в следующем месяце. Нужна индикативная ставка до пятницы."
  },
  {
    id: "input-za-002",
    tenantId: DEMO_TENANT_ID,
    scenarioId: "scenario-za-002",
    sourceType: "email",
    rawText:
      "Пожалуйста, рассчитайте Cape Town to Gdansk для температурного груза. У нас пока нет температурного диапазона, требований к вентиляции, классификации груза и даты готовности."
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
    cargoDescription: "Зеленые кофейные зерна",
    packaging: "Мешки на паллетах",
    grossWeight: null,
    volume: null,
    incoterms: "FOB",
    serviceScope: "Обработка в порту отправления и морской FCL",
    cargoReadyInfo: "Ожидается на следующей неделе",
    cargoReadyDate: null,
    quotationDeadline: "Сегодня 16:00",
    responseCutoff: "Сегодня 14:45",
    specialRequirements: "Подтвердить свободные дни и основные сборы",
    cargoFlags: [],
    riskFlags: ["cargo_ready_date_missing"],
    manualReviewReason: null,
    clarificationDraft:
      "Пожалуйста, подтвердите дату готовности груза, вес брутто на контейнер и нужна ли фумигация или документация для пищевого груза.",
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
    cargoDescription: "Электроника",
    packaging: null,
    grossWeight: null,
    volume: null,
    incoterms: "FOB",
    serviceScope: "Обработка в порту отправления и морской FCL",
    cargoReadyInfo: "Не фиксирована",
    cargoReadyDate: null,
    quotationDeadline: "Завтра",
    responseCutoff: "Завтра 12:00",
    specialRequirements: null,
    cargoFlags: [],
    riskFlags: ["cargo_ready_date_missing", "weight_missing"],
    manualReviewReason: null,
    clarificationDraft:
      "Пожалуйста, подтвердите дату готовности груза, вес брутто, упаковку и требуется ли контроль влажности для электроники.",
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
    cargoDescription: "Автозапчасти",
    packaging: null,
    grossWeight: null,
    volume: null,
    incoterms: "FOB",
    serviceScope: "Обработка в порту отправления и морской FCL",
    cargoReadyInfo: "Ожидается в следующем месяце",
    cargoReadyDate: null,
    quotationDeadline: "Пятница",
    responseCutoff: "Четверг 16:00",
    specialRequirements: null,
    cargoFlags: [],
    riskFlags: ["exact_ready_date_missing", "weight_missing"],
    manualReviewReason: null,
    clarificationDraft:
      "Пожалуйста, подтвердите точную дату готовности груза, вес брутто, тип упаковки и наличие ограничений по штабелированию.",
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
    cargoDescription: "Температурный груз",
    packaging: null,
    grossWeight: null,
    volume: null,
    incoterms: null,
    serviceScope: null,
    cargoReadyInfo: null,
    cargoReadyDate: null,
    quotationDeadline: "Ожидает уточнения",
    responseCutoff: "Ожидает уточнения",
    specialRequirements: "Температурный груз",
    cargoFlags: ["temperature_controlled", "reefer"],
    riskFlags: [
      "temperature_range_missing",
      "reefer_type_missing",
      "ventilation_missing",
      "cargo_classification_missing",
      "cargo_ready_date_missing"
    ],
    manualReviewReason:
      "Этот RFQ требует операционной проверки перед отправкой запросов агентам.",
    clarificationDraft:
      "Пожалуйста, подтвердите температурный диапазон, тип рефконтейнера, требования к вентиляции, классификацию груза, дату готовности и Incoterms.",
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
  field("case-cl-001", 1, "origin_port", "Valparaiso", "Confirmed", "High", "из Valparaiso, Chile"),
  field("case-cl-001", 2, "destination_port", "Gdansk", "Confirmed", "High", "в Gdansk, Poland"),
  field("case-cl-001", 3, "container_quantity", "2", "Confirmed", "High", "2 x 40HC"),
  field("case-cl-001", 4, "container_type", "40HC", "Confirmed", "High", "2 x 40HC"),
  field("case-cl-001", 5, "cargo_description", "Зеленые кофейные зерна", "Confirmed", "High", "Груз - зеленые кофейные зерна"),
  field("case-cl-001", 6, "incoterms", "FOB", "Confirmed", "High", "FOB"),
  field("case-cl-001", 7, "cargo_ready_date", null, "Needs confirmation", "Medium", "Груз ожидается на следующей неделе"),
  field("case-cl-001", 8, "gross_weight", null, "Missing", "Low", "Вес в исходном письме не найден"),
  field("case-cn-001", 1, "container_quantity", "1", "Needs confirmation", "Medium", "09:12 Клиент: 1 x 40HC"),
  field("case-cn-001", 2, "container_quantity", "2", "Confirmed", "High", "09:24 Клиент: Пожалуйста, измените на 2 x 40HC"),
  field("case-cn-001", 3, "origin_port", "Ningbo", "Confirmed", "High", "Нужно Ningbo - Hamburg"),
  field("case-cn-001", 4, "destination_port", "Hamburg", "Confirmed", "High", "Нужно Ningbo - Hamburg"),
  field("case-cn-001", 5, "cargo_ready_date", null, "Missing", "High", "Дата готовности пока не фиксирована"),
  field("case-cn-001", 6, "gross_weight", null, "Missing", "Low", "Вес в чате не найден"),
  field("case-za-001", 1, "origin_port", "Durban", "Confirmed", "High", "из Durban"),
  field("case-za-001", 2, "destination_port", "Constanta", "Confirmed", "High", "в Constanta"),
  field("case-za-001", 3, "container_quantity", "2", "Confirmed", "High", "2 x 20DC"),
  field("case-za-001", 4, "container_type", "20DC", "Confirmed", "High", "2 x 20DC"),
  field("case-za-001", 5, "cargo_ready_date", null, "Needs confirmation", "Medium", "ожидается в следующем месяце"),
  field("case-za-002", 1, "cargo_description", "Температурный груз", "Confirmed", "High", "температурный груз"),
  field("case-za-002", 2, "temperature_range", null, "Missing", "High", "Температурный диапазон пока отсутствует"),
  field("case-za-002", 3, "reefer_container_type", null, "Missing", "High", "Тип рефконтейнера не указан"),
  field("case-za-002", 4, "ventilation_requirements", null, "Missing", "High", "Требования к вентиляции отсутствуют"),
  field("case-za-002", 5, "incoterms", null, "Missing", "Medium", "Incoterm не найден")
];

export const roundsSeed: RFQRound[] = [
  {
    id: "round-cl-001-a",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    status: "enough_responses",
    responseCutoff: "Сегодня 14:45",
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
    rawSourceReference: "Структурированный ответ письмом со всеми основными сборами",
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
    rawSourceReference: "Неструктурированный текстовый ответ без срока действия и сборов назначения",
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
    rawSourceReference: "Синтетический Excel-файл со ставкой",
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
      "Andes Link Freight: Maersk, Valparaiso to Gdansk, 2 x 40HC. Морской фрахт USD 3900 всего, сборы отправления USD 420, документация USD 90, сборы назначения USD 240. Транзит 38 дн. Действует до 2026-07-15. 14 свободных дней.",
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
      "Можем VALP-GDN кофе 2x40HC, фрахт примерно 3.75k по морской части, MSC, 44 дня, локальные сборы позже, срок действия не уверен.",
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
    inclusions: ["Морской фрахт", "Сборы в порту отправления", "Документация", "Обработка в порту назначения"],
    exclusions: ["Таможенные пошлины", "Демередж после свободных дней"],
    conditions: ["При условии наличия оборудования", "Кофейный груз заявлен как не-DG"],
    knownTotal: 4650,
    completenessScore: 96,
    reviewRequired: false,
    status: "Recommended",
    sourceEvidence: "Основные сборы, срок действия, свободные дни и транзитное время раскрыты в структурированном письме."
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
    inclusions: ["Только морской фрахт"],
    exclusions: ["Сборы отправления не раскрыты", "Сборы назначения не раскрыты", "Срок действия отсутствует"],
    conditions: ["Нужен дополнительный запрос перед клиентской котировкой"],
    knownTotal: 3750,
    completenessScore: 54,
    reviewRequired: true,
    status: "Incomplete",
    sourceEvidence: "В ответе сказано, что локальные сборы будут позже, а срок действия не подтвержден."
  }
];

export const southernGateLateReply: RateReply = {
  id: "reply-cl-southern-late",
  tenantId: DEMO_TENANT_ID,
  caseId: "case-cl-001",
  agentId: "agent-southern-gate",
  sourceType: "xlsx",
  rawText: "Загружено из синтетической Excel-фикстуры: southern-gate-late-rate.xlsx",
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
  inclusions: ["Морской фрахт", "Сборы в порту отправления", "Документация", "Обработка в порту назначения"],
  exclusions: ["Таможенные пошлины", "Демередж после свободных дней"],
  conditions: ["При условии подтверждения места на судне", "Поздняя ставка получена после Quote v1"],
  knownTotal: 4330,
  completenessScore: 91,
  reviewRequired: false,
  status: "Late response",
  sourceEvidence: "Синтетический Excel-файл раскрыл фрахт, локальные сборы, срок действия и свободные дни."
};

export const activityEventsSeed = [
  {
    id: "event-cl-created",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    eventType: "input_received",
    title: "Письмо клиента разобрано",
    body: "FreightPilot извлек маршрут, количество контейнеров, груз и Incoterm из письма.",
    createdAt: new Date("2026-06-28T08:45:00.000Z")
  },
  {
    id: "event-cl-clarification",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    eventType: "clarification",
    title: "Черновик уточнения подготовлен",
    body: "Дата готовности груза и вес брутто остаются неуточненными, но RFQ может продолжаться под контролем менеджера.",
    createdAt: new Date("2026-06-28T08:47:00.000Z")
  },
  {
    id: "event-cl-approved",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    eventType: "approval",
    title: "RFQ-раунд согласован",
    body: "Менеджер выбрал Andes Link Freight, Pacific Axis Logistics и Southern Gate Forwarding.",
    createdAt: new Date("2026-06-28T09:00:00.000Z")
  },
  {
    id: "event-cl-andes",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    eventType: "rate_received",
    title: "Получена полная ставка",
    body: "Andes Link Freight вернул сопоставимую структурированную ставку письмом через 10 имитированных секунд.",
    createdAt: new Date("2026-06-28T09:40:00.000Z")
  },
  {
    id: "event-cl-pacific",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cl-001",
    eventType: "rate_incomplete",
    title: "Получена неполная ставка",
    body: "В ответе Pacific Axis нет срока действия и сборов назначения. Требуется дополнительный запрос.",
    createdAt: new Date("2026-06-28T09:58:00.000Z")
  },
  {
    id: "event-cn-conflict",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-cn-001",
    eventType: "chat_resolution",
    title: "Выбрано последнее явное количество",
    body: "Клиент изменил количество с 1 x 40HC на 2 x 40HC в более позднем сообщении. Дата готовности все еще отсутствует.",
    createdAt: new Date("2026-06-28T08:30:00.000Z")
  },
  {
    id: "event-za-ready",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-za-001",
    eventType: "quick_capture",
    title: "Заметки звонка превращены в RFQ",
    body: "Базовые поля маршрута и груза доступны. Точная дата готовности и вес требуют подтверждения.",
    createdAt: new Date("2026-06-28T08:15:00.000Z")
  },
  {
    id: "event-za-manual-review",
    tenantId: DEMO_TENANT_ID,
    caseId: "case-za-002",
    eventType: "manual_review",
    title: "Требуется ручная проверка",
    body: "Для температурного груза отсутствуют температурный диапазон, тип рефконтейнера, требования к вентиляции и дата готовности.",
    createdAt: new Date("2026-06-28T08:10:00.000Z")
  }
];

export const demoSeed: DemoSeed = {
  tenant: { id: DEMO_TENANT_ID, name: "Демо-тенант FreightPilot" },
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
