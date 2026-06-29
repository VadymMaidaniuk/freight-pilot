import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, hasDatabaseUrl } from "@/db/client";
import {
  activityEvents,
  agentCoverages,
  agentMetrics,
  agentRequests,
  agents,
  attachments,
  quoteVersions,
  quotes,
  rateOptions,
  rateReplies,
  replyPlans,
  rfqCases,
  rfqFieldAssertions,
  rfqInputs,
  rfqRounds,
  rfqScenarios,
  tenants
} from "@/db/schema";
import { AIValidationFallbackError, createAIService, type RateExtraction, type RFQExtraction } from "@/lib/ai";
import { demoSeed, southernGateLateRate, southernGateLateReply } from "@/lib/demo/seed-data";
import { canSendAgentRFQ, evaluateManualReview } from "@/lib/domain/field-rules";
import { buildQuoteDraft } from "@/lib/domain/quotes";
import { heuristicExtractRFQ } from "@/lib/domain/rfq-heuristics";
import type {
  Agent,
  AgentCoverage,
  AgentMetric,
  AgentRequest,
  Attachment,
  CaseSnapshot,
  QuoteVersion,
  RFQCase,
  RFQFieldAssertion,
  RFQInput,
  RFQRound,
  RFQScenario,
  RateOption,
  RateReply,
  ReplyPlan,
  WorkspaceSummary
} from "@/lib/types";
import { getFallbackStore, resetFallbackStore } from "./fallback-store";

const tenantId = process.env.DEMO_TENANT_ID ?? "demo_freightpilot";

function touchWorkspace() {
  revalidatePath("/workspace");
  revalidatePath("/workspace/new");
  revalidatePath("/workspace/approvals");
  revalidatePath("/workspace/quotes");
  revalidatePath("/workspace/agents");
}

function asSourceType(value: string): RFQInput["sourceType"] {
  if (value === "conversation" || value === "messenger") return "conversation";
  if (value === "call_notes") return "call_notes";
  return "email";
}

function deriveInitialStatus(rfqCase: RFQCase): RFQCase["status"] {
  if (evaluateManualReview(rfqCase).required) return "manual_review";
  return canSendAgentRFQ(rfqCase).allowed ? "ready_for_routing" : "clarification_required";
}

function buildDynamicCaseRecords(input: {
  sourceType: RFQInput["sourceType"];
  rawText: string;
  extraction: RFQExtraction;
}) {
  const idSuffix = randomUUID().slice(0, 8);
  const scenarioId = `scenario-live-${idSuffix}`;
  const inputId = `input-live-${idSuffix}`;
  const caseId = `case-live-${idSuffix}`;
  const now = new Date();
  const requestNumber = `RFQ-LIVE-${idSuffix.toUpperCase()}`;
  const fields = input.extraction.fields;
  const routeLabel = `${fields.originPort ?? fields.originCity ?? "Origin pending"} -> ${fields.destinationPort ?? fields.destinationCity ?? "Destination pending"}`;
  const serviceScope =
    fields.originPort && fields.destinationPort && fields.containerType && fields.containerQuantity
      ? "Origin handling and ocean FCL"
      : null;

  const scenario: RFQScenario = {
    id: scenarioId,
    tenantId,
    scenarioKey: `LIVE-${idSuffix.toUpperCase()}`,
    title: `Live RFQ · ${routeLabel}`,
    routeLabel,
    purpose: ["Live pasted input", "LLM extraction", "Database agent matching", "Simulated RFQ round"],
    initialStatus: "draft"
  };

  const rfqInput: RFQInput = {
    id: inputId,
    tenantId,
    scenarioId,
    sourceType: input.sourceType,
    rawText: input.rawText
  };

  const rfqCase: RFQCase = {
    id: caseId,
    tenantId,
    scenarioId,
    inputId,
    requestNumber,
    sourceType: input.sourceType,
    status: "draft",
    originCountry: fields.originCountry,
    originCity: fields.originCity,
    originPort: fields.originPort,
    destinationCountry: fields.destinationCountry,
    destinationCity: fields.destinationCity,
    destinationPort: fields.destinationPort,
    containerType: fields.containerType,
    containerQuantity: fields.containerQuantity,
    cargoDescription: fields.cargoDescription,
    packaging: fields.packaging,
    grossWeight: fields.grossWeight,
    volume: fields.volume,
    incoterms: fields.incoterms,
    serviceScope,
    cargoReadyInfo: fields.cargoReadyDate ? fields.cargoReadyDate : null,
    cargoReadyDate: fields.cargoReadyDate,
    quotationDeadline: fields.quotationDeadline ?? "Pending",
    responseCutoff: "Demo cutoff +45 min",
    specialRequirements: fields.specialRequirements,
    cargoFlags: fields.cargoFlags,
    riskFlags: input.extraction.riskFlags,
    manualReviewReason: null,
    clarificationDraft: input.extraction.clarificationDraft,
    selectedRateOptionId: null
  };

  rfqCase.status = deriveInitialStatus(rfqCase);
  if (rfqCase.status === "manual_review") {
    rfqCase.manualReviewReason = "This RFQ requires operational validation before agent requests can be sent.";
  }

  const assertions: RFQFieldAssertion[] = input.extraction.assertions.map((assertion, index) => ({
    id: `field-${caseId}-${index + 1}-${assertion.fieldName.replaceAll("_", "-")}`,
    tenantId,
    caseId,
    fieldName: assertion.fieldName,
    value: assertion.value,
    verificationStatus: assertion.verificationStatus,
    confidence: assertion.confidence,
    evidence: assertion.evidence,
    sourceOrder: index + 1
  }));

  const events = [
    {
      id: `event-${caseId}-created`,
      tenantId,
      caseId,
      eventType: "live_input_created",
      title: "Live RFQ created",
      body: "Pasted input was extracted, validated and stored as a normal RFQ case.",
      createdAt: now
    },
    {
      id: `event-${caseId}-status`,
      tenantId,
      caseId,
      eventType: "workflow_state",
      title: `Initial state: ${rfqCase.status.replaceAll("_", " ")}`,
      body:
        rfqCase.status === "ready_for_routing"
          ? "Required routing fields are present. Agent shortlist can be reviewed."
          : "Some operational fields require clarification or manual validation before routing.",
      createdAt: now
    }
  ];

  return { scenario, rfqInput, rfqCase, assertions, events };
}

