import { WaitlistForm } from "./waitlist-form"

export function FinalCta() {
  return (
    <section
      id="waitlist"
      className="py-32 border-t border-border"
      style={{
        background:
          "linear-gradient(to bottom, var(--background), var(--card) 50%, var(--background))",
      }}
    >
      <div className="max-w-2xl mx-auto px-6 flex flex-col items-center gap-8 text-center">
        {/* Headline */}
        <div className="flex flex-col gap-4">
          <h2 className="font-display font-bold text-foreground text-3xl sm:text-5xl leading-tight">
            The builder OS is almost ready.
          </h2>
          <p className="text-muted-foreground text-lg">
            Be among the first builders on the protocol.
          </p>
        </div>

        {/* Supporting copy */}
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground leading-relaxed">
            Early builders get first access to Hack Spaces, priority matching,
            and the chance to shape the protocol from day one.
          </p>
          <p className="text-foreground font-display font-bold text-lg mt-2">
            Free. Always.
          </p>
        </div>

        {/* Form — full width */}
        <WaitlistForm className="w-full max-w-lg" />

        <p className="text-xs text-muted-foreground">
          No credit card. No spam. Just early access to the protocol.
        </p>
      </div>
    </section>
  )
}
