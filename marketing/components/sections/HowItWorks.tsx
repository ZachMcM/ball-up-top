import { Container } from "../ui/Container";

const steps = [
  {
    number: "01",
    title: "Download the App",
    description:
      "Get Ball Up Top free on the App Store or Google Play. Create your profile in seconds.",
  },
  {
    number: "02",
    title: "Find a Court",
    description:
      "Browse courts near you, check photos and activity, and get directions to start playing.",
  },
  {
    number: "03",
    title: "Check In & Play",
    description:
      "Check in when you arrive, play your games, and rate other players when you're done.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps and join the community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-card border border-border rounded-full mb-6">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
