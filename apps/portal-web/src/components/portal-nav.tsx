"use client";

import Link from "next/link";
import { PLATFORM_META } from "@/lib/constants";
import { DataPulse } from "./data-pulse";

export function PortalNav() {
  return (
    <header className="nav-glass sticky top-0 z-50 border-b border-[var(--border)]">
      <div className="flex h-10 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="kpi-value text-sm font-bold tracking-[4px] text-[var(--accent)]">
            OJPP
          </span>
          <span className="hidden h-3 w-px bg-[var(--text-ghost)] sm:block" />
          <span className="hidden mono text-[0.5rem] tracking-[3px] text-[var(--text-ghost)] sm:block">
            POLITICAL COMMAND CENTER
          </span>
        </Link>

        <DataPulse size={4} label="OPERATIONAL" />

        <div className="flex items-center gap-4">
          <a
            href={PLATFORM_META.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-[0.6rem] tracking-[2px] text-[var(--text-dim)] transition-colors hover:text-[var(--accent)]"
          >
            GITHUB
          </a>
          <Link
            href="/about"
            className="mono text-[0.6rem] tracking-[2px] text-[var(--text-dim)] transition-colors hover:text-[var(--accent)]"
          >
            ABOUT
          </Link>
        </div>
      </div>
    </header>
  );
}
