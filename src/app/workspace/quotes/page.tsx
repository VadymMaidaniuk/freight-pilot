import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { RateStatusBadge } from "@/components/status-badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { loadWorkspaceSummary } from "@/lib/repositories/workspace-repository";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ActiveQuotesPage() {
  const summary = await loadWorkspaceSummary();
  const activeRows = summary.quotes.map((quote) => {
    const rfqCase = summary.cases.find((item) => item.id === quote.caseId);
    const version = summary.quoteVersions.find((item) => item.quoteId === quote.id && item.versionNumber === quote.currentVersion);
    const selectedRate = summary.rateOptions.find((item) => item.id === quote.selectedRateOptionId);
    const lateRate = summary.rateOptions.find((item) => item.caseId === quote.caseId && item.status === "Late response");
    const agent = summary.agents.find((item) => item.id === selectedRate?.agentId);
    return { quote, rfqCase, version, selectedRate, lateRate, agent };
  });

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <p className="text-label-caps uppercase tracking-wide text-primary">Quote control</p>
        <h1 className="mt-1 text-display-lg font-semibold text-ink-text">Active Quotes</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-text">
          Customer quote drafts are versioned. Late rates create review decisions and never rewrite prior quote versions.
        </p>
      </div>

      {activeRows.length === 0 ? (
        <Panel>
          <PanelBody className="flex items-center gap-3 text-muted-text">
            <FileText className="h-5 w-5 text-primary" aria-hidden />
            No quote drafts yet. Open CL-001 and create Quote v1 from the decision panel.
          </PanelBody>
        </Panel>
      ) : (
        <Panel>
          <PanelHeader title="Customer Quote Drafts" eyebrow="Version history" />
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quote</th>
                  <th>RFQ</th>
                  <th>Selected rate</th>
                  <th>Current price</th>
                  <th>Status</th>
                  <th>Late alert</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {activeRows.map(({ quote, rfqCase, version, selectedRate, lateRate, agent }) => (
                  <tr key={quote.id}>
                    <td>
                      <div className="font-semibold text-ink-text">Quote v{quote.currentVersion}</div>
                      <div className="text-xs text-muted-text">{quote.status}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-ink-text">{rfqCase?.requestNumber}</div>
                      <div className="font-mono text-xs text-muted-text">
                        {rfqCase?.originCity} -&gt; {rfqCase?.destinationCity}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-ink-text">{agent?.companyName}</div>
                      <div className="text-xs text-muted-text">{selectedRate?.shippingLine}</div>
                    </td>
                    <td className="font-mono text-data-mono font-semibold tabular-nums">{version ? formatMoney(version.finalCustomerPrice) : "-"}</td>
                    <td>{selectedRate ? <RateStatusBadge status={selectedRate.status} /> : null}</td>
                    <td>
                      {lateRate && lateRate.id !== selectedRate?.id ? (
                        <span className="text-sm font-semibold text-primary">Review late rate</span>
                      ) : (
                        <span className="text-sm text-muted-text">None</span>
                      )}
                    </td>
                    <td className="text-right">
                      <Link href={`/workspace/cases/${quote.caseId}`} className="inline-flex h-8 items-center gap-1 rounded-md bg-primary-container px-3 text-xs font-bold text-white">
                        Open
                        <ArrowRight className="h-3 w-3" aria-hidden />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
