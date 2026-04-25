import { Container } from "../ui/Container";

const features = [
  {
    tag: "01",
    title: "Campus Leaderboard",
    description:
      "One leaderboard per campus. Every player who checks in competes on the same board — the informal hierarchy your campus already has, made visible and official.",
    detail: "Updated in real time. Resets each season.",
    highlight: true,
    visual: (
      <div className="mt-6 space-y-1.5">
        {[
          { rank: "01", name: "Marcus T.", val: 88, pct: 89, top: true },
          { rank: "02", name: "Jordan W.", val: 84, pct: 85, top: false },
          { rank: "03", name: "Devon B.", val: 81, pct: 82, top: false },
        ].map((p) => (
          <div
            key={p.rank}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              p.top ? "bg-accent/10 border border-accent/20" : "bg-muted/50"
            }`}
          >
            <span
              className={`text-sm w-5 shrink-0 ${
                p.top ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {p.rank}
            </span>
            <span className="flex-1 truncate text-[13px] font-medium">
              {p.name}
            </span>
            <span
              className={`text-lg ${p.top ? "text-accent" : "text-foreground"}`}
            >
              {p.val}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "02",
    title: "Player Archetype",
    description:
      "After enough rated sessions, you earn one of 40+ archetypes based on your actual play style. Not assigned at random — built from peer evaluations.",
    detail: '"What\'s your archetype?" becomes campus vocabulary.',
    highlight: false,
    visual: (
      <div className="mt-6 bg-muted/50 rounded-xl p-4">
        <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
          Earned after 4 sessions
        </p>
        <p className="text-2xl uppercase mb-0.5">Playmaking</p>
        <p className="text-2xl uppercase text-accent mb-3">Shot Creator</p>
        <div className="space-y-2">
          {[
            { label: "PLY", val: 87 },
            { label: "SHT", val: 84 },
            { label: "FIN", val: 79 },
            { label: "DEF", val: 71 },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-6 shrink-0">
                {label}
              </span>
              <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${(val / 99) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground w-5 text-right">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    tag: "03",
    title: "GPS Check-In",
    description:
      "Check in within 100m of your campus rec center. The court shows who's there right now — no more showing up and hoping for a run.",
    detail: "Real signal. Real players. No fake check-ins.",
    highlight: false,
    visual: (
      <div className="mt-6 bg-muted/50 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500/15 border border-green-500/25 rounded-full flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <p className="text-2xl text-green-400">12</p>
          <p className="text-sm text-muted-foreground">Players at the CoRec</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Updated 2 min ago
          </p>
        </div>
      </div>
    ),
  },
  {
    tag: "04",
    title: "Peer Skill Rating",
    description:
      "Rate opponents after every session across four dimensions. The EMA algorithm weights credibility, overlap time, and session competitiveness — it can't be gamed.",
    detail: "Credibility-weighted. Outlier-resistant. Honest.",
    highlight: false,
    visual: (
      <div className="mt-6 grid grid-cols-2 gap-2">
        {[
          { label: "Shooting", val: 83 },
          { label: "Finishing", val: 78 },
          { label: "Playmaking", val: 87 },
          { label: "Defense", val: 81 },
        ].map(({ label, val }) => (
          <div key={label} className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl text-foreground leading-none mb-1">{val}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-36">
      <Container>
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm text-accent font-semibold uppercase tracking-widest mb-4">
            The Platform
          </p>
          <h2 className="text-[52px] sm:text-[68px] uppercase leading-[0.9] tracking-tight max-w-2xl">
            Built for the campus basketball community
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((feature) => (
            <div
              key={feature.tag}
              className={`relative rounded-2xl border p-6 overflow-hidden transition-colors ${
                feature.highlight
                  ? "bg-accent/[0.07] border-accent/30 hover:border-accent/50"
                  : "bg-card border-border hover:border-border/80"
              }`}
            >
              {/* Tag */}
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`text-[13px] uppercase tracking-widest ${
                    feature.highlight ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {feature.tag}
                </span>
                {feature.highlight && (
                  <span className="text-[10px] bg-accent/15 text-accent border border-accent/25 rounded-full px-2.5 py-0.5 font-semibold uppercase tracking-wide">
                    Core
                  </span>
                )}
              </div>

              <h3 className="text-[28px] sm:text-[32px] uppercase leading-tight tracking-tight mb-3">
                {feature.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {feature.description}
              </p>

              <p
                className={`text-xs font-medium ${
                  feature.highlight ? "text-accent" : "text-muted-foreground/80"
                }`}
              >
                {feature.detail}
              </p>

              {feature.visual}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
