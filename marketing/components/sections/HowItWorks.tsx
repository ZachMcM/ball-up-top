import { Container } from "../ui/Container";

const steps = [
  {
    number: "01",
    title: "Find Your Campus",
    description:
      "Select your school to see your campus court node. Ball Up Top launches at one campus at a time — if your school isn't live yet, add your name to the waitlist.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Check In",
    description:
      "When you arrive at your campus rec center, check in via GPS (you need to be within 100m). Your check-in appears live for all players watching the court.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Rate Your Run",
    description:
      "After you check out, rate every opponent you guarded across four dimensions: Shooting, Finishing, Playmaking, Defense. Their rating updates. So does yours.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Claim Your Rank",
    description:
      "Your overall rating and player archetype update after each session. See where you sit on the campus leaderboard — and who's above you. The question is simple: who runs your court?",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-36 bg-card/40">
      <Container>
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm text-accent font-semibold uppercase tracking-widest mb-4">
            The Loop
          </p>
          <h2 className="font-heading text-[52px] sm:text-[68px] uppercase leading-[0.9] tracking-tight">
            Four steps to your ranking
          </h2>
        </div>

        {/* Steps — desktop: horizontal rail, mobile: vertical stack */}
        <div className="relative">
          {/* Connecting rail (desktop only) */}
          <div
            className="hidden lg:block absolute top-[38px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(249,115,22,0.3) 20%, rgba(249,115,22,0.3) 80%, transparent)",
            }}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative text-center lg:text-left"
              >
                {/* Step icon circle */}
                <div className="relative inline-flex lg:flex items-center justify-center w-[76px] h-[76px] mb-6 mx-auto lg:mx-0">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border border-accent/20 bg-accent/[0.06]" />
                  {/* Icon */}
                  <div className="text-accent relative z-10">{step.icon}</div>
                  {/* Number badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center z-20">
                    <span className="font-display text-[13px] text-white leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {String(index + 1)}
                    </span>
                  </div>
                </div>

                {/* Step number */}
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">
                  Step {step.number}
                </p>

                {/* Title */}
                <h3 className="font-heading text-[24px] sm:text-[28px] uppercase leading-tight tracking-tight mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Loop callout */}
        <div className="mt-20 bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div>
            <p className="font-heading text-[22px] uppercase tracking-tight mb-1">
              The Loop Gets Stronger with Every Player
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              More check-ins means more data. More data means more accurate
              ratings. More accurate ratings makes the leaderboard more
              meaningful. The campus basketball community becomes
              self-reinforcing — everyone has more reason to keep coming back.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
