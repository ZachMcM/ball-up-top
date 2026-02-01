import Image from "next/image";
import { Container } from "../ui/Container";

export function DownloadCTA() {
  return (
    <section id="download" className="py-20 md:py-32">
      <Container size="md">
        <div className="relative bg-card border border-border rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative text-center">
            <div className="inline-flex mb-6">
              <Image
                src="/logo.png"
                alt="Ball Up Top"
                width={64}
                height={64}
              />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Ready to Ball?
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
              Download Ball Up Top for free and start finding courts, tracking your game, and competing with the community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-3 bg-white text-black px-6 py-3.5 rounded-xl hover:bg-white/90 transition-colors"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs leading-none opacity-80">Download on the</div>
                  <div className="text-lg font-semibold leading-tight">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
