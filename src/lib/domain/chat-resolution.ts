import type { ConfidenceLevel, VerificationStatus } from "@/lib/types";

export type ChatAssertion = {
  fieldName: string;
  value: string;
  messageOrder: number;
  speaker: "customer" | "desk" | "agent";
  text: string;
};

export type ResolvedChatField = {
  fieldName: string;
  value: string | null;
  verificationStatus: VerificationStatus;
  confidence: ConfidenceLevel;
  evidence: string;
};

export function resolveLatestCustomerAssertion(assertions: ChatAssertion[], fieldName: string): ResolvedChatField {
  const candidates = assertions
    .filter((assertion) => assertion.fieldName === fieldName && assertion.speaker === "customer")
    .sort((a, b) => a.messageOrder - b.messageOrder);

  if (candidates.length === 0) {
    return {
      fieldName,
      value: null,
      verificationStatus: "Missing",
      confidence: "Low",
      evidence: "No explicit customer value found."
    };
  }

  const latest = candidates.at(-1);
  const uniqueValues = new Set(candidates.map((assertion) => assertion.value));

  if (!latest) {
    return {
      fieldName,
      value: null,
      verificationStatus: "Missing",
      confidence: "Low",
      evidence: "No explicit customer value found."
    };
  }

  if (uniqueValues.size === 1) {
    return {
      fieldName,
      value: latest.value,
      verificationStatus: "Confirmed",
      confidence: "High",
      evidence: latest.text
    };
  }

  const latestText = latest.text.toLowerCase();
  const hasRevisionCue = ["revise", "change", "instead", "update", "now"].some((cue) => latestText.includes(cue));

  if (hasRevisionCue) {
    return {
      fieldName,
      value: latest.value,
      verificationStatus: "Confirmed",
      confidence: "High",
      evidence: latest.text
    };
  }

  return {
    fieldName,
    value: null,
    verificationStatus: "Conflict detected",
    confidence: "Medium",
    evidence: candidates.map((candidate) => `#${candidate.messageOrder}: ${candidate.text}`).join(" | ")
  };
}
