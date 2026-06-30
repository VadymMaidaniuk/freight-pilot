import { describe, expect, it } from "vitest";
import { getFallbackStore, resetFallbackStore } from "./fallback-store";

describe("сброс резервного демо-хранилища", () => {
  it("восстанавливает начальное состояние сценариев", () => {
    const store = getFallbackStore();
    store.quotes.push({
      id: "quote-temp",
      tenantId: "demo_freightpilot",
      caseId: "case-cl-001",
      selectedRateOptionId: "rate-cl-andes",
      currentVersion: 1,
      status: "Draft"
    });

    resetFallbackStore();

    const reset = getFallbackStore();
    expect(reset.quotes).toHaveLength(0);
    expect(reset.cases.find((item) => item.id === "case-cl-001")?.status).toBe("collecting");
  });
});
