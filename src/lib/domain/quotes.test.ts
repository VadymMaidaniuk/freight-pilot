import { describe, expect, it } from "vitest";
import { casesSeed, initialRateOptionsSeed, southernGateLateRate } from "@/lib/demo/seed-data";
import { buildQuoteDraft, calculateLateRateImprovement } from "./quotes";
import { canCreateQuote } from "./rates";

describe("правила котировок", () => {
  it("не дает создать котировку без обязательных данных ставки", () => {
    const incompleteRate = initialRateOptionsSeed.find((item) => item.id === "rate-cl-pacific")!;
    expect(canCreateQuote(incompleteRate)).toMatchObject({
      allowed: false
    });
  });

  it("рассчитывает финальную цену для клиента в коде", () => {
    const rfqCase = casesSeed.find((item) => item.id === "case-cl-001")!;
    const rate = initialRateOptionsSeed.find((item) => item.id === "rate-cl-andes")!;
    const version = buildQuoteDraft({
      quoteId: "quote-test",
      quoteVersionId: "quote-version-test",
      rfqCase,
      rate,
      versionNumber: 1,
      commercialAdjustment: 420
    });
    expect(version.finalCustomerPrice).toBe(5070);
  });

  it("поздняя ставка не меняет Quote v1 автоматически", () => {
    const rfqCase = casesSeed.find((item) => item.id === "case-cl-001")!;
    const firstRate = initialRateOptionsSeed.find((item) => item.id === "rate-cl-andes")!;
    const quoteV1 = buildQuoteDraft({
      quoteId: "quote-test",
      quoteVersionId: "quote-v1",
      rfqCase,
      rate: firstRate,
      versionNumber: 1,
      commercialAdjustment: 420
    });

    const improvement = calculateLateRateImprovement(firstRate, southernGateLateRate);

    expect(improvement).toBe(320);
    expect(quoteV1.selectedRateOptionId).toBe(firstRate.id);
    expect(quoteV1.finalCustomerPrice).toBe(5070);
  });
});
