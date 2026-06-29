import { Bell, Bot, RotateCcw, Search } from "lucide-react";
import type { ReactNode } from "react";
import { resetWorkspaceAction } from "@/app/workspace/actions";
import { SidebarNav } from "./sidebar-nav";
import { Button } from "./ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <div className="min-h-screen md:ml-sidebar-width">
        <header className="sticky top-0 z-30 flex h-topbar-height items-center justify-between border-b border-border-hairline bg-surface px-4 md:px-margin-page">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="hidden h-9 w-full max-w-md items-center gap-2 rounded-md border border-border-hairline bg-surface-container-low px-3 md:flex">
              <Search className="h-4 w-4 text-muted-text" aria-hidden />
              <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-text" placeholder="Search RFQs, lanes, agents..." />
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-secondary-container/60 bg-secondary-container/30 px-3 py-1 md:flex">
              <span className="h-2 w-2 rounded-full bg-primary-container" />
              <span className="text-label-caps uppercase tracking-wide text-on-secondary-container">Synthetic demo data</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <a
              href="/workspace/live-proof"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border-hairline bg-white px-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
            >
              <Bot className="h-4 w-4 text-primary" aria-hidden />
              <span className="hidden sm:inline">Live Proof</span>
            </a>
            <form action={resetWorkspaceAction}>
              <Button variant="secondary" className="h-9 px-3" title="Reset workspace">
                <RotateCcw className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </form>
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-hairline bg-white text-on-surface-variant">
              <Bell className="h-4 w-4" aria-hidden />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
            </button>
          </div>
        </header>
        <main className="px-4 py-6 md:px-margin-page md:py-8">{children}</main>
      </div>
    </div>
  );
}
