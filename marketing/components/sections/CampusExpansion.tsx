"use client";

import { useState } from "react";
import { Container } from "../ui/Container";

const campuses = [
  {
    school: "Purdue University",
    shortName: "Purdue",
    location: "West Lafayette, IN",
    court: "France A. Córdova Rec Sports Center",
    status: "live" as const,
    players: 47,
  },
  {
    school: "Ohio State University",
    shortName: "Ohio State",
    location: "Columbus, OH",
    court: "RPAC",
    status: "soon" as const,
    players: null,
  },
  {
    school: "University of Michigan",
    shortName: "Michigan",
    location: "Ann Arbor, MI",
    court: "CCRB",
    status: "soon" as const,
    players: null,
  },
  {
    school: "Indiana University",
    shortName: "Indiana",
    location: "Bloomington, IN",
    court: "Student Recreational Sports Center",
    status: "soon" as const,
    players: null,
  },
  {
    school: "Michigan State University",
    shortName: "Michigan State",
    location: "East Lansing, MI",
    court: "IM Sports Circle",
    status: "soon" as const,
    players: null,
  },
];

export function CampusExpansion() {
  const [school, setSchool] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (school.trim()) setSubmitted(true);
  }

  return (
    <section id="campuses" className="py-24 md:py-36">
      <Container>
        {/* Header */}
        <div className="mb-14">
          <p className="text-sm text-accent font-semibold uppercase tracking-widest mb-4">
            The Expansion Model
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-heading text-[52px] sm:text-[64px] uppercase leading-[0.9] tracking-tight">
              One campus<br />at a time.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-sm lg:text-right">
              Each campus gets its own full launch before the next school goes live. No empty leaderboards. No dead courts. Real community, every time.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[55%_45%] gap-10 xl:gap-16 items-start">
          {/* Left: campus list */}
          <div className="space-y-3">
            {campuses.map((campus) => (
              <div
                key={campus.school}
                className={`relative flex items-center gap-5 p-5 rounded-2xl border transition-colors ${
                  campus.status === "live"
                    ? "bg-card border-accent/25 hover:border-accent/40"
                    : "bg-card/60 border-border hover:border-border/60"
                }`}
              >
                {/* Status dot */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    campus.status === "live" ? "bg-green-500/15" : "bg-muted"
                  }`}
                >
                  {campus.status === "live" ? (
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                  ) : (
                    <span className="w-2.5 h-2.5 bg-muted-foreground/30 rounded-full" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-heading text-[20px] uppercase tracking-tight leading-tight">
                      {campus.school}
                    </p>
                    {campus.status === "live" && (
                      <span className="text-[9px] bg-green-500/15 text-green-400 border border-green-500/25 rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide shrink-0">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground">{campus.location} · {campus.court}</p>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  {campus.status === "live" ? (
                    <>
                      <p className="text-[12px] text-green-400 font-semibold">Season 1 — Active</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        <span className="font-display text-[13px]" style={{ fontVariantNumeric: "tabular-nums" }}>
                          {campus.players}
                        </span>
                        {" players ranked"}
                      </p>
                    </>
                  ) : (
                    <p className="text-[12px] text-muted-foreground">Coming soon</p>
                  )}
                </div>
              </div>
            ))}

            {/* More to come */}
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-border/50">
              <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                More campuses added as each school reaches community density
              </p>
            </div>
          </div>

          {/* Right: conditional CTA */}
          <div className="space-y-5">
            {/* Download block for Big Ten */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-[11px] text-accent uppercase tracking-widest font-semibold mb-3">
                At a launch campus?
              </p>
              <p className="font-heading text-[24px] uppercase leading-tight mb-3">
                You're already on the list.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Purdue is live now. Ohio State, Michigan, Indiana, and Michigan State launch next. If you're at one of these schools, download and get on the board.
              </p>
              <a
                href="#download"
                className="inline-flex items-center justify-center gap-2.5 w-full h-12 text-sm font-semibold bg-accent text-white rounded-full hover:bg-accent/90 active:scale-[0.98] transition-all"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Download for iOS
              </a>
            </div>

            {/* Waitlist for everyone else */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">
                Not at your school yet?
              </p>
              <p className="font-heading text-[24px] uppercase leading-tight mb-3">
                Join the waitlist.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                We use waitlist volume to decide which campuses launch next. Your school name moves it up the list.
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Your school (e.g. Texas, UCLA, Duke)"
                    className="w-full h-11 bg-muted/50 border border-border rounded-full px-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full h-11 bg-card border border-border text-foreground font-semibold text-sm rounded-full hover:bg-muted hover:border-border/80 active:scale-[0.98] transition-all"
                  >
                    Notify Me
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/25 rounded-2xl px-4 py-3.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-400">You're on the list</p>
                    <p className="text-[12px] text-muted-foreground">
                      We'll reach out when Ball Up Top launches at {school}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
