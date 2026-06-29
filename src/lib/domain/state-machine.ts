import type { AgentRequest, CaseStatus, RFQCase, RFQRound, RoundStatus } from "@/lib/types";
import { canSendAgentRFQ, evaluateManualReview } from "./field-rules";

export function deriveCaseStatus(rfqCase: RFQCase, requests: AgentRequest[], hasQuote: boolean): CaseStatus {
  if (hasQuote) return "quote_draft_created";

  const manualReview = evaluateManualReview(rfqCase);
  if (manualReview.required && rfqCase.status === "manual_review") return "manual_review";

  const sendDecision = canSendAgentRFQ(rfqCase);
  if (!sendDecision.allowed) return "clarification_required";

  if (requests.length === 0) return "ready_for_routing";

  const comparableResponses = requests.filter((request) => request.status === "Rate received" || request.status === "Late response");
  if (comparableResponses.length >= 1) return "decision_ready";

  return "collecting";
}

export function deriveRoundStatus(requests: AgentRequest[]): RoundStatus {
  if (requests.length === 0) return "draft";

  const received = requests.filter((request) => request.status === "Rate received" || request.status === "Late response");
  const incomplete = requests.filter((request) => request.status === "Incomplete rate");
  const pending = requests.filter((request) => request.status === "Awaiting response" || request.status === "Sent");

  if (received.length + incomplete.length === requests.length) return "deadline_reached";
  if (received.length >= 1 && pending.length > 0) return "enough_responses";
  return "collecting";
}

export function summarizeRound(round: RFQRound | null, requests: AgentRequest[]) {
  return {
    requestsSent: round?.selectedAgentIds.length ?? 0,
    responsesReceived: requests.filter((request) => request.status === "Rate received" || request.status === "Late response").length,
    incompleteRates: requests.filter((request) => request.status === "Incomplete rate").length,
    overdueAgents: requests.filter((request) => request.status === "Overdue").length,
    comparableRates: requests.filter((request) => request.status === "Rate received" || request.status === "Late response").length
  };
}
