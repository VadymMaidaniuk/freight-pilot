import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-lg border border-border-hairline bg-white", className)}>{children}</section>;
}

export function PanelHeader({ title, eyebrow, actions }: { title: string; eyebrow?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border-hairline bg-surface-bright px-5 py-4">
      <div>
        {eyebrow ? <p className="mb-1 text-label-caps uppercase tracking-wide text-muted-text">{eyebrow}</p> : null}
        <h2 className="text-title-sm font-semibold text-ink-text">{title}</h2>
      </div>
      {actions}
    </div>
  );
}

export function PanelBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
