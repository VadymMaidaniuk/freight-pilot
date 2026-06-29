import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { approveRoutingAction, overrideManualReviewAction } from "@/app/workspace/actions";
import { CaseStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { matchAgents } from "@/lib/domain/agent-matching";
import { loadCaseSnapshot, loadWorkspaceSummary } from "@/lib/repositories/workspace-repository";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const summary = await loadWorkspaceSummary();
  const approvalCases = summary.cases.filter((rfqCase) => rfqCase.status === "ready_for_routing" || rfqCase.status === "manual_review");
  const snapshots = (await Promise.all(approvalCases.map((rfqCase) => loadCaseSnapshot(rfqCase.id)))).filter(Boolean);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <p className="text-label-caps uppercase tracking-wide text-primary">Manager approvals</p>
        <h1 className="mt-1 text-display-lg font-semibold text-ink-text">Approvals</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-text">
          Review RFQ drafts and calculated shortlists before simulating agent sends.
        </p>
      </div>

      <div className="grid gap-4">
        {snapshots.length === 0 ? (
          <Panel>
            <PanelBody>No RFQ drafts are waiting for approval.</PanelBody>
          </Panel>
        ) : (
          snapshots.map((snapshot) => {
            if (!snapshot) return null;
            const matches = matchAgents({
              rfqCase: snapshot.case,
              agents: snapshot.agents,
              coverages: snapshot.coverages,
              metrics: snapshot.metrics
            });

            return (
              <Panel key={snapshot.case.id}>
                <PanelHeader
                  title={`${snapshot.case.requestNumber} · ${snapshot.case.originCity} -> ${snapshot.case.destinationCity}`}
                  eyebrow={snapshot.input.sourceType.replace("_", " ")}
                  actions={<CaseStatusBadge status={snapshot.case.status} />}
                />
                <PanelBody className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
                  <div>
                    <p className="text-sm leading-6 text-muted-text">{snapshot.case.clarificationDraft}</p>
                    <Link href={`/workspace/cases/${snapshot.case.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Review full case
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {matches.slice(0, 3).map((match) => (
                      <div key={match.agent.id} className="rounded-md border border-border-hairline bg-surface-container-lowest p-3">
                        <div className="flex justify-between gap-2">
                          <p className="font-semibold text-ink-text">{match.agent.companyName}</p>
                          <span className="font-mono text-sm text-primary">{match.score}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-text">
                          {match.coverage[0]?.port}, response {match.metric.responseRate}%, complete {match.metric.quoteCompletenessRate}%.
                        </p>
                      </div>
                    ))}
                  </div>
                  {snapshot.case.status === "manual_review" ? (
                    <form action={overrideManualReviewAction}>
                      <input type="hidden" name="caseId" value={snapshot.case.id} />
                      <Button variant="secondary">Override review</Button>
                    </form>
                  ) : (
                    <form action={approveRoutingAction} className="space-y-2">
                      <input type="hidden" name="caseId" value={snapshot.case.id} />
                      {matches.slice(0, 3).map((match) => (
                        <input key={match.agent.id} type="hidden" name="agentIds" value={match.agent.id} />
                      ))}
                      <Button>
                        <CheckCircle2 className="h-4 w-4" aria-hidden />
                        Approve & simulate sending
                      </Button>
                    </form>
                  )}
                </PanelBody>
              </Panel>
            );
          })
        )}
      </div>
    </div>
  );
}
