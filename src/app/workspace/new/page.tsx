import { MessageSquareText, Mail, Mic, Send } from "lucide-react";
import { createRFQFromInputAction } from "@/app/workspace/actions";
import { Button } from "@/components/ui/button";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";

export const dynamic = "force-dynamic";

const sampleChat = `09:12 Customer: Need Ningbo to Hamburg for 2 x 40HC electronics.
09:18 Desk: Please confirm Incoterms and ready date.
09:24 Customer: FOB Ningbo. Cargo ready next week. Please quote ocean FCL.`;

export default async function NewRFQPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <p className="text-label-caps uppercase tracking-wide text-primary">Live intake</p>
        <h1 className="mt-1 text-display-lg font-semibold text-ink-text">New RFQ</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-text">
          Paste a customer email, chat or call note. FreightPilot extracts the RFQ, stores a normal case, calculates agent matching from the database and lets the manager approve simulated sends.
        </p>
      </div>

      <Panel>
        <PanelHeader title="Create RFQ Case" eyebrow="LLM extraction with validated fallback" />
        <PanelBody>
          {params.error === "missing-input" ? (
            <div className="mb-4 rounded-md border border-error/20 bg-error-container p-3 text-sm text-on-error-container">
              Paste customer input before creating an RFQ.
            </div>
          ) : null}

          <form action={createRFQFromInputAction} className="space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border-hairline bg-white p-4 has-[:checked]:border-primary-container has-[:checked]:bg-primary-container/10">
                <input className="mt-1" type="radio" name="sourceType" value="email" defaultChecked />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-ink-text">
                    <Mail className="h-4 w-4 text-primary" aria-hidden />
                    Email
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted-text">Pasted customer email.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border-hairline bg-white p-4 has-[:checked]:border-primary-container has-[:checked]:bg-primary-container/10">
                <input className="mt-1" type="radio" name="sourceType" value="conversation" />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-ink-text">
                    <MessageSquareText className="h-4 w-4 text-primary" aria-hidden />
                    Chat / Messenger
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted-text">Teams, WhatsApp or messenger paste.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border-hairline bg-white p-4 has-[:checked]:border-primary-container has-[:checked]:bg-primary-container/10">
                <input className="mt-1" type="radio" name="sourceType" value="call_notes" />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-ink-text">
                    <Mic className="h-4 w-4 text-primary" aria-hidden />
                    Call notes
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted-text">Free-form notes after a call.</span>
                </span>
              </label>
            </div>

            <label className="block text-sm font-semibold text-ink-text">
              Customer input
              <textarea
                name="rawText"
                rows={14}
                className="mt-2 w-full resize-y rounded-md border border-border-hairline bg-white p-4 text-sm leading-6 outline-none focus:border-primary-container"
                defaultValue={sampleChat}
              />
            </label>

            <div className="rounded-md border border-secondary-container bg-secondary-container/30 p-4 text-sm leading-6 text-on-secondary-container">
              After creation, open the case, review the extracted fields and shortlist, then approve simulated sending to the selected agents.
            </div>

            <Button type="submit">
              <Send className="h-4 w-4" aria-hidden />
              Create RFQ and match agents
            </Button>
          </form>
        </PanelBody>
      </Panel>
    </div>
  );
}
