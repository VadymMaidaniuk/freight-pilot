import { ArrowRight, FileSpreadsheet, History, Send, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";
import {
  approveRoutingAction,
  createQuoteAction,
  overrideManualReviewAction,
  processSimulatedRepliesAction,
  receiveLateRateAction
} from "@/app/workspace/actions";
import { CaseStatusBadge, RateStatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { matchAgents } from "@/lib/domain/agent-matching";
import { evaluateManualReview } from "@/lib/domain/field-rules";
import { calculateLateRateImprovement } from "@/lib/domain/quotes";
import { explainRecommendation, rankRateOptions } from "@/lib/domain/rates";
import { summarizeRound } from "@/lib/domain/state-machine";
import { fieldLabel, sourceTypeLabel, verificationStatusLabel } from "@/lib/labels";
import { loadCaseSnapshot } from "@/lib/repositories/workspace-repository";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CaseWorkspacePage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const snapshot = await loadCaseSnapshot(caseId);
  if (!snapshot) notFound();

  const matches = matchAgents({
    rfqCase: snapshot.case,
    agents: snapshot.agents,
    coverages: snapshot.coverages,
    metrics: snapshot.metrics
  });
  const roundSummary = summarizeRound(snapshot.round, snapshot.requests);
  const rankedRates = rankRateOptions(snapshot.rateOptions);
  const recommended = rankedRates.find((rate) => !rate.reviewRequired) ?? rankedRates[0];
  const currentQuote = snapshot.quotes[0];
  const currentVersion = currentQuote ? snapshot.quoteVersions.find((version) => version.versionNumber === currentQuote.currentVersion) : null;
  const selectedRate = currentVersion ? snapshot.rateOptions.find((rate) => rate.id === currentVersion.selectedRateOptionId) : null;
  const lateRate = snapshot.rateOptions.find((rate) => rate.status === "Late response");
  const lateImprovement = selectedRate && lateRate ? calculateLateRateImprovement(selectedRate, lateRate) : null;
  const manualReview = evaluateManualReview(snapshot.case);
  const canProcessSimulatedReplies =
    snapshot.requests.some((request) => request.status === "Awaiting response" || request.status === "Sent") &&
    snapshot.rateOptions.length === 0;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">{snapshot.case.requestNumber}</span>
            <span className="text-muted-text">·</span>
            <span className="font-mono text-sm text-ink-text">
              {snapshot.case.originCity} -&gt; {snapshot.case.destinationCity}
            </span>
            <CaseStatusBadge status={snapshot.case.status} />
          </div>
          <h1 className="mt-2 text-display-lg font-semibold text-ink-text">{snapshot.scenario.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-text">
            Дедлайн котировки: {snapshot.case.quotationDeadline}. Отсечка ответов: {snapshot.case.responseCutoff}. Демо-таймлайн ускорен.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2 rounded-lg border border-border-hairline bg-white p-3 text-center">
          <Metric label="Отправлено" value={roundSummary.requestsSent} />
          <Metric label="Получено" value={roundSummary.responsesReceived} />
          <Metric label="Сопоставимо" value={roundSummary.comparableRates} />
          <Metric label="Неполных" value={roundSummary.incompleteRates} />
        </div>
      </div>

      {manualReview.required && snapshot.case.status === "manual_review" ? (
        <Panel className="border-error/30">
          <PanelHeader title="Требуется ручная проверка" eyebrow="Операционная валидация" />
          <PanelBody className="space-y-4">
            <p className="max-w-3xl text-sm leading-6 text-muted-text">
              Этот RFQ требует операционной проверки перед отправкой запросов агентам.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {manualReview.reasons.map((reason) => (
                <div key={reason} className="flex gap-3 rounded-md border border-error/20 bg-error-container/50 p-3 text-sm text-on-error-container">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {reason}
                </div>
              ))}
            </div>
            <form action={overrideManualReviewAction}>
              <input type="hidden" name="caseId" value={snapshot.case.id} />
              <Button>Снять проверку и продолжить</Button>
            </form>
          </PanelBody>
        </Panel>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr_0.9fr]">
        <Panel>
          <PanelHeader title="Детали RFQ" eyebrow={sourceTypeLabel(snapshot.input.sourceType)} />
          <PanelBody className="space-y-4">
            <Field label="Маршрут" value={`${snapshot.case.originPort ?? snapshot.case.originCity} -> ${snapshot.case.destinationPort ?? snapshot.case.destinationCity}`} />
            <Field label="Груз" value={snapshot.case.cargoDescription ?? "Нет данных"} />
            <Field label="Контейнеры" value={`${snapshot.case.containerQuantity ?? "?"} x ${snapshot.case.containerType ?? "Нет данных"}`} />
            <Field label="Incoterms" value={snapshot.case.incoterms ?? "Нет данных"} />
            <Field label="Готовность груза" value={snapshot.case.cargoReadyDate ?? snapshot.case.cargoReadyInfo ?? "Нет данных"} />
            <Field label="Объем сервиса" value={snapshot.case.serviceScope ?? "Нет данных"} />
            <div className="border-t border-border-hairline pt-4">
              <p className="mb-2 text-label-caps uppercase tracking-wide text-muted-text">Извлеченные поля</p>
              <div className="space-y-2">
                {snapshot.fields.map((field) => (
                  <div key={field.id} className="rounded-md border border-border-hairline bg-surface-container-lowest p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink-text">{fieldLabel(field.fieldName)}</span>
                      <Badge tone={field.verificationStatus === "Confirmed" ? "teal" : field.verificationStatus === "Missing" ? "amber" : "blue"}>
                        {verificationStatusLabel(field.verificationStatus)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-text">{field.value ?? "Нет значения"}</p>
                    <p className="mt-2 border-l-2 border-ai-marker pl-2 text-xs leading-5 text-muted-text">{field.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          </PanelBody>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Активность и ответы по ставкам" eyebrow="Операционная история" />
            <PanelBody className="space-y-4">
              {snapshot.activityEvents.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-container/10 text-primary">
                    <History className="h-4 w-4" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-text">{event.title}</p>
                    <p className="text-sm leading-6 text-muted-text">{event.body}</p>
                  </div>
                </div>
              ))}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Сравнение ставок" eyebrow="Детерминированное ранжирование" />
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Агент</th>
                    <th>Итого</th>
                    <th>Транзит</th>
                    <th>Свободные дни</th>
                    <th>Полнота</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedRates.map((rate) => {
                    const agent = snapshot.agents.find((item) => item.id === rate.agentId);
                    return (
                      <tr key={rate.id}>
                        <td>
                          <div className="font-semibold text-ink-text">{agent?.companyName ?? rate.agentId}</div>
                          <div className="text-xs text-muted-text">{rate.shippingLine}</div>
                        </td>
                        <td className="font-mono text-data-mono font-semibold tabular-nums">{formatMoney(rate.knownTotal, rate.currency)}</td>
                        <td className="font-mono text-data-mono">{rate.transitDays} дн.</td>
                        <td className="font-mono text-data-mono">{rate.freeDays}</td>
                        <td className="font-mono text-data-mono">{rate.completenessScore}%</td>
                        <td>
                          <RateStatusBadge status={rate.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Панель решения" eyebrow="Под контролем менеджера" />
            <PanelBody className="space-y-5">
              {recommended ? (
                <div className="rounded-md border border-primary-container/30 bg-primary-container/10 p-4">
                  <p className="text-label-caps uppercase tracking-wide text-primary">Рекомендовано</p>
                  <p className="mt-1 font-semibold text-ink-text">
                    {snapshot.agents.find((agent) => agent.id === recommended.agentId)?.companyName}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-5 text-muted-text">
                    {explainRecommendation(recommended, snapshot.rateOptions).map((reason) => (
                      <li key={reason}>- {reason}</li>
                    ))}
                  </ul>
                  <form action={createQuoteAction} className="mt-4 space-y-3">
                    <input type="hidden" name="caseId" value={snapshot.case.id} />
                    <input type="hidden" name="rateOptionId" value={recommended.id} />
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-text">
                      Коммерческая надбавка
                      <input
                        name="commercialAdjustment"
                        type="number"
                        defaultValue={420}
                        className="mt-1 h-9 w-full rounded-md border border-border-hairline px-3 font-mono text-sm outline-none focus:border-primary-container"
                      />
                    </label>
                    <Button className="w-full">
                      Создать Quote v{currentQuote ? currentQuote.currentVersion + 1 : 1}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </form>
                </div>
              ) : (
                <p className="text-sm text-muted-text">Сопоставимой ставки пока нет.</p>
              )}

              {snapshot.case.id === "case-cl-001" && !lateRate ? (
                <form action={receiveLateRateAction}>
                  <input type="hidden" name="caseId" value={snapshot.case.id} />
                  <Button variant="secondary" className="w-full">
                    <FileSpreadsheet className="h-4 w-4" aria-hidden />
                    Получить позднюю Excel-ставку
                  </Button>
                </form>
              ) : null}

              {canProcessSimulatedReplies ? (
                <form action={processSimulatedRepliesAction}>
                  <input type="hidden" name="caseId" value={snapshot.case.id} />
                  <Button variant="secondary" className="w-full">
                    Обработать имитированные ответы
                  </Button>
                </form>
              ) : null}

              {lateImprovement !== null ? (
                <div className="rounded-md border border-secondary-container bg-secondary-container/40 p-4">
                  <p className="text-label-caps uppercase tracking-wide text-on-secondary-container">Новая ставка после Quote v1</p>
                  <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-ink-text">{formatMoney(lateImprovement)}</p>
                  <p className="mt-2 text-sm leading-5 text-muted-text">Потенциальная экономия относительно текущего выбранного варианта. Quote v1 остается без изменений.</p>
                </div>
              ) : null}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Короткий список агентов" eyebrow="Расчет по покрытию и метрикам" />
            <PanelBody className="space-y-3">
              {matches.slice(0, 5).map((match) => (
                <div key={match.agent.id} className="rounded-md border border-border-hairline bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink-text">{match.agent.companyName}</p>
                      <p className="text-xs text-muted-text">{match.agent.location}</p>
                    </div>
                    <span className="font-mono text-sm font-semibold text-primary">{match.score}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-text">
                    Ответы {match.metric.responseRate}%, медиана {match.metric.medianResponseMinutes} мин, полнота ставок {match.metric.quoteCompletenessRate}%.
                  </p>
                </div>
              ))}

              {snapshot.case.status === "ready_for_routing" ? (
                <form action={approveRoutingAction} className="space-y-2">
                  <input type="hidden" name="caseId" value={snapshot.case.id} />
                  {matches.slice(0, 3).map((match) => (
                    <input key={match.agent.id} type="hidden" name="agentIds" value={match.agent.id} />
                  ))}
                  <Button className="w-full">
                    <Send className="h-4 w-4" aria-hidden />
                    Согласовать и имитировать отправку
                  </Button>
                </form>
              ) : null}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="История котировок" eyebrow="Версионирование" />
            <PanelBody className="space-y-3">
              {snapshot.quoteVersions.length === 0 ? (
                <p className="text-sm text-muted-text">Клиентская котировка пока не создана.</p>
              ) : (
                snapshot.quoteVersions
                  .sort((a, b) => b.versionNumber - a.versionNumber)
                  .map((version) => (
                    <div key={version.id} className="rounded-md border border-border-hairline p-3">
                      <div className="flex justify-between">
                        <p className="font-semibold text-ink-text">Quote v{version.versionNumber}</p>
                        <p className="font-mono text-sm tabular-nums">{formatMoney(version.finalCustomerPrice)}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-text">Черновик - требуется коммерческое согласование</p>
                    </div>
                  ))
              )}
            </PanelBody>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-label-caps uppercase tracking-wide text-muted-text">{label}</p>
      <p className="font-mono text-xl font-semibold tabular-nums text-ink-text">{value}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 border-b border-border-hairline pb-3 last:border-0 last:pb-0">
      <p className="text-label-caps uppercase tracking-wide text-muted-text">{label}</p>
      <p className="text-sm font-medium text-ink-text">{value}</p>
    </div>
  );
}
