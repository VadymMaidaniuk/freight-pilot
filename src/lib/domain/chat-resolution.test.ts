import { describe, expect, it } from "vitest";
import { resolveLatestCustomerAssertion, type ChatAssertion } from "./chat-resolution";

describe("разрешение чата", () => {
  it("выбирает последнее явное изменение от клиента", () => {
    const assertions: ChatAssertion[] = [
      { fieldName: "container_quantity", value: "1", messageOrder: 1, speaker: "customer", text: "Нужно 1 x 40HC" },
      { fieldName: "container_quantity", value: "2", messageOrder: 3, speaker: "customer", text: "Пожалуйста, измените на 2 x 40HC" }
    ];

    expect(resolveLatestCustomerAssertion(assertions, "container_quantity")).toMatchObject({
      value: "2",
      verificationStatus: "Confirmed",
      confidence: "High"
    });
  });

  it("помечает неразрешенные противоречия как конфликт", () => {
    const assertions: ChatAssertion[] = [
      { fieldName: "container_quantity", value: "1", messageOrder: 1, speaker: "customer", text: "Нужно 1 x 40HC" },
      { fieldName: "container_quantity", value: "2", messageOrder: 3, speaker: "customer", text: "В заметках также указано 2 x 40HC" }
    ];

    expect(resolveLatestCustomerAssertion(assertions, "container_quantity")).toMatchObject({
      value: null,
      verificationStatus: "Conflict detected"
    });
  });
});
