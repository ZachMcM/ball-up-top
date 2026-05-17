import { Container } from "../ui/Container";

export function Ratings() {
  return (
    <section className="py-24 md:py-36 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* Left: copy */}
          <div>
            <p className="text-sm text-accent font-semibold uppercase tracking-widest mb-4">
              The Rating System
            </p>
            <h2 className="font-heading text-[52px] sm:text-[64px] uppercase leading-[0.9] tracking-tight mb-6">
              What the court actually says about your game.
            </h2>
            <p className="text-[16px] text-muted-foreground leading-relaxed mb-8 max-w-md">
              Your OVR is calculated from peer ratings submitted by the players who guarded you. Not self-reported. Not algorithmic. What real opponents said about your real game, within hours of the session.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Credibility-weighted",
                  body: "Ratings from regulars you've overlapped with repeatedly carry more weight. Outliers are detected and discounted automatically.",
                },
                {
                  title: "Partial anonymity",
                  body: "Raters know you'll see that they rated you. You won't see their specific scores. This combination produces honest, calibrated ratings without social conflict.",
                },
                {
                  title: "EMA algorithm",
                  body: "The exponential moving average weights recent sessions more heavily. A strong run last week matters more than a bad session three months ago.",
                },
              ].map(({ title, body }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-1 shrink-0 bg-accent/40 rounded-full mt-1" />
                  <div>
                    <p className="font-semibold text-sm mb-1">{title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: OVR reveal visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              {/* OVR before/after — the reveal moment */}
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-6">
                  Session complete · 3 players rated you
                </p>

                <div className="flex items-end justify-center gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Before</p>
                    <p
                      className="font-display text-[72px] text-muted-foreground/40 leading-none"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      71
                    </p>
                  </div>

                  <svg className="w-8 h-8 text-accent mb-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>

                  <div className="text-center">
                    <p className="text-[11px] text-accent uppercase tracking-wide mb-1 font-semibold">After</p>
                    <p
                      className="font-display text-[96px] text-accent leading-none"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      74
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-3 mb-5">
                  <p className="text-xs text-muted-foreground text-center">Skill breakdown this session</p>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {[
                      { label: "SHT", val: 81 },
                      { label: "FIN", val: 87 },
                      { label: "PLY", val: 79 },
                      { label: "DEF", val: 74 },
                    ].map(({ label, val }) => (
                      <div key={label} className="text-center">
                        <p
                          className="font-display text-[22px] leading-none mb-0.5"
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {val}
                        </p>
                        <p className="text-[9px] text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">Campus rank</span>
                  <span className="font-semibold">
                    <span className="text-muted-foreground/50 line-through mr-2">
                      <span className="font-display text-[13px]" style={{ fontVariantNumeric: "tabular-nums" }}>#9</span>
                    </span>
                    <span className="text-accent font-display text-[15px]" style={{ fontVariantNumeric: "tabular-nums" }}>#6</span>
                  </span>
                </div>
              </div>

              {/* Floating push notification */}
              <div className="absolute -bottom-6 -left-4 sm:-left-10 bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl shadow-black/60 w-64 animate-float">
                <div className="w-9 h-9 bg-accent/15 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold leading-tight">Ball Up Top</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    You climbed to{" "}
                    <span className="text-accent font-semibold">
                      <span className="font-display" style={{ fontVariantNumeric: "tabular-nums" }}>#6</span>
                    </span>
                    {" "}— DeShawn is at{" "}
                    <span className="font-display" style={{ fontVariantNumeric: "tabular-nums" }}>#5</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
