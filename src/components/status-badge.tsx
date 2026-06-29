import type { CaseStatus, RateOption } from "@/lib/types";
import { Badge } from "./ui/badge";

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const tone =
    status === "manual_review"
      ? "red"
      : status === "clarification_required" || status === "approval_pending"
        ? "amber"
        : status === "collecting" || status === "decision_ready" || status === "quote_draft_created"
          ? "teal"
          : "neutral";

  return <Badge tone={tone}>{status.replaceAll("_", " ")}</Badge>;
}

export function RateStatusBadge({ status }: { status: RateOption["status"] }) {
  const tone = status === "Incomplete" || status === "Needs review" ? "amber" : status === "Late response" ? "blue" : status === "Recommended" ? "teal" : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}
