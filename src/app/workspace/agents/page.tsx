import { Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { demoSeed } from "@/lib/demo/seed-data";
import { agentStatusLabel, capabilityLabel, countryLabel } from "@/lib/labels";
import { loadWorkspaceSummary } from "@/lib/repositories/workspace-repository";

export const dynamic = "force-dynamic";

export default async function AgentNetworkPage({ searchParams }: { searchParams: Promise<{ country?: string; service?: string }> }) {
  const { country = "", service = "" } = await searchParams;
  const summary = await loadWorkspaceSummary();
  const countries = Array.from(new Set(demoSeed.coverages.map((coverage) => coverage.country))).sort();

  const agents = summary.agents
    .map((agent) => ({
      agent,
      coverages: demoSeed.coverages.filter((coverage) => coverage.agentId === agent.id),
      metric: demoSeed.metrics.find((metric) => metric.agentId === agent.id)
    }))
    .filter((row) => (country ? row.coverages.some((coverage) => coverage.country === country) : true))
    .filter((row) => (service ? row.agent.supportedServices.includes(service) : true));

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-label-caps uppercase tracking-wide text-primary">Проверенная сеть</p>
          <h1 className="mt-1 text-display-lg font-semibold text-ink-text">Сеть агентов</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-text">
            Справочник синтетических агентов в режиме просмотра. Подбор использует покрытие и прозрачные метрики, а не непрозрачный рейтинг надежности.
          </p>
        </div>
        <form className="flex flex-wrap gap-2">
          <select name="country" defaultValue={country} className="h-10 rounded-md border border-border-hairline bg-white px-3 text-sm outline-none">
            <option value="">Все страны</option>
            {countries.map((item) => (
              <option key={item} value={item}>
                {countryLabel(item)}
              </option>
            ))}
          </select>
          <select name="service" defaultValue={service} className="h-10 rounded-md border border-border-hairline bg-white px-3 text-sm outline-none">
            <option value="">Все сервисы</option>
            <option value="ocean_fcl">Морской FCL</option>
            <option value="reefer">Рефгруз</option>
            <option value="origin_handling">Обработка в порту отправления</option>
          </select>
          <button className="h-10 rounded-md bg-primary-container px-4 text-sm font-semibold text-white">Фильтр</button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {agents.map(({ agent, coverages, metric }) => (
          <Panel key={agent.id}>
            <PanelHeader
              title={agent.companyName}
              eyebrow={agent.location}
              actions={<Badge tone={agent.status === "active" ? "teal" : "red"}>{agentStatusLabel(agent.status)}</Badge>}
            />
            <PanelBody className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <AgentMetric label="Ответы" value={`${metric?.responseRate ?? 0}%`} />
                <AgentMetric label="Медиана" value={`${metric?.medianResponseMinutes ?? 0} мин`} />
                <AgentMetric label="Полнота" value={`${metric?.quoteCompletenessRate ?? 0}%`} />
              </div>
              <div>
                <p className="mb-2 text-label-caps uppercase tracking-wide text-muted-text">Покрытие</p>
                <div className="flex flex-wrap gap-2">
                  {coverages.map((coverage) => (
                    <Badge key={coverage.id} tone="blue">
                      {countryLabel(coverage.country)} · {coverage.port}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-label-caps uppercase tracking-wide text-muted-text">Специализация</p>
                <div className="flex flex-wrap gap-2">
                  {agent.cargoCapabilityTags.map((tag) => (
                    <Badge key={tag}>{capabilityLabel(tag)}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-text">
                <Network className="h-4 w-4 text-primary" aria-hidden />
                Выбран менеджерами {metric?.managerSelectedCount ?? 0} раз. Наблюдаемая выборка: {metric?.sampleSize ?? 0} RFQ.
              </div>
            </PanelBody>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function AgentMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-hairline bg-surface-container-lowest p-3">
      <p className="text-label-caps uppercase tracking-wide text-muted-text">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink-text">{value}</p>
    </div>
  );
}
