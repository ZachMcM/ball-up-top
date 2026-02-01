import Image from "next/image";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-transparent pointer-events-none" />

      <Container className="relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Now available on iOS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find Courts.
              <br />
              Rate Players.
              <br />
              <span className="text-muted-foreground">Track Your Game.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8">
              Discover basketball courts near you, get player ratings from the community,
              track your game time, and climb the leaderboards.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button href="#download" size="lg">
                Download Free
              </Button>
              <Button href="#features" variant="secondary" size="lg">
                See Features
              </Button>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone frame */}
              <div className="relative w-[280px] sm:w-[320px] h-[580px] sm:h-[660px] bg-card rounded-[2rem] p-2 border border-border shadow-2xl overflow-hidden">
                {/* Screen */}
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-black">
                  <Image
                    src="/screenshots/discover-courts.png"
                    alt="Ball Up Top app showing court discovery"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-8 top-20 bg-card border border-border rounded-2xl p-4 shadow-xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">3 Courts Nearby</p>
                    <p className="text-xs text-muted-foreground">Within 1 mile</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-32 bg-card border border-border rounded-2xl p-4 shadow-xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-lg font-bold">
                    70
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Overall Rating</p>
                    <p className="text-xs text-muted-foreground">Inside-Out Scorer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
