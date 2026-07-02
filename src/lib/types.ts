export type SourceType = "email" | "conversation" | "call_notes" | "manual_paste";
export type VerificationStatus = "Confirmed" | "Needs confirmation" | "Missing" | "Conflict detected";
export type ConfidenceLevel = "High" | "Medium" | "Low";
export type CaseStatus =
  | "draft"
  | "clarification_required"
  | "ready_for_routing"
  | "approval_pending"
  | "collecting"
  | "decision_ready"
  | "quote_draft_created"
  | "closed"
  | "manual_review";

export type RoundStatus =
  | "draft"
  | "sent"
  | "collecting"
  | "enough_responses"
  | "deadline_reached"
  | "quote_draft_created"
  | "closed";

export type AgentRequestStatus =
  | "Draft"
  | "Sent"
  | "Awaiting response"
  | "Rate received"
  | "Incomplete rate"
  | "Clarification requested"
  | "Declined"
  | "Overdue"
  | "Late response";

export type CargoFlag =
  | "dangerous_goods"
  | "temperature_controlled"
  | "reefer"
  | "out_of_gauge"
  | "special_handling";

export type Agent = {
  id: string;
  tenantId: string;
  externalKey: string;
  companyName: string;
  status: "active" | "inactive";
  location: string;
  languages: string[];
  supportedServices: string[];
  cargoCapabilityTags: string[];
  issueFlags: string[];
};

export type AgentCoverage = {
  id: string;
  tenantId: string;
  agentId: string;
  side: "origin" | "destination" | "route";
  country: string;
  city: string;
  port: string;
  transportMode: string;
  serviceType: string;
};

export type AgentMetric = {
  id: string;
  tenantId: string;
  agentId: string;
  responseRate: number;
  medianResponseMinutes: number;
  quoteCompletenessRate: number;
  managerSelectedCount: number;
  sampleSize: number;
  lastObservedAt: Date;
};

export type RFQScenario = {
  id: string;
  tenantId: string;
  scenarioKey: string;
  title: string;
  routeLabel: string;
  purpose: string[];
  initialStatus: CaseStatus;
};

export type RFQInput = {
  id: string;
  tenantId: string;
  scenarioId: string;
  sourceType: SourceType;
  rawText: string;
};

export type RFQCase = {
  id: string;
  tenantId: string;
  scenarioId: string;
  inputId: string;
  requestNumber: string;
  sourceType: SourceType;
  status: CaseStatus;
  originCountry: string | null;
  originCity: string | null;
  originPort: string | null;
  destinationCountry: string | null;
  destinationCity: string | null;
  destinationPort: string | null;
  containerType: string | null;
  containerQuantity: number | null;
  cargoDescription: string | null;
  packaging: string | null;
  grossWeight: string | null;
  volume: string | null;
  incoterms: string | null;
  serviceScope: string | null;
  cargoReadyInfo: string | null;
  cargoReadyDate: string | null;
  quotationDeadline: string | null;
  responseCutoff: string | null;
  specialRequirements: string | null;
  cargoFlags: CargoFlag[];
  riskFlags: string[];
  manualReviewReason: string | null;
  clarificationDraft: string | null;
  selectedRateOptionId: string | null;
};

export type RFQFieldAssertion = {
  id: string;
  tenantId: string;
  caseId: string;
  fieldName: string;
  value: string | null;
  verificationStatus: VerificationStatus;
  confidence: ConfidenceLevel;
  evidence: string;
  sourceOrder: number;
};

export type RFQRound = {
  id: string;
  tenantId: string;
  caseId: string;
  status: RoundStatus;
  responseCutoff: string;
  selectedAgentIds: string[];
};

export type AgentRequest = {
  id: string;
  tenantId: string;
  roundId: string;
  caseId: string;
  agentId: string;
  status: AgentRequestStatus;
  sentAt: Date | null;
};

export type ReplyPlan = {
  id: string;
  tenantId: string;
  scenarioId: string;
  caseId: string;
  agentId: string;
  delaySeconds: number;
  sourceType: "structured_email" | "messy_text" | "manual_paste" | "xlsx";
  attachmentId: string | null;
  rawSourceReference: string;
  behavior: string;
  statusAfterProcessing: AgentRequestStatus;
};

export type Attachment = {
  id: string;
  tenantId: string;
  storageBucket: string;
  objectKey: string;
  fileName: string;
  mimeType: string;
  sourceKind: string;
  localPath: string | null;
};

export type RateReply = {
  id: string;
  tenantId: string;
  caseId: string;
  agentId: string;
  sourceType: string;
  rawText: string;
  processingResult: string;
  attachmentId: string | null;
  receivedAt: Date;
};

export type RateOption = {
  id: string;
  tenantId: string;
  caseId: string;
  agentId: string;
  replyId: string | null;
  sourceType: string;
  oceanFreight: number;
  currency: string;
  rateUnit: string;
  originCharges: number;
  documentationFee: number;
  destinationCharges: number;
  shippingLine: string;
  transitDays: number;
  route: string;
  validityDate: string;
  freeDays: number;
  inclusions: string[];
  exclusions: string[];
  conditions: string[];
  knownTotal: number;
  completenessScore: number;
  reviewRequired: boolean;
  status: "Recommended" | "Comparable" | "Needs review" | "Incomplete" | "Late response" | "Not selected";
  sourceEvidence: string;
};

export type Quote = {
  id: string;
  tenantId: string;
  caseId: string;
  selectedRateOptionId: string;
  currentVersion: number;
  status: string;
};

export type QuoteVersion = {
  id: string;
  tenantId: string;
  quoteId: string;
  caseId: string;
  versionNumber: number;
  selectedRateOptionId: string;
  commercialAdjustment: number;
  finalCustomerPrice: number;
  draftText: string;
  createdAt: Date;
};

export type ActivityEvent = {
  id: string;
  tenantId: string;
  caseId: string;
  eventType: string;
  title: string;
  body: string;
  createdAt: Date;
};

export type DemoSeed = {
  tenant: { id: string; name: string };
  agents: Agent[];
  coverages: AgentCoverage[];
  metrics: AgentMetric[];
  scenarios: RFQScenario[];
  inputs: RFQInput[];
  cases: RFQCase[];
  fieldAssertions: RFQFieldAssertion[];
  rounds: RFQRound[];
  requests: AgentRequest[];
  attachments: Attachment[];
  replyPlans: ReplyPlan[];
  rateReplies: RateReply[];
  rateOptions: RateOption[];
  quotes: Quote[];
  quoteVersions: QuoteVersion[];
  activityEvents: ActivityEvent[];
};

export type WorkspaceSummary = {
  cases: RFQCase[];
  scenarios: RFQScenario[];
  inputs: RFQInput[];
  quotes: Quote[];
  quoteVersions: QuoteVersion[];
  rateOptions: RateOption[];
  agents: Agent[];
};

export type CaseSnapshot = {
  case: RFQCase;
  scenario: RFQScenario;
  input: RFQInput;
  fields: RFQFieldAssertion[];
  agents: Agent[];
  coverages: AgentCoverage[];
  metrics: AgentMetric[];
  round: RFQRound | null;
  requests: AgentRequest[];
  replyPlans: ReplyPlan[];
  rateReplies: RateReply[];
  rateOptions: RateOption[];
  quotes: Quote[];
  quoteVersions: QuoteVersion[];
  activityEvents: ActivityEvent[];
  attachments: Attachment[];
};
