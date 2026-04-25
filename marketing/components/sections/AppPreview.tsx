import { Container } from "../ui/Container";

type Archetype = {
  name: string;
  position: "Guard" | "Wing" | "Big";
  overall: number;
  skills: { label: string; val: number }[];
  description: string;
};

const archetypes: Archetype[] = [
  {
    name: "3 & D Guard",
    position: "Guard",
    overall: 82,
    skills: [
      { label: "SHT", val: 88 },
      { label: "DEF", val: 85 },
      { label: "FIN", val: 74 },
      { label: "PLY", val: 72 },
    ],
    description:
      "Spot-up shooter who guards the other team's best player. Never wastes a possession.",
  },
  {
    name: "Playmaking Shot Creator",
    position: "Guard",
    overall: 86,
    skills: [
      { label: "PLY", val: 90 },
      { label: "SHT", val: 86 },
      { label: "FIN", val: 81 },
      { label: "DEF", val: 68 },
    ],
    description:
      "Creates off the dribble, draws defenders, finds the open man. The floor general.",
  },
  {
    name: "Two-Way Wing",
    position: "Wing",
    overall: 84,
    skills: [
      { label: "DEF", val: 85 },
      { label: "FIN", val: 84 },
      { label: "SHT", val: 80 },
      { label: "PLY", val: 78 },
    ],
    description:
      "Versatile on both ends. Matches up across multiple positions. Never a liability.",
  },
  {
    name: "Slasher",
    position: "Wing",
    overall: 80,
    skills: [
      { label: "FIN", val: 92 },
      { label: "PLY", val: 79 },
      { label: "DEF", val: 74 },
      { label: "SHT", val: 64 },
    ],
    description:
      "Gets to the rim every single time. Only thing stopping them is the second unit.",
  },
  {
    name: "Paint Beast",
    position: "Big",
    overall: 83,
    skills: [
      { label: "FIN", val: 91 },
      { label: "DEF", val: 88 },
      { label: "PLY", val: 72 },
      { label: "SHT", val: 52 },
    ],
    description:
      "Dominant at the rim. Controls the glass. Makes life hard for anyone posting up.",
  },
  {
    name: "Stretch 5",
    position: "Big",
    overall: 79,
    skills: [
      { label: "SHT", val: 84 },
      { label: "FIN", val: 82 },
      { label: "DEF", val: 76 },
      { label: "PLY", val: 70 },
    ],
    description:
      "Big who can step out and hit threes. Spreads the floor, creates driving lanes.",
  },
];

const positionColors: Record<Archetype["position"], string> = {
  Guard: "text-sky-400 bg-sky-400/10 border-sky-400/25",
  Wing: "text-accent bg-accent/10 border-accent/25",
  Big: "text-amber-400 bg-amber-400/10 border-amber-400/25",
};

const positionBarColors: Record<Archetype["position"], string> = {
  Guard: "bg-sky-400",
  Wing: "bg-accent",
  Big: "bg-amber-400",
};

function ArchetypeCard({ archetype }: { archetype: Archetype }) {
  const colorClass = positionColors[archetype.position];
  const barColor = positionBarColors[archetype.position];

  return (
    <div className="group relative bg-card border border-border rounded-2xl p-5 hover:border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40">
      {/* Position badge */}
      <div
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 border text-[10px] font-semibold uppercase tracking-wide mb-4 ${colorClass}`}
      >
        <span className="w-1 h-1 rounded-full bg-current" />
        {archetype.position}
      </div>

      {/* Name + overall */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-[22px] sm:text-[26px] uppercase leading-tight tracking-tight flex-1 mr-3">
          {archetype.name}
        </h3>
        <div className="text-right shrink-0">
          <p className="text-[32px] leading-none text-foreground">
            {archetype.overall}
          </p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
            overall
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-muted-foreground leading-relaxed mb-5">
        {archetype.description}
      </p>

      {/* Skill bars */}
      <div className="space-y-2">
        {archetype.skills.map(({ label, val }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="text-[10px] text-muted-foreground w-6 shrink-0 tracking-wide font-medium">
              {label}
            </span>
            <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor}`}
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
  );
}

export function AppPreview() {
  return (
    <section className="py-24 md:py-36">
      <Container>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <p className="text-sm text-accent font-semibold uppercase tracking-widest mb-4">
              Player Identity
            </p>
            <h2 className="text-[52px] sm:text-[68px] uppercase leading-[0.9] tracking-tight">
              What's your
              <br />
              archetype?
            </h2>
          </div>
          <p className="text-[16px] text-muted-foreground max-w-sm leading-relaxed lg:text-right">
            After enough rated sessions, you earn one of 40+ archetypes based on
            how opponents actually rated you — not what you think you are.
          </p>
        </div>

        {/* Archetype cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {archetypes.map((archetype) => (
            <ArchetypeCard key={archetype.name} archetype={archetype} />
          ))}
        </div>

        {/* Bottom callout */}
        <div className="mt-12 grid sm:grid-cols-3 gap-5">
          {[
            {
              stat: "40+",
              label: "Unique archetypes",
              sub: "Guards, Wings, and Bigs each have their own type system",
            },
            {
              stat: "4",
              label: "Skill dimensions",
              sub: "Shooting, Finishing, Playmaking, and Defense rated separately",
            },
            {
              stat: "EMA",
              label: "Weighted algorithm",
              sub: "Credibility-weighted ratings resist inflation and gaming",
            },
          ].map(({ stat, label, sub }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <p className="text-[42px] text-accent leading-none mb-2">
                {stat}
              </p>
              <p className="font-semibold text-sm mb-1">{label}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
