import { Container } from "../ui/Container";

const leaderboardRows = [
  { rank: "01", name: "Marcus T.", archetype: "Paint Beast", overall: 88, delta: "+2", top: true },
  { rank: "02", name: "Jordan W.", archetype: "3 & D Wing", overall: 84, delta: "+1", top: false },
  { rank: "03", name: "Devon B.", archetype: "Slasher", overall: 81, delta: "—", top: false },
  { rank: "04", name: "Tyler R.", archetype: "Playmaking SC", overall: 79, delta: "+3", top: false },
];

const skillScores = [
  { label: "Shooting", val: 83 },
  { label: "Finishing", val: 91 },
  { label: "Playmaking", val: 87 },
  { label: "Defense", val: 81 },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-36">
      <Container>
        {/* Header */}
        <div className="mb-14">
          <p className="text-sm text-accent font-semibold uppercase tracking-widest mb-4">
            The Platform
          </p>
          <h2 className="font-heading text-[52px] sm:text-[68px] uppercase leading-[0.9] tracking-tight max-w-2xl">
            Built for the campus basketball community
          </h2>
        </div>

        {/* Asymmetric 3-column grid — 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* LEADERBOARD — large, col-span-2 */}
          <div className="sm:col-span-2 bg-card border border-accent/20 rounded-2xl p-6 overflow-hidden">
            <div className="flex items-start justify-between mb-1">
              <span className="text-[11px] text-accent uppercase tracking-widest font-semibold">01</span>
              <span className="text-[10px] bg-accent/15 text-accent border border-accent/25 rounded-full px-2.5 py-0.5 font-semibold uppercase tracking-wide">Core</span>
            </div>
            <h3 className="font-heading text-[30px] sm:text-[36px] uppercase leading-tight tracking-tight mb-2">
              Campus Leaderboard
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-1 max-w-md">
              One leaderboard per campus. Every player who checks in competes on the same board. The informal hierarchy your campus already has, made official.
            </p>
            <p className="text-xs text-accent font-medium mb-6">Updated in real time. Resets each season.</p>

            <div className="space-y-2">
              {leaderboardRows.map((p) => (
                <div
                  key={p.rank}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${
                    p.top ? "bg-accent/10 border border-accent/20" : "bg-muted/50"
                  }`}
                >
                  <span
                    className={`font-display text-[17px] w-6 shrink-0 text-center leading-none ${p.top ? "text-accent" : "text-muted-foreground"}`}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {p.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.archetype}</p>
                  </div>
                  <span className={`text-[11px] font-medium ${p.delta === "—" ? "text-muted-foreground" : "text-green-400"}`}>
                    {p.delta !== "—" ? `↑ ${p.delta}` : "—"}
                  </span>
                  <span
                    className={`font-display text-[28px] leading-none shrink-0 ${p.top ? "text-accent" : "text-foreground"}`}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {p.overall}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GPS CHECK-IN — narrow, col-span-1 */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col">
            <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">03</span>
            <h3 className="font-heading text-[30px] sm:text-[36px] uppercase leading-tight tracking-tight mb-2">
              GPS Check-In
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-auto">
              Arrive at your campus rec center, check in within 100m. Your name appears live for every player watching the court.
            </p>

            <div className="mt-6 bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[11px] text-green-400 font-semibold uppercase tracking-wide">Live Now</span>
              </div>
              <p
                className="font-display text-[52px] text-green-400 leading-none mb-1"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                12
              </p>
              <p className="text-sm text-muted-foreground font-medium">Players at the CoRec</p>
              <p className="text-[11px] text-muted-foreground mt-1">Updated 2 min ago</p>
            </div>
            <p className="text-xs text-muted-foreground/80 font-medium mt-4">Real signal. No fake check-ins.</p>
          </div>

          {/* PEER SKILL RATING — narrow, col-span-1 */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col">
            <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">04</span>
            <h3 className="font-heading text-[30px] sm:text-[36px] uppercase leading-tight tracking-tight mb-2">
              Peer Rating
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-auto">
              Rate opponents after every session across four dimensions. EMA-weighted, credibility-scored, outlier-resistant.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {skillScores.map(({ label, val }) => (
                <div key={label} className="bg-muted/50 rounded-xl p-3 text-center">
                  <p
                    className="font-display text-[32px] text-foreground leading-none mb-1"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {val}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/80 font-medium mt-4">Credibility-weighted. Can't be gamed.</p>
          </div>

          {/* PLAYER ARCHETYPE — large, col-span-2 */}
          <div className="sm:col-span-2 bg-card border border-border rounded-2xl p-6 overflow-hidden">
            <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mb-1 block">02</span>
            <h3 className="font-heading text-[30px] sm:text-[36px] uppercase leading-tight tracking-tight mb-2">
              Player Archetype
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-1 max-w-md">
              After enough rated sessions, the community assigns your identity. One of 40+ archetypes based on how opponents actually rated your game, not what you say about yourself.
            </p>
            <p className="text-xs text-muted-foreground/80 font-medium mb-6">&quot;What's your archetype?&quot; becomes campus vocabulary.</p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
              <div className="bg-muted/50 rounded-xl p-5 flex-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Earned after 4 sessions</p>
                <p className="font-heading text-[28px] uppercase leading-tight mb-0.5">Playmaking</p>
                <p className="font-heading text-[28px] uppercase text-accent leading-tight mb-4">Shot Creator</p>
                <div className="space-y-2.5">
                  {[
                    { label: "PLY", val: 87 },
                    { label: "SHT", val: 84 },
                    { label: "FIN", val: 79 },
                    { label: "DEF", val: 71 },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <span className="text-[10px] text-muted-foreground w-6 shrink-0">{label}</span>
                      <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${(val / 99) * 100}%` }} />
                      </div>
                      <span
                        className="font-display text-[13px] text-muted-foreground w-5 text-right"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:w-48">
                {[
                  { stat: "40+", label: "Unique archetypes" },
                  { stat: "4", label: "Skill dimensions" },
                  { stat: "EMA", label: "Algorithm" },
                ].map(({ stat, label }) => (
                  <div key={label} className="bg-muted/40 rounded-xl p-3">
                    <p
                      className="font-display text-[28px] text-accent leading-none mb-0.5"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {stat}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
