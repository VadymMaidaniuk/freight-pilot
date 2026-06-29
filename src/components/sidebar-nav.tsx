"use client";

import { ClipboardCheck, Inbox, Network, Quote, ShipWheel } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/workspace", label: "RFQ Inbox", icon: Inbox },
  { href: "/workspace/quotes", label: "Active Quotes", icon: Quote },
  { href: "/workspace/approvals", label: "Approvals", icon: ClipboardCheck },
  { href: "/workspace/agents", label: "Agent Network", icon: Network }
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-surface-navy md:inset-y-0 md:left-0 md:w-sidebar-width md:border-r md:border-t-0">
      <div className="hidden px-6 py-6 md:block">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
            <ShipWheel className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block text-title-sm font-bold text-white">FreightPilot</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-primary-fixed-dim/70">AI Quote Desk</span>
          </span>
        </Link>
      </div>

      <nav className="grid grid-cols-4 md:block md:space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/workspace" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 py-3 text-[11px] font-semibold text-on-primary-fixed-variant/70 transition md:flex-row md:justify-start md:gap-3 md:px-5 md:text-sm",
                active && "bg-primary-container/10 text-primary-fixed md:border-l-4 md:border-primary-fixed md:pl-4"
              )}
            >
              <Icon className="h-4 w-4 md:h-5 md:w-5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-white/10 px-5 py-5 text-xs text-primary-fixed-dim/70 md:absolute md:bottom-0 md:left-0 md:right-0 md:block">
        <p className="font-semibold text-white">Quotation Manager</p>
        <p>Guided Demo mode</p>
      </div>
    </aside>
  );
}
