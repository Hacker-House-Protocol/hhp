import Image from "next/image"
import { WaitlistForm } from "./waitlist-form"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
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
            {["Coming soon", "Free to use", "Web3-native"].map((label) => (
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

          {/* Waitlist form */}
          <WaitlistForm />
        </div>

        {/* Right — visual */}
        <div className="flex items-center justify-center lg:justify-end">
          <div
            className="relative flex items-center justify-center rounded-2xl bg-card border border-border p-12"
            style={{
              boxShadow: "0 0 80px rgba(107,0,201,0.25), 0 0 160px rgba(107,0,201,0.1)",
            }}
          >
            {/* Cypher Kitten placeholder — replace with GIF when available */}
            <Image
              src="/assets/hacker-house-protocol-logo.svg"
              alt="Hacker House Protocol"
              width={200}
              height={190}
              className="opacity-90"
              priority
            />
            {/* Archetype color dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--visionary)" }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--strategist)" }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--builder-archetype)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
