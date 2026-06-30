import type { Agent, AgentCoverage, AgentMetric, RFQCase } from "@/lib/types";

export type MatchFactor = {
  label: string;
  points: number;
};

export type AgentMatch = {
  agent: Agent;
  coverage: AgentCoverage[];
  metric: AgentMetric;
  score: number;
  factors: MatchFactor[];
};

function textEquals(a: string | null, b: string) {
  return Boolean(a && a.toLowerCase() === b.toLowerCase());
}

function coverageMatches(rfqCase: RFQCase, coverage: AgentCoverage) {
  const originMatch =
    coverage.side === "origin" &&
    (textEquals(rfqCase.originCountry, coverage.country) ||
      textEquals(rfqCase.originCity, coverage.city) ||
      textEquals(rfqCase.originPort, coverage.port));

  const destinationMatch =
    coverage.side === "destination" &&
    (textEquals(rfqCase.destinationCountry, coverage.country) ||
      textEquals(rfqCase.destinationCity, coverage.city) ||
      textEquals(rfqCase.destinationPort, coverage.port));

  const routeMatch = coverage.side === "route" && originMatch && destinationMatch;

  return originMatch || destinationMatch || routeMatch;
}

function supportsCargo(agent: Agent, rfqCase: RFQCase) {
  if (rfqCase.cargoFlags.includes("reefer") || rfqCase.cargoFlags.includes("temperature_controlled")) {
    return (
      agent.supportedServices.includes("reefer") ||
      agent.cargoCapabilityTags.includes("reefer") ||
      agent.cargoCapabilityTags.includes("temperature_controlled")
    );
  }

  if (rfqCase.cargoDescription?.toLowerCase().includes("coffee") || rfqCase.cargoDescription?.toLowerCase().includes("кофе")) {
    return agent.cargoCapabilityTags.includes("coffee") || agent.cargoCapabilityTags.includes("agricultural");
  }

  if (rfqCase.cargoDescription?.toLowerCase().includes("automotive") || rfqCase.cargoDescription?.toLowerCase().includes("авто")) {
    return agent.cargoCapabilityTags.includes("automotive") || agent.cargoCapabilityTags.includes("industrial");
  }

  if (rfqCase.cargoDescription?.toLowerCase().includes("electronics") || rfqCase.cargoDescription?.toLowerCase().includes("электрон")) {
    return agent.cargoCapabilityTags.includes("electronics") || agent.cargoCapabilityTags.includes("general_cargo");
  }

  return true;
}

function speedPoints(minutes: number) {
  if (minutes <= 40) return 15;
  if (minutes <= 60) return 11;
  if (minutes <= 90) return 7;
  return 3;
}

function completenessPoints(rate: number) {
  if (rate >= 90) return 15;
  if (rate >= 80) return 11;
  if (rate >= 70) return 7;
  return 3;
}

export function matchAgents(input: {
  rfqCase: RFQCase;
  agents: Agent[];
  coverages: AgentCoverage[];
  metrics: AgentMetric[];
  limit?: number;
}): AgentMatch[] {
  const { rfqCase, agents, coverages, metrics, limit = 5 } = input;

  return agents
    .flatMap((agent) => {
      const metric = metrics.find((item) => item.agentId === agent.id);
      const agentCoverage = coverages.filter((coverage) => coverage.agentId === agent.id);
      const matchedCoverage = agentCoverage.filter((coverage) => coverageMatches(rfqCase, coverage));

      if (!metric || agent.status !== "active") return [];
      if (!agent.supportedServices.includes("ocean_fcl")) return [];
      if (matchedCoverage.length === 0) return [];
      if (!supportsCargo(agent, rfqCase)) return [];

      const factors: MatchFactor[] = [
        { label: "Совпадение покрытия", points: 40 },
        { label: "Сервис и грузовая специализация", points: 20 },
        { label: `Медиана ответа ${metric.medianResponseMinutes} мин`, points: speedPoints(metric.medianResponseMinutes) },
        { label: `История полных ставок ${metric.quoteCompletenessRate}%`, points: completenessPoints(metric.quoteCompletenessRate) },
        { label: `Наблюдаемая выборка ${metric.sampleSize} RFQ`, points: metric.sampleSize >= 20 ? 5 : 2 },
        { label: `Выбран менеджерами ${metric.managerSelectedCount} раз`, points: metric.managerSelectedCount >= 10 ? 5 : 2 }
      ];

      if (agent.issueFlags.length > 0) {
        factors.push({ label: `Недавние флаги проблем: ${agent.issueFlags.join(", ")}`, points: -20 });
      }

      const score = factors.reduce((sum, factor) => sum + factor.points, 0);

      return [
        {
          agent,
          coverage: matchedCoverage,
          metric,
          score,
          factors
        }
      ];
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
