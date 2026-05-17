import { Container } from "../ui/Container";

const leaderboard = [
  { rank: 1, name: "Marcus T.", archetype: "Paint Beast", overall: 88 },
  { rank: 2, name: "Jordan W.", archetype: "3 & D Wing", overall: 84 },
  { rank: 3, name: "Devon B.", archetype: "Slasher", overall: 81 },
  { rank: 4, name: "Tyler R.", archetype: "Playmaking SC", overall: 79 },
  { rank: 5, name: "Chris M.", archetype: "Stretch 5", overall: 77 },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full bg-accent/[0.05] blur-[200px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute right-[-280px] top-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/[0.03]" />
        <div className="absolute right-[-140px] top-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full border border-white/[0.025]" />
        <div className="absolute right-[0px] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/[0.02]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(253,81,3,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(253,81,3,0.02) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-[55%_45%] gap-12 xl:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up delay-0">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium tracking-wide">
                Now live at Purdue
              </span>
            </div>

            <div className="mb-8 animate-fade-in-up delay-100">
              <h1 className="font-heading text-[76px] sm:text-[96px] lg:text-[108px] xl:text-[128px] uppercase leading-[0.87] tracking-tight">
                <span className="block">Who</span>
                <span className="block">Runs</span>
                <span className="block text-accent">Your</span>
                <span className="block">Court?</span>
              </h1>
            </div>

            <p className="text-[17px] text-muted-foreground max-w-md leading-relaxed mb-10 animate-fade-in-up delay-200">
              The social layer for college pickup basketball. Check in at your
              rec center, get rated by real opponents, and find out where you
              rank on your campus leaderboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up delay-300">
              <a
                href="#download"
                className="inline-flex items-center justify-center gap-2.5 h-14 px-8 text-base font-semibold bg-accent text-white rounded-full hover:bg-accent/90 active:scale-[0.98] transition-all"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Download Free
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base font-semibold bg-card text-foreground border border-border rounded-full hover:bg-muted hover:border-border/80 active:scale-[0.98] transition-all"
              >
                How It Works
              </a>
            </div>

            {/* Stats row — numbers in Bebas Neue */}
            <div className="flex items-center gap-8 pt-8 border-t border-border animate-fade-in-up delay-400">
              <div>
                <p className="font-display text-[40px] text-accent leading-none mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>40+</p>
                <p className="text-sm text-muted-foreground">Player archetypes</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="font-display text-[40px] leading-none mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>45–99</p>
                <p className="text-sm text-muted-foreground">Rating scale</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="font-display text-[40px] leading-none mb-1">Real</p>
                <p className="text-sm text-muted-foreground">Peer ratings only</p>
              </div>
            </div>
          </div>

          {/* Right: Leaderboard card */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-right delay-300">
            <div className="relative mt-12 lg:mt-0">
              {/* Rank-up notification */}
              <div className="absolute -top-5 -right-4 sm:-right-8 bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl shadow-black/60 z-10 animate-float-delayed">
                <div className="w-8 h-8 bg-accent/15 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight">You moved up</p>
                  <p className="text-[11px] text-accent font-medium">
                    <span className="font-display" style={{ fontVariantNumeric: "tabular-nums" }}>#3</span>
                    {" → "}
                    <span className="font-display" style={{ fontVariantNumeric: "tabular-nums" }}>#2</span>
                    {" at Purdue"}
                  </p>
                </div>
              </div>

              {/* Main leaderboard card */}
              <div className="relative bg-card border border-border rounded-2xl p-5 w-[320px] sm:w-[340px] shadow-2xl shadow-black/60">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-0.5">
                      Season 1 · Week 3
                    </p>
                    <p className="font-heading text-[22px] uppercase tracking-wide leading-tight">
                      Purdue Basketball
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1 mt-0.5 shrink-0">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-400 font-semibold tracking-wide">LIVE</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {leaderboard.map((player, i) => (
                    <div
                      key={player.rank}
                      className={`rank-item flex items-center gap-3 px-3 py-2.5 rounded-xl ${
                        player.rank === 1
                          ? "bg-accent/10 border border-accent/25"
                          : "bg-muted/60"
                      }`}
                      style={{ animationDelay: `${400 + i * 80}ms` }}
                    >
                      <span
                        className={`font-display text-[17px] w-6 shrink-0 text-center leading-none ${
                          player.rank === 1 ? "text-accent" : "text-muted-foreground"
                        }`}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {String(player.rank).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight">{player.name}</p>
                        <p className="text-[11px] text-muted-foreground">{player.archetype}</p>
                      </div>
                      <span
                        className={`font-display text-[28px] leading-none shrink-0 ${
                          player.rank === 1 ? "text-accent" : "text-foreground"
                        }`}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {player.overall}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    <span className="font-display text-[14px]" style={{ fontVariantNumeric: "tabular-nums" }}>47</span>
                    {" players ranked"}
                  </p>
                  <p className="text-[11px] text-accent font-semibold cursor-pointer hover:text-accent/80 transition-colors">
                    View full board →
                  </p>
                </div>
              </div>

              {/* Floating archetype card */}
              <div className="absolute -bottom-10 -left-6 sm:-left-12 bg-card border border-border rounded-2xl p-4 w-44 shadow-2xl shadow-black/60 z-10 animate-float">
                <p className="text-[9px] text-muted-foreground uppercase tracking-[0.18em] mb-2">
                  Your Archetype
                </p>
                <p className="font-heading text-[18px] uppercase leading-tight mb-0.5">3 & D Wing</p>
                <p className="font-display text-[38px] text-accent leading-none mb-3" style={{ fontVariantNumeric: "tabular-nums" }}>84</p>
                <div className="space-y-2">
                  {[
                    { label: "DEF", val: 88 },
                    { label: "SHT", val: 83 },
                    { label: "FIN", val: 78 },
                    { label: "PLY", val: 71 },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="text-[9px] text-muted-foreground w-5 shrink-0 tracking-wide">{label}</span>
                      <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${(val / 99) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
