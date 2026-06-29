import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  externalKey: text("external_key").notNull(),
  companyName: text("company_name").notNull(),
  status: text("status").notNull(),
  location: text("location").notNull(),
  languages: text("languages").array().notNull(),
  supportedServices: text("supported_services").array().notNull(),
  cargoCapabilityTags: text("cargo_capability_tags").array().notNull(),
  issueFlags: text("issue_flags").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const agentCoverages = pgTable("agent_coverages", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  side: text("side").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  port: text("port").notNull(),
  transportMode: text("transport_mode").notNull(),
  serviceType: text("service_type").notNull()
});

export const agentMetrics = pgTable("agent_metrics", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  responseRate: integer("response_rate").notNull(),
  medianResponseMinutes: integer("median_response_minutes").notNull(),
  quoteCompletenessRate: integer("quote_completeness_rate").notNull(),
  managerSelectedCount: integer("manager_selected_count").notNull(),
  sampleSize: integer("sample_size").notNull(),
  lastObservedAt: timestamp("last_observed_at", { withTimezone: true }).notNull()
});

export const rfqScenarios = pgTable("rfq_scenarios", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  scenarioKey: text("scenario_key").notNull(),
  title: text("title").notNull(),
  routeLabel: text("route_label").notNull(),
  purpose: text("purpose").array().notNull(),
  initialStatus: text("initial_status").notNull()
});

export const rfqInputs = pgTable("rfq_inputs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  scenarioId: text("scenario_id")
    .notNull()
    .references(() => rfqScenarios.id, { onDelete: "cascade" }),
  sourceType: text("source_type").notNull(),
  rawText: text("raw_text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const rfqCases = pgTable("rfq_cases", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  scenarioId: text("scenario_id")
    .notNull()
    .references(() => rfqScenarios.id, { onDelete: "cascade" }),
  inputId: text("input_id").references(() => rfqInputs.id, { onDelete: "set null" }),
  requestNumber: text("request_number").notNull(),
  sourceType: text("source_type").notNull(),
  status: text("status").notNull(),
  originCountry: text("origin_country"),
  originCity: text("origin_city"),
  originPort: text("origin_port"),
  destinationCountry: text("destination_country"),
  destinationCity: text("destination_city"),
  destinationPort: text("destination_port"),
  containerType: text("container_type"),
  containerQuantity: integer("container_quantity"),
  cargoDescription: text("cargo_description"),
  packaging: text("packaging"),
  grossWeight: text("gross_weight"),
  volume: text("volume"),
  incoterms: text("incoterms"),
  serviceScope: text("service_scope"),
  cargoReadyInfo: text("cargo_ready_info"),
  cargoReadyDate: text("cargo_ready_date"),
  quotationDeadline: text("quotation_deadline"),
  responseCutoff: text("response_cutoff"),
  specialRequirements: text("special_requirements"),
  cargoFlags: text("cargo_flags").array().notNull(),
  riskFlags: text("risk_flags").array().notNull(),
  manualReviewReason: text("manual_review_reason"),
  clarificationDraft: text("clarification_draft"),
  selectedRateOptionId: text("selected_rate_option_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const rfqFieldAssertions = pgTable("rfq_field_assertions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  caseId: text("case_id")
    .notNull()
    .references(() => rfqCases.id, { onDelete: "cascade" }),
  fieldName: text("field_name").notNull(),
  value: text("value"),
  verificationStatus: text("verification_status").notNull(),
  confidence: text("confidence").notNull(),
  evidence: text("evidence").notNull(),
  sourceOrder: integer("source_order").notNull()
});

export const rfqRounds = pgTable("rfq_rounds", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  caseId: text("case_id")
    .notNull()
    .references(() => rfqCases.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  responseCutoff: text("response_cutoff").notNull(),
  selectedAgentIds: text("selected_agent_ids").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const agentRequests = pgTable("agent_requests", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  roundId: text("round_id")
    .notNull()
    .references(() => rfqRounds.id, { onDelete: "cascade" }),
  caseId: text("case_id")
    .notNull()
    .references(() => rfqCases.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true })
});

export const attachments = pgTable("attachments", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  storageBucket: text("storage_bucket").notNull(),
  objectKey: text("object_key").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sourceKind: text("source_kind").notNull(),
  localPath: text("local_path"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const replyPlans = pgTable("reply_plans", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  scenarioId: text("scenario_id")
    .notNull()
    .references(() => rfqScenarios.id, { onDelete: "cascade" }),
  caseId: text("case_id")
    .notNull()
    .references(() => rfqCases.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  delaySeconds: integer("delay_seconds").notNull(),
  sourceType: text("source_type").notNull(),
  attachmentId: text("attachment_id").references(() => attachments.id, { onDelete: "set null" }),
  rawSourceReference: text("raw_source_reference").notNull(),
  behavior: text("behavior").notNull(),
  statusAfterProcessing: text("status_after_processing").notNull()
});

export const rateReplies = pgTable("rate_replies", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  caseId: text("case_id")
    .notNull()
    .references(() => rfqCases.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  sourceType: text("source_type").notNull(),
  rawText: text("raw_text").notNull(),
  processingResult: text("processing_result").notNull(),
  attachmentId: text("attachment_id").references(() => attachments.id, { onDelete: "set null" }),
  receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull()
});

export const rateOptions = pgTable("rate_options", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  caseId: text("case_id")
    .notNull()
    .references(() => rfqCases.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  replyId: text("reply_id").references(() => rateReplies.id, { onDelete: "set null" }),
  sourceType: text("source_type").notNull(),
  oceanFreight: numeric("ocean_freight", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  rateUnit: text("rate_unit").notNull(),
  originCharges: numeric("origin_charges", { precision: 12, scale: 2 }).notNull(),
  documentationFee: numeric("documentation_fee", { precision: 12, scale: 2 }).notNull(),
  destinationCharges: numeric("destination_charges", { precision: 12, scale: 2 }).notNull(),
  shippingLine: text("shipping_line").notNull(),
  transitDays: integer("transit_days").notNull(),
  route: text("route").notNull(),
  validityDate: text("validity_date").notNull(),
  freeDays: integer("free_days").notNull(),
  inclusions: jsonb("inclusions").$type<string[]>().notNull(),
  exclusions: jsonb("exclusions").$type<string[]>().notNull(),
  conditions: jsonb("conditions").$type<string[]>().notNull(),
  knownTotal: numeric("known_total", { precision: 12, scale: 2 }).notNull(),
  completenessScore: integer("completeness_score").notNull(),
  reviewRequired: boolean("review_required").notNull(),
  status: text("status").notNull(),
  sourceEvidence: text("source_evidence").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const quotes = pgTable("quotes", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  caseId: text("case_id")
    .notNull()
    .references(() => rfqCases.id, { onDelete: "cascade" }),
  selectedRateOptionId: text("selected_rate_option_id").notNull(),
  currentVersion: integer("current_version").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const quoteVersions = pgTable("quote_versions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  quoteId: text("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  caseId: text("case_id")
    .notNull()
    .references(() => rfqCases.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  selectedRateOptionId: text("selected_rate_option_id").notNull(),
  commercialAdjustment: numeric("commercial_adjustment", { precision: 12, scale: 2 }).notNull(),
  finalCustomerPrice: numeric("final_customer_price", { precision: 12, scale: 2 }).notNull(),
  draftText: text("draft_text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const activityEvents = pgTable("activity_events", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  caseId: text("case_id")
    .notNull()
    .references(() => rfqCases.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
