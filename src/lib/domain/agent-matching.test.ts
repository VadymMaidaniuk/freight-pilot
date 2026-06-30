import { describe, expect, it } from "vitest";
import { agentsSeed, casesSeed, coveragesSeed, metricsSeed } from "@/lib/demo/seed-data";
import { matchAgents } from "./agent-matching";

const chileCase = casesSeed.find((item) => item.id === "case-cl-001")!;
const chinaCase = casesSeed.find((item) => item.id === "case-cn-001")!;
const southAfricaCase = casesSeed.find((item) => item.id === "case-za-001")!;

describe("подбор агентов", () => {
  it("возвращает агентов с покрытием Чили для чилийского маршрута", () => {
    const matches = matchAgents({ rfqCase: chileCase, agents: agentsSeed, coverages: coveragesSeed, metrics: metricsSeed });
    expect(matches.map((match) => match.agent.companyName)).toEqual(
      expect.arrayContaining(["Andes Link Freight", "Pacific Axis Logistics", "Southern Gate Forwarding"])
    );
  });

  it("возвращает агентов с покрытием Китая для китайского маршрута", () => {
    const matches = matchAgents({ rfqCase: chinaCase, agents: agentsSeed, coverages: coveragesSeed, metrics: metricsSeed });
    expect(matches.every((match) => match.coverage.some((coverage) => coverage.country === "China"))).toBe(true);
  });

  it("возвращает агентов с покрытием ЮАР для южноафриканского маршрута", () => {
    const matches = matchAgents({ rfqCase: southAfricaCase, agents: agentsSeed, coverages: coveragesSeed, metrics: metricsSeed });
    expect(matches.every((match) => match.coverage.some((coverage) => coverage.country === "South Africa"))).toBe(true);
  });

  it("исключает неактивных агентов", () => {
    const matches = matchAgents({ rfqCase: chinaCase, agents: agentsSeed, coverages: coveragesSeed, metrics: metricsSeed, limit: 10 });
    expect(matches.map((match) => match.agent.id)).not.toContain("agent-red-lantern");
  });

  it("исключает несовпадения по покрытию", () => {
    const mismatchedCase = { ...chileCase, originCountry: "Brazil", originCity: "Santos", originPort: "Santos" };
    const matches = matchAgents({ rfqCase: mismatchedCase, agents: agentsSeed, coverages: coveragesSeed, metrics: metricsSeed });
    expect(matches).toHaveLength(0);
  });

  it("применяет штрафы за флаги проблем", () => {
    const matches = matchAgents({ rfqCase: chinaCase, agents: agentsSeed, coverages: coveragesSeed, metrics: metricsSeed, limit: 10 });
    const dragonGate = matches.find((match) => match.agent.id === "agent-dragon-gate");
    expect(dragonGate?.factors).toContainEqual({ label: "Недавние флаги проблем: задержки по документам", points: -20 });
  });
});