function buildSyntheticReply(input: { rfqCase: RFQCase; agent: Agent; index: number }) {
  const route = `${input.rfqCase.originPort ?? input.rfqCase.originCity} -> ${input.rfqCase.destinationPort ?? input.rfqCase.destinationCity}`;
  const origin = input.rfqCase.originCountry ?? "";
  const base = origin === "China" ? 2850 : origin === "South Africa" ? 3920 : origin === "Chile" ? 4550 : 3200;
  const oceanFreight = base + input.index * 180;
  const originCharges = 310 + input.index * 35;
  const documentationFee = 75;
  const destinationCharges = 240 + input.index * 25;
  const complete = input.index < 2;
  const shippingLine = input.index === 0 ? "Maersk" : input.index === 1 ? "CMA CGM" : "MSC";

  return {
    rawText: complete
      ? `${input.agent.companyName} quote for ${route}: ${input.rfqCase.containerQuantity} x ${input.rfqCase.containerType}. Ocean freight USD ${oceanFreight}, origin charges USD ${originCharges}, documentation USD ${documentationFee}, destination charges USD ${destinationCharges}. Shipping line ${shippingLine}. Transit ${origin === "China" ? 34 + input.index * 3 : 39 + input.index * 3} days. Validity 2026-07-20. Free days ${14 - input.index * 2}.`
      : `${input.agent.companyName} can support ${route}. Ocean side approx USD ${oceanFreight}, ${shippingLine}, transit to confirm, local charges and validity to follow.`,
    normalized: {
      agentName: input.agent.companyName,
      oceanFreight,
      currency: "USD",
      rateUnit: `${input.rfqCase.containerQuantity ?? 1} x ${input.rfqCase.containerType ?? "container"}`,
      originCharges: complete ? originCharges : 0,
      documentationFee: complete ? documentationFee : 0,
      destinationCharges: complete ? destinationCharges : 0,
      shippingLine,
      transitDays: origin === "China" ? 34 + input.index * 3 : 39 + input.index * 3,
      route,
      validityDate: complete ? "2026-07-20" : "Missing",
      freeDays: complete ? 14 - input.index * 2 : 0,
      inclusions: complete ? ["Ocean freight", "Origin charges", "Documentation", "Destination handling"] : ["Ocean freight indication"],
      exclusions: complete ? ["Customs duties", "Demurrage after free days"] : ["Origin charges not disclosed", "Destination charges not disclosed", "Validity missing"],
      conditions: complete ? ["Subject to equipment availability"] : ["Follow-up required before customer quote"],
      completenessScore: complete ? 94 - input.index * 4 : 48,
      reviewRequired: !complete,
      sourceEvidence: complete ? "Simulated reply disclosed major charges, validity and free days." : "Simulated reply is missing local charges and validity."
    } satisfies RateExtraction
  };
}

