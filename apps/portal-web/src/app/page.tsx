import { ALPHA_AUTONOMY, B_STD } from "@ojpp/sbcm-engine";
import { HeroBanner } from "@/components/hero-banner";
import { ServiceBentoGrid } from "@/components/service-bento-grid";
import { getPortalStats } from "@/lib/queries";

export const revalidate = 300;

export default async function PortalPage() {
  const stats = await getPortalStats();

  return (
    <div className="flex flex-col bg-[#04040a] text-[#f0f0f5]">
      <div className="border-b border-[var(--border)] bg-black/40 px-6 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-amber-500/50 bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <span className="mono text-xs font-bold">G-C</span>
            </div>
            <div>
              <p className="mono text-[0.6rem] tracking-[3px] text-amber-500/70">STELLAR OS v4.0 PROXY</p>
              <p className="kpi-value text-sm font-bold text-white">POLITICAL COMMAND CENTER</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="text-right">
              <p className="mono text-[0.5rem] text-[var(--text-ghost)]">QUANTUM UNIT</p>
              <p className="kpi-value text-xs text-[var(--accent)]">B_std: {B_STD.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="mono text-[0.5rem] text-[var(--text-ghost)]">AUTONOMY COEFF</p>
              <p className="kpi-value text-xs text-[var(--accent)]">α: {ALPHA_AUTONOMY}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="mono text-[0.6rem] font-bold text-emerald-400">PHYSICS SYNC: OK</span>
            </div>
          </div>
        </div>
      </div>
      <HeroBanner />
      <section className="relative py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-end justify-between border-l-4 border-[var(--accent)] pl-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tighter sm:text-4xl text-white">
                ACTIVE MODULES <span className="text-[var(--text-ghost)]">/ 06</span>
              </h2>
              <p className="mt-2 text-sm text-[var(--text-dim)]">物理法則によって制御される6つのサブシステム</p>
            </div>
            <div className="text-right">
              <p className="mono text-[0.6rem] text-[var(--accent)]">TOTAL TELEMETRY</p>
              <p className="kpi-value text-2xl font-bold">LIVE</p>
            </div>
          </div>
          <ServiceBentoGrid stats={stats} />
        </div>
      </section>
      <section className="border-t border-[var(--border)] bg-black/60 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-6">
            <p className="mono mb-4 text-[0.7rem] text-blue-400">SYSTEM DEBUG LOG_</p>
            <div className="space-y-2 font-mono text-[0.65rem] text-[var(--text-ghost)]">
              <p><span className="text-emerald-500">[INFO]</span> G-Cart protocol engaged. Verifying entropy reduction via P-Bill.</p>
              <p><span className="text-amber-500">[WARN]</span> Potential bucking risk detected at Pacific Interface (Three-Body Interaction).</p>
              <p><span className="text-blue-500">[INFO]</span> Relativistic phase control active. Latency mismatch: 0.00ms (Regional).</p>
              <p className="cursor-blink">_</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
