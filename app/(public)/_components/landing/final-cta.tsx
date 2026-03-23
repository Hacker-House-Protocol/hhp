import { AuthButton } from "@/components/auth/auth-button"

export function FinalCta() {
  return (
    <section
      id="get-started"
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
            The builder OS is live.
          </h2>
          <p className="text-muted-foreground text-lg">
            Join the protocol. Find your team. Ship.
          </p>
        </div>

        {/* Supporting copy */}
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground leading-relaxed">
            Browse Hack Spaces, post your project, match with co-founders by
            archetype, and coordinate IRL at Hacker Houses near you.
          </p>
          <p className="text-foreground font-display font-bold text-lg mt-2">
            Free. Always.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <AuthButton className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-12 px-10 text-base" />
          <p className="text-xs text-muted-foreground">
            No credit card. Connect your wallet or sign up with email.
          </p>
        </div>
      </div>
    </section>
  )
}