type DbRateOption = typeof rateOptions.$inferSelect;
type DbQuoteVersion = typeof quoteVersions.$inferSelect;

function normalizeRate(row: DbRateOption): RateOption {
  return {
    ...row,
    oceanFreight: Number(row.oceanFreight),
    originCharges: Number(row.originCharges),
    documentationFee: Number(row.documentationFee),
    destinationCharges: Number(row.destinationCharges),
    knownTotal: Number(row.knownTotal),
    inclusions: row.inclusions,
    exclusions: row.exclusions,
    conditions: row.conditions
  } as RateOption;
}

function normalizeQuoteVersion(row: DbQuoteVersion): QuoteVersion {
  return {
    ...row,
    commercialAdjustment: Number(row.commercialAdjustment),
    finalCustomerPrice: Number(row.finalCustomerPrice)
  };
}

function toRateInsertValue(rate: RateOption): typeof rateOptions.$inferInsert {
  return {
    ...rate,
    oceanFreight: rate.oceanFreight.toString(),
    originCharges: rate.originCharges.toString(),
    documentationFee: rate.documentationFee.toString(),
    destinationCharges: rate.destinationCharges.toString(),
    knownTotal: rate.knownTotal.toString()
  };
}

function toQuoteVersionInsertValue(version: QuoteVersion): typeof quoteVersions.$inferInsert {
  return {
    ...version,
    commercialAdjustment: version.commercialAdjustment.toString(),
    finalCustomerPrice: version.finalCustomerPrice.toString()
  };
}

export async function loadWorkspaceSummary(): Promise<WorkspaceSummary> {
  if (!hasDatabaseUrl()) {
    const store = getFallbackStore();
    return {
      cases: store.cases,
      scenarios: store.scenarios,
      inputs: store.inputs,
      quotes: store.quotes,
      quoteVersions: store.quoteVersions,
      rateOptions: store.rateOptions,
      agents: store.agents
    };
  }

  const db = getDb();
  const [caseRows, scenarioRows, inputRows, quoteRows, versionRows, rateRows, agentRows] = await Promise.all([
    db.select().from(rfqCases).where(eq(rfqCases.tenantId, tenantId)),
    db.select().from(rfqScenarios).where(eq(rfqScenarios.tenantId, tenantId)),
    db.select().from(rfqInputs).where(eq(rfqInputs.tenantId, tenantId)),
    db.select().from(quotes).where(eq(quotes.tenantId, tenantId)),
    db.select().from(quoteVersions).where(eq(quoteVersions.tenantId, tenantId)),
    db.select().from(rateOptions).where(eq(rateOptions.tenantId, tenantId)),
    db.select().from(agents).where(eq(agents.tenantId, tenantId))
  ]);

  return {
    cases: caseRows as unknown as RFQCase[],
    scenarios: scenarioRows as unknown as RFQScenario[],
    inputs: inputRows as unknown as RFQInput[],
    quotes: quoteRows,
    quoteVersions: versionRows.map(normalizeQuoteVersion),
    rateOptions: rateRows.map(normalizeRate),
    agents: agentRows as unknown as Agent[]
  };
}

