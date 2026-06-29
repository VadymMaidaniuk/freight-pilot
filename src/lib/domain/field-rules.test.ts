import { describe, expect, it } from "vitest";
import { casesSeed } from "@/lib/demo/seed-data";
import { canSendAgentRFQ, evaluateManualReview } from "./field-rules";

describe("field rules", () => {
  it("creates manual review for reefer and temperature-controlled cargo", () => {
    const rfqCase = casesSeed.find((item) => item.id === "case-za-002")!;
    const decision = evaluateManualReview(rfqCase);
    expect(decision.required).toBe(true);
    expect(decision.reasons.join(" ")).toContain("Temperature-controlled");
  });

  it("blocks RFQ generation without required fields", () => {
    const rfqCase = casesSeed.find((item) => item.id === "case-za-002")!;
    const decision = canSendAgentRFQ(rfqCase);
    expect(decision.allowed).toBe(false);
    expect(decision.blockers).toEqual(expect.arrayContaining(["Container type", "Container quantity", "Service scope"]));
  });
});
