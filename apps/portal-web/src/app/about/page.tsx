import { FadeIn, ScrollReveal } from "@ojpp/ui";
import { PLATFORM_META, SERVICES } from "@/lib/constants";

export const metadata = {
  title: "About — OJPP",
  description: "Open Japan PoliTech Platform について",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <FadeIn>
        <a
          href="/"
          className="mono mb-6 inline-flex items-center gap-1.5 text-[0.7rem] tracking-[1.5px] text-[var(--text-dim)] transition-colors hover:text-[var(--accent)]"
        >
          {"← BACK TO PORTAL"}
        </a>
        <p className="label-upper mb-3 tracking-[4px]">{"// ABOUT"}</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
          {PLATFORM_META.name}
        </h1>
        <div className="mt-3 h-px w-24 bg-[var(--accent)]" />
        <p className="mt-3 text-sm text-[var(--text-dim)]">{PLATFORM_META.tagline}</p>
      </FadeIn>

      <ScrollReveal>
        <section className="mt-10">
          <p className="label-upper mb-3 tracking-[3px]">MISSION</p>
          <div className="border border-[var(--border)] bg-[var(--bg-card)] p-6 text-sm leading-relaxed text-[var(--text-dim)]">
            <p>
              政党にも企業にもよらない、完全オープンな政治テクノロジー基盤。
              AIエージェントが24時間政治データを監視・分析し、すべての市民とエージェントが政治の実態にアクセスできる世界を目指します。
            </p>
            <p className="mt-3">
              全コードはAGPL-3.0-or-laterで公開。データは自由に取得・分析・再配布できます。
            </p>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mt-10">
          <p className="label-upper mb-3 tracking-[3px]">{"ACTIVE MODULES // 6"}</p>
          <div className="space-y-1">
            {SERVICES.map((svc) => (
              <div
                key={svc.id}
                className="flex items-center gap-3 border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5"
              >
                <div
                  className="h-6 w-[2px] flex-shrink-0"
                  style={{ backgroundColor: svc.color, boxShadow: `0 0 6px ${svc.color}` }}
                />
                <span
                  className="kpi-value w-28 text-[0.65rem] font-bold tracking-[2px]"
                  style={{ color: svc.color }}
                >
                  {svc.name}
                </span>
                <span className="text-xs text-[var(--text-dim)]">{svc.description}</span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mt-10">
          <p className="label-upper mb-3 tracking-[3px]">TECH STACK</p>
          <div className="border border-[var(--border)] bg-[var(--bg-card)] p-5">
            <div className="grid grid-cols-3 gap-y-2">
              {[
                "Next.js 15",
                "React 19",
                "TypeScript",
                "Prisma",
                "PostgreSQL",
                "Tailwind CSS 4",
                "Motion",
                "Recharts",
                "Biome",
              ].map((tech) => (
                <span key={tech} className="kpi-value text-[0.65rem] text-[var(--text-dim)]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mt-10 text-center">
          <a
            href={PLATFORM_META.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-[var(--border)] px-6 py-2 kpi-value text-xs tracking-[2px] text-[var(--accent)] transition-colors hover:bg-[var(--accent-dim)]"
          >
            {"GITHUB →"}
          </a>
          <p className="mt-4 kpi-value text-[0.55rem] text-[var(--text-ghost)]">
            {PLATFORM_META.license}
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mt-10 border border-[var(--border)] bg-[var(--bg-card)] p-5 text-xs leading-relaxed text-[var(--text-ghost)]">
          <p className="label-upper mb-2 tracking-[3px] text-[var(--text-dim)]">NOTE</p>
          <p>
            ポータルおよび各サービスに表示されているデータは v{PLATFORM_META.version}{" "}
            時点の仮データです。 正式なデータソースとの連携は今後のアップデートで順次対応予定です。
          </p>
        </section>
      </ScrollReveal>
    </div>
  );
}
