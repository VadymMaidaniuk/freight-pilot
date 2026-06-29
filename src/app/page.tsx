import { ArrowRight, ClipboardList, GitCompareArrows, Network } from "lucide-react";
import Link from "next/link";

const valueAreas = [
  {
    title: "RFQ Intake",
    body: "Fragmented emails, chats and call notes become structured cases with evidence, missing fields and conflicts retained.",
    icon: ClipboardList
  },
  {
    title: "Agent Intelligence",
    body: "Coverage, cargo capability and transparent historical metrics drive the shortlist before any RFQ is sent.",
    icon: Network
  },
  {
    title: "Rate Comparison",
    body: "Late, incomplete and Excel-originated replies normalize into comparable options without changing prior quote versions.",
    icon: GitCompareArrows
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section
        className="relative flex min-h-[82vh] items-center overflow-hidden bg-surface-navy px-6 py-20 text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(11,34,57,0.96) 0%, rgba(11,34,57,0.82) 42%, rgba(11,34,57,0.28) 100%), url('/demo/rfq-inbox-workspace.png')",
          backgroundSize: "cover",
          backgroundPosition: "center right"
        }}
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <p className="mb-4 text-label-caps uppercase tracking-[0.22em] text-primary-fixed-dim">FreightPilot</p>
          <h1 className="max-w-3xl text-[42px] font-semibold leading-[1.08] tracking-normal md:text-[60px]">
            Turn freight inquiries into ready-to-send quotes - faster, with full control.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-7 text-inverse-on-surface/82">
            AI Quote Desk for freight forwarders. Built to show evidence, missing fields, agent fit, normalized rates and controlled quote decisions.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/workspace"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary-container px-5 text-sm font-bold text-white transition hover:brightness-95"
            >
              Open Demo Workspace
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <span className="text-sm font-medium text-inverse-on-surface/70">Interactive demonstration using synthetic data.</span>
          </div>
        </div>
      </section>

      <section className="border-t border-border-hairline bg-surface px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {valueAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article key={area.title} className="rounded-lg border border-border-hairline bg-white p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary-container/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="text-title-sm font-semibold text-ink-text">{area.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-text">{area.body}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
