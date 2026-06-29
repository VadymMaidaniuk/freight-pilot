import { LiveProofClient } from "./live-proof-client";

export const dynamic = "force-dynamic";

export default function LiveProofPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <p className="text-label-caps uppercase tracking-wide text-primary">Presenter control</p>
        <h1 className="mt-1 text-display-lg font-semibold text-ink-text">Live Proof</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-text">
          Experimental live extraction for pasted synthetic text. Guided Demo remains deterministic and does not require a hosted LLM.
        </p>
      </div>
      <LiveProofClient />
    </div>
  );
}
