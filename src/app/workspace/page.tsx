import { ArrowRight, Clock, FileText, Inbox, Plus, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { CaseStatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { sourceTypeLabel } from "@/lib/labels";
import { loadWorkspaceSummary } from "@/lib/repositories/workspace-repository";

export const dynamic = "force-dynamic";

export default async function WorkspaceInboxPage() {
  const summary = await loadWorkspaceSummary();

  const stats = [
    { label: "Кейсы RFQ", value: summary.cases.length, icon: Inbox },
    { label: "Ручная проверка", value: summary.cases.filter((item) => item.status === "manual_review").length, icon: TriangleAlert },
    { label: "Активные ставки", value: summary.rateOptions.length, icon: Clock },
    { label: "Версии котировок", value: summary.quoteVersions.length, icon: FileText }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-label-caps uppercase tracking-wide text-primary">Менеджер котировок</p>
          <h1 className="mt-1 text-display-lg font-semibold text-ink-text">Входящие RFQ</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-text">
            Операционные кейсы на синтетических данных. Каждая строка открывает единое рабочее пространство RFQ-кейса.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/workspace/new" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary-container px-4 text-sm font-semibold text-white hover:brightness-95">
            <Plus className="h-4 w-4" aria-hidden />
            Новый RFQ
          </Link>
          <Link href="/workspace/live-proof" className="inline-flex h-10 items-center gap-2 rounded-md border border-border-hairline bg-white px-4 text-sm font-semibold hover:bg-surface-container-low">
            Проверка AI-ввода
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Panel key={stat.label}>
              <PanelBody className="flex items-center justify-between">
                <div>
                  <p className="text-label-caps uppercase tracking-wide text-muted-text">{stat.label}</p>
                  <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-ink-text">{stat.value}</p>
                </div>
                <Icon className="h-5 w-5 text-primary" aria-hidden />
              </PanelBody>
            </Panel>
          );
        })}
      </div>

      <Panel>
        <PanelHeader title="Демо-кейсы RFQ" eyebrow="Управляемое демо" />
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>RFQ</th>
                <th>Маршрут</th>
                <th>Источник</th>
                <th>Дедлайн</th>
                <th>Статус</th>
                <th>Риски</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {summary.cases.map((rfqCase) => (
                <tr key={rfqCase.id}>
                  <td>
                    <div className="font-semibold text-ink-text">{rfqCase.requestNumber}</div>
                    <div className="text-xs text-muted-text">{rfqCase.cargoDescription ?? "Груз не указан"}</div>
                  </td>
                  <td className="font-mono text-data-mono tabular-nums">
                    {rfqCase.originCity} -&gt; {rfqCase.destinationCity}
                  </td>
                  <td>
                    <Badge tone="blue">{sourceTypeLabel(rfqCase.sourceType)}</Badge>
                  </td>
                  <td className="font-mono text-data-mono text-muted-text">{rfqCase.quotationDeadline}</td>
                  <td>
                    <CaseStatusBadge status={rfqCase.status} />
                  </td>
                  <td>
                    {rfqCase.riskFlags.length > 0 ? (
                      <span className="text-sm text-muted-text">{rfqCase.riskFlags.length} открытых флагов</span>
                    ) : (
                      <span className="text-sm text-muted-text">Критичных флагов нет</span>
                    )}
                  </td>
                  <td className="text-right">
                    <Link href={`/workspace/cases/${rfqCase.id}`} className="inline-flex h-8 items-center gap-1 rounded-md bg-primary-container px-3 text-xs font-bold text-white hover:brightness-95">
                      Открыть
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