export async function loadCaseSnapshot(caseId: string): Promise<CaseSnapshot | null> {
  if (!hasDatabaseUrl()) {
    const store = getFallbackStore();
    const rfqCase = store.cases.find((item) => item.id === caseId);
    if (!rfqCase) return null;

    const scenario = store.scenarios.find((item) => item.id === rfqCase.scenarioId);
    const input = store.inputs.find((item) => item.id === rfqCase.inputId);
    if (!scenario || !input) return null;

    return {
      case: rfqCase,
      scenario,
      input,
      fields: store.fieldAssertions.filter((item) => item.caseId === caseId),
      agents: store.agents,
      coverages: store.coverages,
      metrics: store.metrics,
      round: store.rounds.find((item) => item.caseId === caseId) ?? null,
      requests: store.requests.filter((item) => item.caseId === caseId),
      replyPlans: store.replyPlans.filter((item) => item.caseId === caseId),
      rateReplies: store.rateReplies.filter((item) => item.caseId === caseId),
      rateOptions: store.rateOptions.filter((item) => item.caseId === caseId),
      quotes: store.quotes.filter((item) => item.caseId === caseId),
      quoteVersions: store.quoteVersions.filter((item) => item.caseId === caseId),
      activityEvents: store.activityEvents.filter((item) => item.caseId === caseId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      attachments: store.attachments
    };
  }

  const db = getDb();
  const [caseRow] = await db.select().from(rfqCases).where(and(eq(rfqCases.tenantId, tenantId), eq(rfqCases.id, caseId)));
  if (!caseRow) return null;

  const [scenarioRow] = await db.select().from(rfqScenarios).where(eq(rfqScenarios.id, caseRow.scenarioId));
  const [inputRow] = await db.select().from(rfqInputs).where(eq(rfqInputs.id, caseRow.inputId ?? ""));
  if (!scenarioRow || !inputRow) return null;

  const [fieldRows, agentRows, coverageRows, metricRows, roundRows, requestRows, planRows, replyRows, rateRows, quoteRows, versionRows, eventRows, attachmentRows] =
    await Promise.all([
      db.select().from(rfqFieldAssertions).where(eq(rfqFieldAssertions.caseId, caseId)),
      db.select().from(agents).where(eq(agents.tenantId, tenantId)),
      db.select().from(agentCoverages).where(eq(agentCoverages.tenantId, tenantId)),
      db.select().from(agentMetrics).where(eq(agentMetrics.tenantId, tenantId)),
      db.select().from(rfqRounds).where(eq(rfqRounds.caseId, caseId)),
      db.select().from(agentRequests).where(eq(agentRequests.caseId, caseId)),
      db.select().from(replyPlans).where(eq(replyPlans.caseId, caseId)),
      db.select().from(rateReplies).where(eq(rateReplies.caseId, caseId)),
      db.select().from(rateOptions).where(eq(rateOptions.caseId, caseId)),
      db.select().from(quotes).where(eq(quotes.caseId, caseId)),
      db.select().from(quoteVersions).where(eq(quoteVersions.caseId, caseId)),
      db.select().from(activityEvents).where(eq(activityEvents.caseId, caseId)),
      db.select().from(attachments).where(eq(attachments.tenantId, tenantId))
    ]);

  return {
    case: caseRow as unknown as RFQCase,
    scenario: scenarioRow as unknown as RFQScenario,
    input: inputRow as unknown as RFQInput,
    fields: fieldRows as unknown as RFQFieldAssertion[],
    agents: agentRows as unknown as Agent[],
    coverages: coverageRows as unknown as AgentCoverage[],
    metrics: metricRows as unknown as AgentMetric[],
    round: (roundRows[0] as unknown as RFQRound) ?? null,
    requests: requestRows as unknown as AgentRequest[],
    replyPlans: planRows as unknown as ReplyPlan[],
    rateReplies: replyRows as unknown as RateReply[],
    rateOptions: rateRows.map(normalizeRate),
    quotes: quoteRows,
    quoteVersions: versionRows.map(normalizeQuoteVersion),
    activityEvents: eventRows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    attachments: attachmentRows as unknown as Attachment[]
  };
}

export async function resetWorkspace() {
  if (!hasDatabaseUrl()) {
    resetFallbackStore();
    touchWorkspace();
    return;
  }

  const db = getDb();
  await db.delete(activityEvents).where(eq(activityEvents.tenantId, tenantId));
  await db.delete(quoteVersions).where(eq(quoteVersions.tenantId, tenantId));
  await db.delete(quotes).where(eq(quotes.tenantId, tenantId));
  await db.delete(rateOptions).where(eq(rateOptions.tenantId, tenantId));
  await db.delete(rateReplies).where(eq(rateReplies.tenantId, tenantId));
  await db.delete(replyPlans).where(eq(replyPlans.tenantId, tenantId));
  await db.delete(agentRequests).where(eq(agentRequests.tenantId, tenantId));
  await db.delete(rfqRounds).where(eq(rfqRounds.tenantId, tenantId));
  await db.delete(rfqFieldAssertions).where(eq(rfqFieldAssertions.tenantId, tenantId));
  await db.delete(rfqCases).where(eq(rfqCases.tenantId, tenantId));
  await db.delete(rfqInputs).where(eq(rfqInputs.tenantId, tenantId));
  await db.delete(rfqScenarios).where(eq(rfqScenarios.tenantId, tenantId));
  await insertOperationalSeed(db);
  touchWorkspace();
}

export async function createQuoteFromRate(caseId: string, rateOptionId: string, commercialAdjustment = 420) {
  const snapshot = await loadCaseSnapshot(caseId);
  if (!snapshot) throw new Error("RFQ case not found");

  const rate = snapshot.rateOptions.find((item) => item.id === rateOptionId);
  if (!rate) throw new Error("Rate option not found");

  const existingQuote = snapshot.quotes[0];
  const quoteId = existingQuote?.id ?? `quote-${caseId}`;
  const versionNumber = existingQuote ? existingQuote.currentVersion + 1 : 1;
  const versionId = `quote-version-${caseId}-v${versionNumber}`;
  const version = buildQuoteDraft({
    quoteId,
    quoteVersionId: versionId,
    rfqCase: snapshot.case,
    rate,
    versionNumber,
    commercialAdjustment
  });

  if (!hasDatabaseUrl()) {
    const store = getFallbackStore();
    if (!existingQuote) {
      store.quotes.push({
        id: quoteId,
        tenantId,
        caseId,
        selectedRateOptionId: rateOptionId,
        currentVersion: versionNumber,
        status: "Draft - commercial approval required"
      });
    } else {
      existingQuote.currentVersion = versionNumber;
      existingQuote.selectedRateOptionId = rateOptionId;
    }
    store.quoteVersions.push(version);
    const rfqCase = store.cases.find((item) => item.id === caseId);
    if (rfqCase) {
      rfqCase.status = "quote_draft_created";
      rfqCase.selectedRateOptionId = rateOptionId;
    }
    store.activityEvents.unshift({
      id: `event-${caseId}-quote-v${versionNumber}`,
      tenantId,
      caseId,
      eventType: "quote_version",
      title: `Quote v${versionNumber} created`,
      body: `Manager selected ${rate.shippingLine} rate. Existing quote versions were not modified.`,
      createdAt: new Date()
    });
    touchWorkspace();
    return version;
  }

  const db = getDb();
  if (!existingQuote) {
    await db.insert(quotes).values({
      id: quoteId,
      tenantId,
      caseId,
      selectedRateOptionId: rateOptionId,
      currentVersion: versionNumber,
      status: "Draft - commercial approval required"
    });
  } else {
    await db
      .update(quotes)
      .set({ currentVersion: versionNumber, selectedRateOptionId: rateOptionId })
      .where(eq(quotes.id, quoteId));
  }

  await db.insert(quoteVersions).values(toQuoteVersionInsertValue(version));
  await db
    .update(rfqCases)
    .set({ status: "quote_draft_created", selectedRateOptionId: rateOptionId, updatedAt: new Date() })
    .where(eq(rfqCases.id, caseId));
  await db.insert(activityEvents).values({
    id: `event-${caseId}-quote-v${versionNumber}`,
    tenantId,
    caseId,
    eventType: "quote_version",
    title: `Quote v${versionNumber} created`,
    body: `Manager selected ${rate.shippingLine} rate. Existing quote versions were not modified.`,
    createdAt: new Date()
  });

  touchWorkspace();
  return version;
}

export async function receiveLateExcelRate(caseId: string) {
  if (!hasDatabaseUrl()) {
    const store = getFallbackStore();
    if (!store.rateOptions.some((item) => item.id === southernGateLateRate.id)) {
      store.rateReplies.push({ ...southernGateLateReply, receivedAt: new Date(southernGateLateReply.receivedAt) });
      store.rateOptions.push({ ...southernGateLateRate });
      const request = store.requests.find((item) => item.id === "request-cl-southern");
      if (request) request.status = "Late response";
      store.activityEvents.unshift({
        id: `event-${caseId}-late-rate`,
        tenantId,
        caseId,
        eventType: "late_rate",
        title: "Late Excel rate received",
        body: "Southern Gate Forwarding returned a synthetic XLSX rate after Quote v1. Quote v1 was not modified.",
        createdAt: new Date()
      });
    }
    touchWorkspace();
    return;
  }

  const db = getDb();
  const existing = await db.select().from(rateOptions).where(eq(rateOptions.id, southernGateLateRate.id));
  if (existing.length > 0) return;

  await db.insert(rateReplies).values(southernGateLateReply);
  await db.insert(rateOptions).values(toRateInsertValue(southernGateLateRate));
  await db.update(agentRequests).set({ status: "Late response" }).where(eq(agentRequests.id, "request-cl-southern"));
  await db.insert(activityEvents).values({
    id: `event-${caseId}-late-rate`,
    tenantId,
    caseId,
    eventType: "late_rate",
    title: "Late Excel rate received",
    body: "Southern Gate Forwarding returned a synthetic XLSX rate after Quote v1. Quote v1 was not modified.",
    createdAt: new Date()
  });
  touchWorkspace();
}

export async function createRFQFromPastedInput(input: { sourceType: string; rawText: string }) {
  const sourceType = asSourceType(input.sourceType);
  let extraction: RFQExtraction;

  if ((process.env.AI_PROVIDER ?? "fixture") === "fixture") {
    extraction = heuristicExtractRFQ(sourceType, input.rawText);
  } else {
    const ai = createAIService();
    try {
      extraction = await ai.extractRFQ({ sourceType, rawText: input.rawText });
    } catch (error) {
      if (!(error instanceof AIValidationFallbackError)) {
        console.error(error);
      }
      extraction = heuristicExtractRFQ(sourceType, input.rawText);
    }
  }

  const heuristic = heuristicExtractRFQ(sourceType, input.rawText);
  if (!extraction.fields.originCountry && heuristic.fields.originCountry) extraction.fields.originCountry = heuristic.fields.originCountry;
  if (!extraction.fields.originCity && heuristic.fields.originCity) extraction.fields.originCity = heuristic.fields.originCity;
  if (!extraction.fields.originPort && heuristic.fields.originPort) extraction.fields.originPort = heuristic.fields.originPort;
  if (!extraction.fields.destinationCountry && heuristic.fields.destinationCountry) extraction.fields.destinationCountry = heuristic.fields.destinationCountry;
  if (!extraction.fields.destinationCity && heuristic.fields.destinationCity) extraction.fields.destinationCity = heuristic.fields.destinationCity;
  if (!extraction.fields.destinationPort && heuristic.fields.destinationPort) extraction.fields.destinationPort = heuristic.fields.destinationPort;
  if (!extraction.fields.containerType && heuristic.fields.containerType) extraction.fields.containerType = heuristic.fields.containerType;
  if (!extraction.fields.containerQuantity && heuristic.fields.containerQuantity) extraction.fields.containerQuantity = heuristic.fields.containerQuantity;
  if (!extraction.fields.cargoDescription && heuristic.fields.cargoDescription) extraction.fields.cargoDescription = heuristic.fields.cargoDescription;
  if (!extraction.fields.incoterms && heuristic.fields.incoterms) extraction.fields.incoterms = heuristic.fields.incoterms;
  if (extraction.assertions.length === 0) extraction.assertions = heuristic.assertions;

  const records = buildDynamicCaseRecords({ sourceType, rawText: input.rawText, extraction });

  if (!hasDatabaseUrl()) {
    const store = getFallbackStore();
    store.scenarios.push(records.scenario);
    store.inputs.push(records.rfqInput);
    store.cases.push(records.rfqCase);
    store.fieldAssertions.push(...records.assertions);
    store.activityEvents.unshift(...records.events);
    touchWorkspace();
    return records.rfqCase;
  }

  const db = getDb();
  await db.insert(rfqScenarios).values(records.scenario);
  await db.insert(rfqInputs).values(records.rfqInput);
  await db.insert(rfqCases).values(records.rfqCase);
  if (records.assertions.length > 0) {
    await db.insert(rfqFieldAssertions).values(records.assertions);
  }
  await db.insert(activityEvents).values(records.events);
  touchWorkspace();
  return records.rfqCase;
}

export async function processSimulatedAgentReplies(caseId: string) {
  const snapshot = await loadCaseSnapshot(caseId);
  if (!snapshot) throw new Error("RFQ case not found");
  if (snapshot.rateOptions.length > 0) return;

  const selectedRequests = snapshot.requests.slice(0, 3);
  if (selectedRequests.length === 0) throw new Error("No simulated agent requests found");

  const ai = (process.env.AI_PROVIDER ?? "fixture") === "fixture" ? null : createAIService();
  const replyRows: RateReply[] = [];
  const rateRows: RateOption[] = [];
  const now = new Date();

  for (const [index, request] of selectedRequests.entries()) {
    const agent = snapshot.agents.find((item) => item.id === request.agentId);
    if (!agent) continue;

    const synthetic = buildSyntheticReply({ rfqCase: snapshot.case, agent, index });
    let normalized: RateExtraction = synthetic.normalized;
    let processingResult = "validated_by_llm_or_safe_normalizer";

    if (ai) {
      try {
        normalized = await ai.normalizeRateReply({
          rawText: synthetic.rawText,
          sourceType: index === 2 ? "messy_text" : "email"
        });
      } catch {
        processingResult = "demo_safe_normalization";
      }
    } else {
      processingResult = "deterministic_fixture_normalization";
    }

    const replyId = `reply-${caseId}-${agent.id}`;
    const knownTotal =
      normalized.oceanFreight + normalized.originCharges + normalized.documentationFee + normalized.destinationCharges;
    const reviewRequired = normalized.reviewRequired || normalized.validityDate === "Missing" || knownTotal <= normalized.oceanFreight;

    replyRows.push({
      id: replyId,
      tenantId,
      caseId,
      agentId: agent.id,
      sourceType: index === 2 ? "messy_text" : "email",
      rawText: synthetic.rawText,
      processingResult,
      attachmentId: null,
      receivedAt: now
    });

    rateRows.push({
      id: `rate-${caseId}-${agent.id}`,
      tenantId,
      caseId,
      agentId: agent.id,
      replyId,
      sourceType: index === 2 ? "messy_text" : "email",
      oceanFreight: normalized.oceanFreight,
      currency: normalized.currency,
      rateUnit: normalized.rateUnit,
      originCharges: normalized.originCharges,
      documentationFee: normalized.documentationFee,
      destinationCharges: normalized.destinationCharges,
      shippingLine: normalized.shippingLine,
      transitDays: normalized.transitDays,
      route: normalized.route,
      validityDate: normalized.validityDate,
      freeDays: normalized.freeDays,
      inclusions: normalized.inclusions,
      exclusions: normalized.exclusions,
      conditions: normalized.conditions,
      knownTotal,
      completenessScore: normalized.completenessScore,
      reviewRequired,
      status: reviewRequired ? "Incomplete" : index === 0 ? "Recommended" : "Comparable",
      sourceEvidence: normalized.sourceEvidence
    });
  }

  if (!hasDatabaseUrl()) {
    const store = getFallbackStore();
    store.rateReplies.push(...replyRows);
    store.rateOptions.push(...rateRows);
    store.requests = store.requests.map((request) =>
      request.caseId === caseId
        ? {
            ...request,
            status: rateRows.some((rate) => rate.agentId === request.agentId && !rate.reviewRequired)
              ? "Rate received"
              : "Incomplete rate"
          }
        : request
    );
    const round = store.rounds.find((item) => item.caseId === caseId);
    if (round) round.status = "enough_responses";
    const rfqCase = store.cases.find((item) => item.id === caseId);
    if (rfqCase) rfqCase.status = "decision_ready";
    store.activityEvents.unshift({
      id: `event-${caseId}-simulated-replies`,
      tenantId,
      caseId,
      eventType: "rate_replies_processed",
      title: "Simulated agent replies processed",
      body: "Agent reply text was normalized, validated and converted into comparable rate options.",
      createdAt: now
    });
    touchWorkspace();
    return;
  }

  const db = getDb();
  if (replyRows.length > 0) await db.insert(rateReplies).values(replyRows);
  if (rateRows.length > 0) await db.insert(rateOptions).values(rateRows.map(toRateInsertValue));
  for (const request of selectedRequests) {
    const rate = rateRows.find((item) => item.agentId === request.agentId);
    await db
      .update(agentRequests)
      .set({ status: rate && !rate.reviewRequired ? "Rate received" : "Incomplete rate" })
      .where(eq(agentRequests.id, request.id));
  }
  await db.update(rfqRounds).set({ status: "enough_responses" }).where(eq(rfqRounds.caseId, caseId));
  await db.update(rfqCases).set({ status: "decision_ready", updatedAt: now }).where(eq(rfqCases.id, caseId));
  await db.insert(activityEvents).values({
    id: `event-${caseId}-simulated-replies`,
    tenantId,
    caseId,
    eventType: "rate_replies_processed",
    title: "Simulated agent replies processed",
    body: "Agent reply text was normalized, validated and converted into comparable rate options.",
    createdAt: now
  });
  touchWorkspace();
}

export async function approveForRouting(caseId: string, agentIds: string[]) {
  const roundId = `round-${caseId}-approved`;
  const selected = agentIds.slice(0, 3);

  if (!hasDatabaseUrl()) {
    const store = getFallbackStore();
    store.rounds = store.rounds.filter((round) => round.caseId !== caseId);
    store.requests = store.requests.filter((request) => request.caseId !== caseId);
    store.rounds.push({
      id: roundId,
      tenantId,
      caseId,
      status: "sent",
      responseCutoff: "Demo cutoff +45 min",
      selectedAgentIds: selected
    });
    store.requests.push(
      ...selected.map((agentId) => ({
        id: `request-${caseId}-${agentId}`,
        tenantId,
        roundId,
        caseId,
        agentId,
        status: "Awaiting response" as const,
        sentAt: new Date()
      }))
    );
    const rfqCase = store.cases.find((item) => item.id === caseId);
    if (rfqCase) rfqCase.status = "collecting";
    store.activityEvents.unshift({
      id: `event-${caseId}-rfq-sent`,
      tenantId,
      caseId,
      eventType: "rfq_sent",
      title: "RFQ drafts sent to agents",
      body: `Simulated sends created for ${selected.length} selected agents. No real external email was sent.`,
      createdAt: new Date()
    });
    touchWorkspace();
    return;
  }

  const db = getDb();
  await db.insert(rfqRounds).values({
    id: roundId,
    tenantId,
    caseId,
    status: "sent",
    responseCutoff: "Demo cutoff +45 min",
    selectedAgentIds: selected
  });
  await db.insert(agentRequests).values(
    selected.map((agentId) => ({
      id: `request-${caseId}-${agentId}`,
      tenantId,
      roundId,
      caseId,
      agentId,
      status: "Awaiting response",
      sentAt: new Date()
    }))
  );
  await db.update(rfqCases).set({ status: "collecting", updatedAt: new Date() }).where(eq(rfqCases.id, caseId));
  await db.insert(activityEvents).values({
    id: `event-${caseId}-rfq-sent`,
    tenantId,
    caseId,
    eventType: "rfq_sent",
    title: "RFQ drafts sent to agents",
    body: `Simulated sends created for ${selected.length} selected agents. No real external email was sent.`,
    createdAt: new Date()
  });
  touchWorkspace();
}

export async function overrideManualReview(caseId: string) {
  if (!hasDatabaseUrl()) {
    const store = getFallbackStore();
    const rfqCase = store.cases.find((item) => item.id === caseId);
    if (rfqCase) rfqCase.status = "ready_for_routing";
    store.activityEvents.unshift({
      id: `event-${caseId}-manual-override`,
      tenantId,
      caseId,
      eventType: "manual_override",
      title: "Manual review override recorded",
      body: "Manager allowed routing to continue. Risk flags remain attached to the case.",
      createdAt: new Date()
    });
    touchWorkspace();
    return;
  }

  const db = getDb();
  await db.update(rfqCases).set({ status: "ready_for_routing", updatedAt: new Date() }).where(eq(rfqCases.id, caseId));
  await db.insert(activityEvents).values({
    id: `event-${caseId}-manual-override`,
    tenantId,
    caseId,
    eventType: "manual_override",
    title: "Manual review override recorded",
    body: "Manager allowed routing to continue. Risk flags remain attached to the case.",
    createdAt: new Date()
  });
  touchWorkspace();
}

export async function seedAll(db = getDb()) {
  await db.insert(tenants).values(demoSeed.tenant).onConflictDoNothing();
  await db.insert(agents).values(demoSeed.agents).onConflictDoNothing();
  await db.insert(agentCoverages).values(demoSeed.coverages).onConflictDoNothing();
  await db.insert(agentMetrics).values(demoSeed.metrics).onConflictDoNothing();
  await insertOperationalSeed(db);
}

async function insertOperationalSeed(db: ReturnType<typeof getDb>) {
  await db.insert(rfqScenarios).values(demoSeed.scenarios).onConflictDoNothing();
  await db.insert(rfqInputs).values(demoSeed.inputs).onConflictDoNothing();
  await db.insert(rfqCases).values(demoSeed.cases).onConflictDoNothing();
  await db.insert(rfqFieldAssertions).values(demoSeed.fieldAssertions).onConflictDoNothing();
  await db.insert(rfqRounds).values(demoSeed.rounds).onConflictDoNothing();
  await db.insert(agentRequests).values(demoSeed.requests).onConflictDoNothing();
  await db.insert(attachments).values(demoSeed.attachments).onConflictDoNothing();
  await db.insert(replyPlans).values(demoSeed.replyPlans).onConflictDoNothing();
  await db.insert(rateReplies).values(demoSeed.rateReplies).onConflictDoNothing();
  await db.insert(rateOptions).values(demoSeed.rateOptions.map(toRateInsertValue)).onConflictDoNothing();
  if (demoSeed.activityEvents.length > 0) {
    await db.insert(activityEvents).values(demoSeed.activityEvents).onConflictDoNothing();
  }
}
