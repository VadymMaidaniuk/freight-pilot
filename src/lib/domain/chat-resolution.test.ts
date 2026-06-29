import { describe, expect, it } from "vitest";
import { resolveLatestCustomerAssertion, type ChatAssertion } from "./chat-resolution";

describe("chat resolution", () => {
  it("resolves latest explicit customer revision", () => {
    const assertions: ChatAssertion[] = [
      { fieldName: "container_quantity", value: "1", messageOrder: 1, speaker: "customer", text: "Need 1 x 40HC" },
      { fieldName: "container_quantity", value: "2", messageOrder: 3, speaker: "customer", text: "Please revise to 2 x 40HC" }
    ];

    expect(resolveLatestCustomerAssertion(assertions, "container_quantity")).toMatchObject({
      value: "2",
      verificationStatus: "Confirmed",
      confidence: "High"
    });
  });

  it("marks unresolved contradictions as conflict detected", () => {
    const assertions: ChatAssertion[] = [
      { fieldName: "container_quantity", value: "1", messageOrder: 1, speaker: "customer", text: "Need 1 x 40HC" },
      { fieldName: "container_quantity", value: "2", messageOrder: 3, speaker: "customer", text: "Also 2 x 40HC appears on notes" }
    ];

    expect(resolveLatestCustomerAssertion(assertions, "container_quantity")).toMatchObject({
      value: null,
      verificationStatus: "Conflict detected"
    });
  });
});
