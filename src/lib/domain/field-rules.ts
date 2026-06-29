import type { RFQCase } from "@/lib/types";

export type ManualReviewDecision = {
  required: boolean;
  reasons: string[];
};

export function evaluateManualReview(rfqCase: RFQCase): ManualReviewDecision {
  const reasons: string[] = [];

  if (rfqCase.cargoFlags.includes("reefer") || rfqCase.cargoFlags.includes("temperature_controlled")) {
    reasons.push("Temperature-controlled or reefer cargo requires operational validation.");
  }

  if (rfqCase.cargoFlags.includes("dangerous_goods")) {
    reasons.push("Dangerous goods require manual validation.");
  }

  if (!rfqCase.containerType) reasons.push("Container type is missing.");
  if (!rfqCase.originPort && !rfqCase.originCity) reasons.push("Origin is missing.");
  if (!rfqCase.destinationPort && !rfqCase.destinationCity) reasons.push("Destination is missing.");
  if (rfqCase.riskFlags.includes("critical_contradiction")) reasons.push("Critical contradiction requires confirmation.");
  if (rfqCase.riskFlags.includes("low_confidence_critical_extraction")) reasons.push("Critical extraction confidence is too low.");

  return {
    required: reasons.length > 0,
    reasons
  };
}

export function canSendAgentRFQ(rfqCase: RFQCase) {
  const blockers: string[] = [];

  if (!rfqCase.originPort && !rfqCase.originCity) blockers.push("Origin");
  if (!rfqCase.destinationPort && !rfqCase.destinationCity) blockers.push("Destination");
  if (!rfqCase.containerType) blockers.push("Container type");
  if (!rfqCase.containerQuantity) blockers.push("Container quantity");
  if (!rfqCase.cargoDescription) blockers.push("Cargo description");
  if (!rfqCase.serviceScope) blockers.push("Service scope");
  if (!rfqCase.cargoReadyInfo && !rfqCase.cargoReadyDate) blockers.push("Sufficient cargo-ready information");
  if (!rfqCase.incoterms) blockers.push("Basic Incoterm interpretation");

  return {
    allowed: blockers.length === 0,
    blockers
  };
}
