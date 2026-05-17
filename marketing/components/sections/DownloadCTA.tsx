import { Container } from "../ui/Container";
import Image from "next/image";

export function DownloadCTA() {
  return (
    <section id="download" className="py-24 md:py-36 overflow-hidden">
      <Container size="md">
        <div className="relative bg-card border border-border rounded-3xl overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-accent/[0.07] rounded-full blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-accent/[0.04] rounded-full blur-[100px]" />
            <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.03]" />
            <div className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/[0.025]" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(253,81,3,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(253,81,3,0.025) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          <div className="relative px-8 py-14 md:px-16 md:py-20">
            <div className="max-w-2xl">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 rounded-full px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">
                  Purdue leaderboard is live — Season 1
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-heading text-[60px] sm:text-[80px] md:text-[96px] uppercase leading-[0.88] tracking-tight mb-6">
                <span className="block">Get your</span>
                <span className="block text-accent">ranking.</span>
              </h2>

              <p className="text-[17px] text-muted-foreground leading-relaxed max-w-lg mb-10">
                The competition has already started. Every session at the rec center is someone else building their rating. Get on the board before your spot at the top is taken.
              </p>

              {/* App Store button */}
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 rounded-2xl hover:bg-foreground/95 transition-colors active:scale-[0.98] shadow-xl shadow-black/30"
              >
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-background/60 leading-none mb-0.5">Download on the</div>
                  <div className="text-[18px] font-bold leading-tight">App Store</div>
                </div>
              </a>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10 pt-8 border-t border-border">
                {[
                  "Free to download",
                  "GPS-verified ratings",
                  "No fake check-ins",
                  "iOS 16+",
                ].map((signal) => (
                  <div key={signal} className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[13px] text-muted-foreground">{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Logo watermark */}
            <div className="absolute bottom-10 right-10 md:bottom-14 md:right-16 opacity-[0.07]">
              <Image src="/logo.png" alt="" width={100} height={100} aria-hidden />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
