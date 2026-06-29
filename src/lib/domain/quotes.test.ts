import { describe, expect, it } from "vitest";
import { casesSeed, initialRateOptionsSeed, southernGateLateRate } from "@/lib/demo/seed-data";
import { buildQuoteDraft, calculateLateRateImprovement } from "./quotes";
import { canCreateQuote } from "./rates";

describe("quote rules", () => {
  it("prevents quote creation without required rate data", () => {
    const incompleteRate = initialRateOptionsSeed.find((item) => item.id === "rate-cl-pacific")!;
    expect(canCreateQuote(incompleteRate)).toMatchObject({
      allowed: false
    });
  });

  it("calculates final customer price in code", () => {
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

  it("late rate does not modify Quote v1 automatically", () => {
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
