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
    throw new Error(`Quote cannot be created: ${decision.blockers.join(", ")}`);
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
      `Quote version ${versionNumber} for ${rfqCase.requestNumber}`,
      `Route: ${rfqCase.originPort ?? rfqCase.originCity} -> ${rfqCase.destinationPort ?? rfqCase.destinationCity}`,
      `Cargo: ${rfqCase.cargoDescription}`,
      `Containers: ${rfqCase.containerQuantity} x ${rfqCase.containerType}`,
      `Selected option: ${rate.shippingLine}, ${rate.transitDays} days, ${rate.freeDays} free days`,
      `Known total: ${rate.currency} ${rate.knownTotal}`,
      `Commercial adjustment: ${rate.currency} ${commercialAdjustment}`,
      `Final customer price: ${rate.currency} ${finalCustomerPrice}`,
      "Status: Draft - commercial approval required."
    ].join("\n")
  };
}

export function calculateLateRateImprovement(currentRate: RateOption, lateRate: RateOption) {
  return currentRate.knownTotal - lateRate.knownTotal;
}
