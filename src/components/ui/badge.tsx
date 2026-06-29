import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "teal" | "amber" | "red" | "blue";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-container text-on-surface-variant border-border-hairline",
  teal: "bg-primary-container/10 text-primary border-primary-container/20",
  amber: "bg-tertiary-container/15 text-on-tertiary-container border-tertiary-container/30",
  red: "bg-error-container text-on-error-container border-error/20",
  blue: "bg-secondary-container/50 text-on-secondary-container border-secondary-container"
};

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}
