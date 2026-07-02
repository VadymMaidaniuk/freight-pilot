import type { QuoteVersion, RateOption, RFQCase } from "@/lib/types";
import { canCreateQuote } from "./rates";

export function calculateFinalCustomerPrice(rate: RateOption, commercialAdjustment: number) {
  return rate.knownTotal + commercialAdjustment;
}

export function buildQuoteDraft(input: {
  quoteId: string;
  quoteVersionId: string;
  rfqCase: RFQCase;
  rate: RateOption;
  versionNumber: number;
  commercialAdjustment: number;
}): QuoteVersion {
  const { quoteId, quoteVersionId, rfqCase, rate, versionNumber, commercialAdjustment } = input;
  const decision = canCreateQuote(rate);

  if (!decision.allowed) {
    throw new Error(`Котировку нельзя создать: ${decision.blockers.join(", ")}`);
  }

  const finalCustomerPrice = calculateFinalCustomerPrice(rate, commercialAdjustment);
  const route = `${rfqCase.originPort ?? rfqCase.originCity} -> ${rfqCase.destinationPort ?? rfqCase.destinationCity}`;

  return {
    id: quoteVersionId,
    tenantId: rfqCase.tenantId,
    quoteId,
    caseId: rfqCase.id,
    versionNumber,
    selectedRateOptionId: rate.id,
    commercialAdjustment,
    finalCustomerPrice,
    createdAt: new Date(),
    draftText: [
      `Subject: Freight quote ${rfqCase.requestNumber} · ${route}`,
      "",
      "Здравствуйте,",
      "",
      `Подготовили ставку по вашему запросу ${route}.`,
      "",
      `Груз: ${rfqCase.cargoDescription ?? "по вашему запросу"}`,
      `Контейнеры: ${rfqCase.containerQuantity ?? "?"} x ${rfqCase.containerType ?? "контейнер"}`,
      `Условия: ${rfqCase.incoterms ?? "требуют подтверждения"}`,
      `Перевозчик / линия: ${rate.shippingLine}`,
      `Транзитное время: ${rate.transitDays} дн.`,
      `Свободные дни: ${rate.freeDays}`,
      `Включено: ${rate.inclusions.join(", ")}`,
      `Исключено: ${rate.exclusions.join(", ")}`,
      `Итоговая цена для клиента: ${rate.currency} ${finalCustomerPrice}`,
      `Срок действия ставки: ${rate.validityDate}`,
      "",
      "Ставка действует при наличии места и оборудования. Готовы подтвердить букинг после вашего согласования.",
      "",
      "С уважением,",
      "FreightPilot Quote Desk",
      "",
      `Internal note: Quote v${versionNumber}; known cost ${rate.currency} ${rate.knownTotal}; margin ${rate.currency} ${commercialAdjustment}.`
    ].join("\n")
  };
}

export function calculateLateRateImprovement(currentRate: RateOption, lateRate: RateOption) {
  return currentRate.knownTotal - lateRate.knownTotal;
}
