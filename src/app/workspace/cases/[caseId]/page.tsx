import { ArrowRight, ClipboardList, FileSpreadsheet, History, MailCheck, Send, ShieldAlert } from "lucide-react";
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
  if (!snapshot && caseId.startsWith("case-live-")) {
    return (
      <div className="space-y-6 pb-20 md:pb-0">
        <Panel>
          <PanelHeader title="Live RFQ не найден" eyebrow="Локальное демо-хранилище" />
          <PanelBody className="space-y-4">
            <p className="max-w-2xl text-sm leading-6 text-muted-text">
              Этот временный live-кейс не найден в локальном демо-хранилище. Такое могло произойти с кейсами, созданными до включения персистентного fallback-store.
            </p>
            <a
              href="/workspace/new"
              className="inline-flex h-10 items-center justify-center rounded-md border border-primary-container bg-primary-container px-4 text-sm font-semibold text-white transition hover:brightness-95"
            >
              Создать RFQ заново
            </a>
          </PanelBody>
        </Panel>
      </div>
    );
  }
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
  const aiExtractionEvent = snapshot.activityEvents.find((event) => event.eventType === "ai_extraction");
  const hasLiveExtraction = aiExtractionEvent?.title.startsWith("LLM извлекла");
  const hasLLMNormalizedRates = snapshot.rateReplies.some((reply) => reply.processingResult === "llm_normalized_and_zod_validated");
  const sentAgentCandidates = snapshot.round?.selectedAgentIds
    .map((agentId) => snapshot.agents.find((agent) => agent.id === agentId))
    .filter((agent): agent is (typeof snapshot.agents)[number] => Boolean(agent));
  const agentRequestAgents =
    sentAgentCandidates && sentAgentCandidates.length > 0 ? sentAgentCandidates : matches.slice(0, 3).map((match) => match.agent);

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
            {aiExtractionEvent ? <Badge tone={hasLiveExtraction ? "teal" : "amber"}>{hasLiveExtraction ? "LLM extracted" : "Fallback parsed"}</Badge> : null}
            {hasLLMNormalizedRates ? <Badge tone="teal">LLM normalized rates</Badge> : null}
            {currentVersion ? <Badge tone="blue">Client email ready</Badge> : null}
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
            <div className="rounded-md border border-border-hairline bg-surface-container-lowest p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-text">
                <ClipboardList className="h-4 w-4 text-primary" aria-hidden />
                Исходный текст клиента
              </div>
              <p className="max-h-40 overflow-auto whitespace-pre-line text-xs leading-5 text-muted-text">{snapshot.input.rawText}</p>
            </div>
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
                    <p className="max-h-72 overflow-auto whitespace-pre-line text-sm leading-6 text-muted-text">{event.body}</p>
                  </div>
                </div>
              ))}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Сравнение ставок" eyebrow="LLM-нормализация + проверяемое ранжирование" />
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
            {snapshot.rateReplies.length > 0 ? (
              <PanelBody className="border-t border-border-hairline">
                <p className="mb-3 text-label-caps uppercase tracking-wide text-muted-text">Raw ответы агентов в normalized rates</p>
                <div className="space-y-3">
                  {snapshot.rateReplies.map((reply) => {
                    const agent = snapshot.agents.find((item) => item.id === reply.agentId);
                    const rate = snapshot.rateOptions.find((item) => item.replyId === reply.id);

                    return (
                      <div key={reply.id} className="rounded-md border border-border-hairline bg-surface-container-lowest p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-ink-text">{agent?.companyName ?? reply.agentId}</p>
                          <Badge tone={reply.processingResult === "llm_normalized_and_zod_validated" ? "teal" : "amber"}>
                            {processingResultLabel(reply.processingResult)}
                          </Badge>
                        </div>
                        <p className="mt-2 max-h-28 overflow-auto whitespace-pre-line border-l-2 border-ai-marker pl-3 text-xs leading-5 text-muted-text">{reply.rawText}</p>
                        {rate ? (
                          <p className="mt-2 text-xs leading-5 text-muted-text">
                            Нормализовано: {formatMoney(rate.knownTotal, rate.currency)}, transit {rate.transitDays} дн., free days {rate.freeDays}, completeness {rate.completenessScore}%.
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </PanelBody>
            ) : null}
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
                  <p className="mt-2 text-sm leading-5 text-muted-text">
                    LLM приводит ответы агентов к общей схеме. Выбор ниже считается проверяемыми правилами, чтобы менеджер мог объяснить решение.
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
            <PanelHeader title="Короткий список агентов" eyebrow="Покрытие, специализация и история ответов" />
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

              <div className="rounded-md border border-secondary-container bg-secondary-container/25 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-text">
                  <MailCheck className="h-4 w-4 text-primary" aria-hidden />
                  Черновики RFQ агентам
                </div>
                <div className="space-y-2">
                  {agentRequestAgents.slice(0, 3).map((agent) => (
                    <details key={agent.id} className="rounded-md border border-border-hairline bg-white p-2">
                      <summary className="cursor-pointer text-sm font-semibold text-ink-text">
                        {agent.companyName}
                        {snapshot.requests.some((request) => request.agentId === agent.id) ? (
                          <span className="ml-2 text-xs font-normal text-muted-text">
                            {snapshot.requests.find((request) => request.agentId === agent.id)?.status}
                          </span>
                        ) : null}
                      </summary>
                      <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-surface-navy p-3 text-xs leading-5 text-inverse-on-surface">
                        {buildAgentRFQPreview(snapshot.case, agent.companyName)}
                      </pre>
                    </details>
                  ))}
                </div>
              </div>

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
            <PanelHeader title="Письмо клиенту" eyebrow="Quote versioning" />
            <PanelBody className="space-y-3">
              {snapshot.quoteVersions.length === 0 ? (
                <p className="text-sm text-muted-text">Клиентское письмо появится после создания Quote v1.</p>
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
                      <p className="mt-3 text-label-caps uppercase tracking-wide text-muted-text">Готовый email клиенту</p>
                      <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-surface-navy p-3 text-xs leading-5 text-inverse-on-surface">
                        {version.draftText}
                      </pre>
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

function processingResultLabel(result: string) {
  if (result === "llm_normalized_and_zod_validated") return "LLM + Zod";
  if (result === "llm_fallback_demo_safe_normalization") return "Fallback";
  if (result === "deterministic_fixture_normalization") return "Fixture";
  return result.replaceAll("_", " ");
}

function buildAgentRFQPreview(rfqCase: { requestNumber: string; originPort: string | null; originCity: string | null; destinationPort: string | null; destinationCity: string | null; cargoDescription: string | null; containerQuantity: number | null; containerType: string | null; incoterms: string | null; cargoReadyDate: string | null; cargoReadyInfo: string | null; serviceScope: string | null }, agentName: string) {
  const route = `${rfqCase.originPort ?? rfqCase.originCity ?? "origin TBD"} -> ${rfqCase.destinationPort ?? rfqCase.destinationCity ?? "destination TBD"}`;

  return [
    `To: ${agentName}`,
    `Subject: RFQ ${rfqCase.requestNumber} · ${route}`,
    "",
    "Здравствуйте,",
    "",
    "Просим предоставить ставку по следующему запросу:",
    `Маршрут: ${route}`,
    `Груз: ${rfqCase.cargoDescription ?? "уточняется"}`,
    `Контейнеры: ${rfqCase.containerQuantity ?? "?"} x ${rfqCase.containerType ?? "контейнер"}`,
    `Incoterms: ${rfqCase.incoterms ?? "уточняется"}`,
    `Готовность груза: ${rfqCase.cargoReadyDate ?? rfqCase.cargoReadyInfo ?? "уточняется"}`,
    `Объем сервиса: ${rfqCase.serviceScope ?? "ocean FCL + локальные сборы"}`,
    "",
    "Пожалуйста, включите ocean freight, локальные сборы отправления и назначения, документацию, transit time, free days, validity, inclusions/exclusions и условия по оборудованию.",
    "",
    "Спасибо."
  ].join("\n");
}
