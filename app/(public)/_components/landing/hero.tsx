import { MatrixBackground } from "./matrix-background"
import { HeroCta } from "./hero-cta"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <MatrixBackground />
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(107,0,201,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 w-full py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — copy */}
        <div className="flex flex-col gap-8">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {["Open Beta", "Free to use", "Web3-native"].map((label) => (
              <span
                key={label}
                className="font-mono text-xs px-3 py-1 rounded-sm bg-secondary text-muted-foreground border border-border"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-1">
            <h1 className="font-display font-bold text-foreground leading-tight text-4xl sm:text-5xl lg:text-6xl">
              Find your Builder.
            </h1>
            <h1 className="font-display font-bold text-foreground leading-tight text-4xl sm:text-5xl lg:text-6xl">
              Build together.
            </h1>
            <h1
              className="font-display font-bold leading-tight text-4xl sm:text-5xl lg:text-6xl"
              style={{ color: "var(--primary)" }}
            >
              Live the protocol.
            </h1>
          </div>

          {/* Subheadline */}
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-lg leading-relaxed">
              The operating system for the builder scene.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Connect with Visionaries, Strategists, and Builders.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Form your team online. Show up IRL.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <HeroCta />
            <p className="text-sm text-muted-foreground">
              Free forever. Connect your wallet or sign up with email.
            </p>
          </div>
        </div>

        {/* Right — visual */}
        <div className="flex flex-col items-center justify-center lg:justify-end gap-6">
          <img
            src="/assets/hacker-house-protocol-logo.svg"
            alt="Hacker House Protocol"
            width={520}
            height={494}
            className="opacity-90"
            style={{
              filter:
                "drop-shadow(0 0 40px rgba(107,0,201,0.5)) drop-shadow(0 0 80px rgba(107,0,201,0.25))",
            }}
          />
          {/* Archetype color dots */}
          <div className="flex justify-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "var(--visionary)", boxShadow: "0 0 8px var(--visionary)" }}
            />
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "var(--strategist)", boxShadow: "0 0 8px var(--strategist)" }}
            />
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "var(--builder-archetype)", boxShadow: "0 0 8px var(--builder-archetype)" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
