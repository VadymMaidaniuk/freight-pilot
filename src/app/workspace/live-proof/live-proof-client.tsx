"use client";

import { useState } from "react";
import { Bot, Loader2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";

type ResultState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "done"; fallback: boolean; message?: string; result: unknown };

export function LiveProofClient() {
  const [result, setResult] = useState<ResultState>({ state: "idle" });

  async function submit(formData: FormData) {
    setResult({ state: "loading" });
    const response = await fetch("/api/live-proof", {
      method: "POST",
      body: formData
    });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      setResult({ state: "error", message: payload.message ?? "Live Proof request failed." });
      return;
    }

    setResult({
      state: "done",
      fallback: Boolean(payload.fallback),
      message: payload.message,
      result: payload.result
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Panel>
        <PanelHeader title="Live Proof Input" eyebrow="Experimental extraction" />
        <PanelBody>
          <form action={submit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-ink-text">
                Mode
                <select name="mode" className="mt-1 h-10 w-full rounded-md border border-border-hairline bg-white px-3 text-sm outline-none focus:border-primary-container">
                  <option value="rfq">RFQ extraction</option>
                  <option value="rate">Rate normalization</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-ink-text">
                Source
                <select name="sourceType" className="mt-1 h-10 w-full rounded-md border border-border-hairline bg-white px-3 text-sm outline-none focus:border-primary-container">
                  <option value="email">Pasted email</option>
                  <option value="conversation">Pasted chat</option>
                  <option value="call_notes">Call notes</option>
                  <option value="messy_text">Messy rate reply</option>
                  <option value="xlsx">Controlled XLSX text</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-semibold text-ink-text">
              Input text
              <textarea
                name="rawText"
                rows={12}
                className="mt-1 w-full resize-y rounded-md border border-border-hairline bg-white p-3 text-sm leading-6 outline-none focus:border-primary-container"
                defaultValue={"Please quote 2 x 40HC from Valparaiso, Chile to Gdansk, Poland. Cargo is green coffee beans, FOB. Cargo expected next week."}
              />
            </label>
            <div className="rounded-md border border-secondary-container bg-secondary-container/30 p-3 text-sm leading-6 text-on-secondary-container">
              Configured local provider: <span className="font-mono">google/gemma-4-12b-qat</span> via LM Studio endpoint from environment.
            </div>
            <Button type="submit" disabled={result.state === "loading"}>
              {result.state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Bot className="h-4 w-4" aria-hidden />}
              Run Live Proof
            </Button>
          </form>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader
          title="Validated Output"
          eyebrow="Zod-checked"
          actions={
            result.state === "done" ? (
              <Badge tone={result.fallback ? "amber" : "teal"}>{result.fallback ? "Fallback used" : "Live validated"}</Badge>
            ) : null
          }
        />
        <PanelBody>
          {result.state === "idle" ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-md border border-dashed border-border-hairline text-center text-sm text-muted-text">
              <div>
                <Upload className="mx-auto mb-3 h-7 w-7 text-primary" aria-hidden />
                Paste controlled synthetic input and run extraction.
              </div>
            </div>
          ) : null}

          {result.state === "loading" ? <p className="text-sm text-muted-text">Waiting for LM Studio response...</p> : null}
          {result.state === "error" ? <p className="text-sm text-on-error-container">{result.message}</p> : null}
          {result.state === "done" ? (
            <div className="space-y-3">
              {result.message ? <div className="rounded-md border border-tertiary-container bg-tertiary-container/15 p-3 text-sm text-on-tertiary-container">{result.message}</div> : null}
              <pre className="max-h-[520px] overflow-auto rounded-md border border-border-hairline bg-surface-navy p-4 text-xs leading-5 text-inverse-on-surface">
                {JSON.stringify(result.result, null, 2)}
              </pre>
            </div>
          ) : null}
        </PanelBody>
      </Panel>
    </div>
  );
}
