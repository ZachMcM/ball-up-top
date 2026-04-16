"use client";

import { useState } from "react";
import { Container } from "../ui/Container";

const campuses = [
  {
    school: "Purdue University",
    location: "West Lafayette, IN",
    enrollment: "50,000+",
    status: "live" as const,
    season: "Season 1 — Active",
    players: "47 ranked",
  },
  {
    school: "Ohio State",
    location: "Columbus, OH",
    enrollment: "60,000+",
    status: "soon" as const,
    season: "Coming soon",
    players: null,
  },
  {
    school: "University of Michigan",
    location: "Ann Arbor, MI",
    enrollment: "48,000+",
    status: "soon" as const,
    season: "Coming soon",
    players: null,
  },
  {
    school: "Indiana University",
    location: "Bloomington, IN",
    enrollment: "45,000+",
    status: "soon" as const,
    season: "Coming soon",
    players: null,
  },
  {
    school: "Michigan State",
    location: "East Lansing, MI",
    enrollment: "50,000+",
    status: "soon" as const,
    season: "Coming soon",
    players: null,
  },
];

export function CampusExpansion() {
  const [school, setSchool] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (school.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <section id="campuses" className="py-24 md:py-36 bg-card/40">
      <Container>
        <div className="grid lg:grid-cols-[45%_55%] gap-16 xl:gap-24 items-start">
          {/* Left: copy + waitlist */}
          <div>
            <p className="text-sm text-accent font-semibold uppercase tracking-widest mb-4">
              The Expansion Model
            </p>
            <h2 className="font-heading text-[52px] sm:text-[64px] uppercase leading-[0.9] tracking-tight mb-6">
              One campus<br />at a time.
            </h2>
            <p className="text-[16px] text-muted-foreground leading-relaxed mb-8">
              Ball Up Top doesn't launch everywhere at once. Each campus gets its
              own full launch — ambassador seeding, community building, real
              leaderboard density — before the next school goes live.
            </p>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-10">
              That's the model that makes the product work. No empty leaderboards.
              No dead courts. Every campus that goes live is a real community.
            </p>

            {/* Waitlist form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-sm font-semibold mb-3">
                  Not at your school yet?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Your school (e.g. Texas, UCLA)"
                    className="flex-1 h-12 bg-card border border-border rounded-full px-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="h-12 px-6 bg-accent text-white font-semibold text-sm rounded-full hover:bg-accent/90 active:scale-[0.98] transition-all shrink-0"
                  >
                    Join Waitlist
                  </button>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  We use waitlist data to decide which campuses come next.
                </p>
              </form>
            ) : (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/25 rounded-2xl px-5 py-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-400">You're on the list</p>
                  <p className="text-[12px] text-muted-foreground">
                    We'll let you know when Ball Up Top launches at {school}.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: campus list */}
          <div className="space-y-3">
            {campuses.map((campus) => (
              <div
                key={campus.school}
                className={`relative flex items-center gap-5 p-5 rounded-2xl border transition-colors ${
                  campus.status === "live"
                    ? "bg-card border-green-500/25 hover:border-green-500/40"
                    : "bg-card/60 border-border hover:border-border/80"
                }`}
              >
                {/* Status indicator */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    campus.status === "live"
                      ? "bg-green-500/15"
                      : "bg-muted"
                  }`}
                >
                  {campus.status === "live" ? (
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                  ) : (
                    <span className="w-2.5 h-2.5 bg-muted-foreground/40 rounded-full" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-heading text-[18px] uppercase tracking-tight leading-tight">
                      {campus.school}
                    </p>
                    {campus.status === "live" && (
                      <span className="text-[10px] bg-green-500/15 text-green-400 border border-green-500/25 rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide shrink-0">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    {campus.location} · {campus.enrollment} students
                  </p>
                </div>

                {/* Season info */}
                <div className="text-right shrink-0">
                  <p
                    className={`text-[12px] font-semibold ${
                      campus.status === "live" ? "text-green-400" : "text-muted-foreground"
                    }`}
                  >
                    {campus.season}
                  </p>
                  {campus.players && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {campus.players}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* More to come */}
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-border/60">
              <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                More campuses added as each school reaches tipping point
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
