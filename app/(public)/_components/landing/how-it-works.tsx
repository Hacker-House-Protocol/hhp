const steps = [
  {
    number: "01",
    title: "Create your Cypher Identity",
    body: "Connect your wallet or sign up with email. Your on-chain credentials — POAPs, contributions, Talent Protocol score — import automatically.",
    footnote: "Your identity lives on the protocol. Not on a platform.",
  },
  {
    number: "02",
    title: "Find your match",
    body: "Browse Hack Spaces looking for your archetype and skills. Or post your own project and let builders find you.",
    footnote: "The algorithm surfaces the right fits. You pick who to build with.",
  },
  {
    number: "03",
    title: "Build IRL",
    body: "When the team is ready, spin up a Hacker House. Meet. Build. Ship.",
    footnote: "The protocol takes you from idea to room in the same building.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-foreground text-3xl sm:text-4xl">
            Three steps. Then you&apos;re building.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          {/* Connector line — desktop only */}
          <div
            className="absolute top-8 left-[calc(33.3%+1rem)] right-[calc(33.3%+1rem)] h-px hidden md:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, var(--border) 0, var(--border) 6px, transparent 6px, transparent 14px)",
            }}
          />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="flex flex-col gap-4 px-2 md:px-8 pb-10 md:pb-0 relative"
            >
              {/* Vertical connector — mobile only */}
              {i < steps.length - 1 && (
                <div
                  className="absolute left-2 top-16 bottom-0 w-px md:hidden"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, var(--border) 0, var(--border) 6px, transparent 6px, transparent 14px)",
                  }}
                />
              )}

              {/* Step number */}
              <span
                className="font-display font-bold text-6xl leading-none select-none"
                style={{ color: "var(--border)" }}
              >
                {step.number}
              </span>

              <div className="flex flex-col gap-2">
                <h3 className="font-display font-bold text-foreground text-lg">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.body}
                </p>
                <p
                  className="text-sm font-medium mt-1"
                  style={{ color: "var(--primary)" }}
                >
                  {step.footnote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
