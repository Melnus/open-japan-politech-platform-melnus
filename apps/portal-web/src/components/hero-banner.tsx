"use client";

import { FadeIn } from "@ojpp/ui";
import { SERVICES } from "@/lib/constants";
import { JapanMap } from "./japan-map";

export function HeroBanner() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      {/* Japan map — massive background right, HIGH visibility */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-end"
        style={{ opacity: 0.45 }}
      >
        <div
          className="term-line mr-[-5%] h-[90%] w-[70%]"
          style={{ "--delay": "0.4s" } as React.CSSProperties}
        >
          <JapanMap />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Terminal prompt */}
        <div className="pt-20 sm:pt-28">
          <p
            className="term-line mono text-xs tracking-[2px] text-[var(--accent)]"
            style={{ "--delay": "0.1s" } as React.CSSProperties}
          >
            {"$ curl -fsSL ojpp.dev/install | sh"}
          </p>
        </div>

        {/* MASSIVE title with chromatic aberration */}
        <div className="mt-6">
          <h1 className="hero-title">
            <span
              className="hero-chroma term-line block text-[var(--text)]"
              style={{ "--delay": "0.3s" } as React.CSSProperties}
            >
              OPEN
            </span>
            <span
              className="hero-chroma term-line block text-[var(--text)]"
              style={{ "--delay": "0.5s" } as React.CSSProperties}
            >
              JAPAN
              <span className="japan-dot" />
            </span>
            <span
              className="term-line block text-[var(--accent)]"
              style={{ "--delay": "0.7s" } as React.CSSProperties}
            >
              POLITECH
            </span>
          </h1>
        </div>

        {/* Installation terminal */}
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:gap-16">
          <div className="w-full max-w-lg shrink-0">
            <div className="border border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-sm">
              {/* Terminal dots */}
              <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-3 py-2">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-[var(--neon-pink)]"
                  style={{ opacity: 0.8 }}
                />
                <span
                  className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]"
                  style={{ opacity: 0.8 }}
                />
                <span
                  className="h-2.5 w-2.5 rounded-full bg-[var(--neon-blue)]"
                  style={{ opacity: 0.8 }}
                />
                <span className="mono ml-2 text-[0.5rem] text-[var(--text-ghost)]">
                  {"ojpp-init — 6 modules"}
                </span>
              </div>

              {/* Install output */}
              <div className="p-4">
                <p
                  className="term-line mono text-[0.65rem] text-[var(--text-dim)]"
                  style={{ "--delay": "1.0s" } as React.CSSProperties}
                >
                  {">>> Installing OJPP v0.1.2..."}
                </p>

                <div className="mt-3 space-y-2">
                  {SERVICES.map((svc, i) => (
                    <div
                      key={svc.id}
                      className="term-line flex items-center gap-3"
                      style={{ "--delay": `${1.2 + i * 0.18}s` } as React.CSSProperties}
                    >
                      <span
                        className="check-pop inline-block text-sm font-bold"
                        style={
                          {
                            "--delay": `${1.5 + i * 0.18}s`,
                            color: svc.color,
                            filter: `drop-shadow(0 0 4px ${svc.color})`,
                          } as React.CSSProperties
                        }
                      >
                        {"✓"}
                      </span>
                      <span
                        className="mono w-28 text-[0.6rem] font-bold tracking-[1.5px]"
                        style={{ color: svc.color }}
                      >
                        {svc.name}
                      </span>
                      <div className="bar-track flex-1">
                        <div
                          className="progress-bar"
                          style={
                            {
                              "--delay": `${1.3 + i * 0.18}s`,
                              background: `linear-gradient(90deg, ${svc.color}, ${svc.color}dd)`,
                              boxShadow: `0 0 8px ${svc.color}60`,
                            } as React.CSSProperties
                          }
                        />
                      </div>
                      <span className="mono text-[0.5rem] text-[var(--text-ghost)]">READY</span>
                    </div>
                  ))}
                </div>

                <p
                  className="term-line mono mt-4 text-[0.65rem] font-bold text-[var(--accent)]"
                  style={
                    {
                      "--delay": "2.6s",
                      textShadow: "0 0 12px var(--accent), 0 0 30px var(--accent)",
                    } as React.CSSProperties
                  }
                >
                  {"✨ 6 apps × 21 models × 50+ endpoints — ALL SYSTEMS GO"}
                </p>
              </div>
            </div>
          </div>

          {/* Subtitle — MASSIVE, prominent */}
          <FadeIn delay={2.8}>
            <div className="pb-4">
              <p
                className="text-xl font-bold leading-snug text-[var(--text)] sm:text-2xl md:text-3xl"
                style={{
                  textShadow: "0 0 40px rgba(180,255,57,0.3), 0 0 80px rgba(180,255,57,0.15)",
                }}
              >
                AIエージェント時代の
                <br />
                <span className="text-[var(--accent)]">政治インフラ</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-dim)] sm:text-base">
                日本の政治データを完全オープンに可視化。
                <br />
                政党にも企業にもよらない。
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
