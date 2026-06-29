"use server";

import { redirect } from "next/navigation";
import {
  approveForRouting,
  createRFQFromPastedInput,
  createQuoteFromRate,
  overrideManualReview,
  processSimulatedAgentReplies,
  receiveLateExcelRate,
  resetWorkspace
} from "@/lib/repositories/workspace-repository";

export async function resetWorkspaceAction() {
  await resetWorkspace();
  redirect("/workspace");
}

export async function createQuoteAction(formData: FormData) {
  const caseId = String(formData.get("caseId") ?? "");
  const rateOptionId = String(formData.get("rateOptionId") ?? "");
  const adjustment = Number(formData.get("commercialAdjustment") ?? 420);
  await createQuoteFromRate(caseId, rateOptionId, adjustment);
  redirect(`/workspace/cases/${caseId}`);
}

export async function createRFQFromInputAction(formData: FormData) {
  const sourceType = String(formData.get("sourceType") ?? "email");
  const rawText = String(formData.get("rawText") ?? "");
  if (!rawText.trim()) redirect("/workspace/new?error=missing-input");

  const rfqCase = await createRFQFromPastedInput({ sourceType, rawText });
  redirect(`/workspace/cases/${rfqCase.id}`);
}

export async function processSimulatedRepliesAction(formData: FormData) {
  const caseId = String(formData.get("caseId") ?? "");
  await processSimulatedAgentReplies(caseId);
  redirect(`/workspace/cases/${caseId}`);
}

export async function receiveLateRateAction(formData: FormData) {
  const caseId = String(formData.get("caseId") ?? "");
  await receiveLateExcelRate(caseId);
  redirect(`/workspace/cases/${caseId}`);
}

export async function approveRoutingAction(formData: FormData) {
  const caseId = String(formData.get("caseId") ?? "");
  const agentIds = formData.getAll("agentIds").map(String);
  await approveForRouting(caseId, agentIds);
  redirect(`/workspace/cases/${caseId}`);
}

export async function overrideManualReviewAction(formData: FormData) {
  const caseId = String(formData.get("caseId") ?? "");
  await overrideManualReview(caseId);
  redirect(`/workspace/cases/${caseId}`);
}
