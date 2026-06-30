import { describe, expect, it } from "vitest";
import { heuristicExtractRFQ } from "./rfq-heuristics";

describe("эвристический резерв RFQ", () => {
  it("извлекает отправление из Китая из вставленного чата без LLM", () => {
    const extraction = heuristicExtractRFQ(
      "conversation",
      "Клиент: Нужно Ningbo - Hamburg, 2 x 40HC, электроника. FOB Ningbo. Груз будет готов на следующей неделе."
    );

    expect(extraction.fields.originCountry).toBe("China");
    expect(extraction.fields.originPort).toBe("Ningbo");
    expect(extraction.fields.destinationPort).toBe("Hamburg");
    expect(extraction.fields.containerQuantity).toBe(2);
    expect(extraction.fields.containerType).toBe("40HC");
  });
});
