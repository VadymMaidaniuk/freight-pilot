import { describe, expect, it } from "vitest";
import { heuristicExtractRFQ } from "./rfq-heuristics";

describe("RFQ heuristic fallback", () => {
  it("extracts China origin from pasted chat when LLM is unavailable", () => {
    const extraction = heuristicExtractRFQ(
      "conversation",
      "Customer: Need Ningbo to Hamburg for 2 x 40HC electronics. FOB Ningbo. Cargo ready next week."
    );

    expect(extraction.fields.originCountry).toBe("China");
    expect(extraction.fields.originPort).toBe("Ningbo");
    expect(extraction.fields.destinationPort).toBe("Hamburg");
    expect(extraction.fields.containerQuantity).toBe(2);
    expect(extraction.fields.containerType).toBe("40HC");
  });
});
