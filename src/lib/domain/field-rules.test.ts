import { describe, expect, it } from "vitest";
import { casesSeed } from "@/lib/demo/seed-data";
import { canSendAgentRFQ, evaluateManualReview } from "./field-rules";

describe("правила полей", () => {
  it("создает ручную проверку для рефрижераторного и температурного груза", () => {
    const rfqCase = casesSeed.find((item) => item.id === "case-za-002")!;
    const decision = evaluateManualReview(rfqCase);
    expect(decision.required).toBe(true);
    expect(decision.reasons.join(" ")).toContain("Температурный");
  });

  it("блокирует генерацию RFQ без обязательных полей", () => {
    const rfqCase = casesSeed.find((item) => item.id === "case-za-002")!;
    const decision = canSendAgentRFQ(rfqCase);
    expect(decision.allowed).toBe(false);
    expect(decision.blockers).toEqual(expect.arrayContaining(["Тип контейнера", "Количество контейнеров", "Объем сервиса"]));
  });
});
