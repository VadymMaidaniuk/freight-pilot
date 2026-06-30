import type { RFQCase } from "@/lib/types";

export type ManualReviewDecision = {
  required: boolean;
  reasons: string[];
};

export function evaluateManualReview(rfqCase: RFQCase): ManualReviewDecision {
  const reasons: string[] = [];

  if (rfqCase.cargoFlags.includes("reefer") || rfqCase.cargoFlags.includes("temperature_controlled")) {
    reasons.push("Температурный или рефрижераторный груз требует операционной проверки.");
  }

  if (rfqCase.cargoFlags.includes("dangerous_goods")) {
    reasons.push("Опасный груз требует ручной проверки.");
  }

  if (!rfqCase.containerType) reasons.push("Не указан тип контейнера.");
  if (!rfqCase.originPort && !rfqCase.originCity) reasons.push("Не указан пункт отправления.");
  if (!rfqCase.destinationPort && !rfqCase.destinationCity) reasons.push("Не указан пункт назначения.");
  if (rfqCase.riskFlags.includes("critical_contradiction")) reasons.push("Критическое противоречие требует подтверждения.");
  if (rfqCase.riskFlags.includes("low_confidence_critical_extraction")) reasons.push("Слишком низкая уверенность по критическому извлечению.");

  return {
    required: reasons.length > 0,
    reasons
  };
}

export function canSendAgentRFQ(rfqCase: RFQCase) {
  const blockers: string[] = [];

  if (!rfqCase.originPort && !rfqCase.originCity) blockers.push("Пункт отправления");
  if (!rfqCase.destinationPort && !rfqCase.destinationCity) blockers.push("Пункт назначения");
  if (!rfqCase.containerType) blockers.push("Тип контейнера");
  if (!rfqCase.containerQuantity) blockers.push("Количество контейнеров");
  if (!rfqCase.cargoDescription) blockers.push("Описание груза");
  if (!rfqCase.serviceScope) blockers.push("Объем сервиса");
  if (!rfqCase.cargoReadyInfo && !rfqCase.cargoReadyDate) blockers.push("Достаточная информация о готовности груза");
  if (!rfqCase.incoterms) blockers.push("Базовая интерпретация Incoterms");

  return {
    allowed: blockers.length === 0,
    blockers
  };
}
