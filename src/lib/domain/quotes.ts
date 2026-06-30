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
      `Версия котировки ${versionNumber} для ${rfqCase.requestNumber}`,
      `Маршрут: ${rfqCase.originPort ?? rfqCase.originCity} -> ${rfqCase.destinationPort ?? rfqCase.destinationCity}`,
      `Груз: ${rfqCase.cargoDescription}`,
      `Контейнеры: ${rfqCase.containerQuantity} x ${rfqCase.containerType}`,
      `Выбранный вариант: ${rate.shippingLine}, ${rate.transitDays} дн., свободных дней: ${rate.freeDays}`,
      `Известная сумма: ${rate.currency} ${rate.knownTotal}`,
      `Коммерческая надбавка: ${rate.currency} ${commercialAdjustment}`,
      `Финальная цена для клиента: ${rate.currency} ${finalCustomerPrice}`,
      "Статус: черновик - требуется коммерческое согласование."
    ].join("\n")
  };
}

export function calculateLateRateImprovement(currentRate: RateOption, lateRate: RateOption) {
  return currentRate.knownTotal - lateRate.knownTotal;
}
