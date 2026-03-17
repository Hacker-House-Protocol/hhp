export function Features() {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-foreground text-3xl sm:text-4xl">
            Two ways to build. One protocol.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hack Spaces — primary feature */}
          <div
            className="bg-card border border-border rounded-lg p-8 flex flex-col gap-6 relative overflow-hidden"
            style={{ borderLeftColor: "var(--primary)", borderLeftWidth: "3px" }}
          >
            <div className="flex flex-col gap-2">
              <span className="text-2xl">🔗</span>
              <h3 className="font-display font-bold text-foreground text-2xl">
                Hack Spaces
              </h3>
              <p className="text-muted-foreground font-medium">
                Find your team. Build together.
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Post your project, define the roles you need, and let the algorithm
              match you with builders who fit — by archetype, skills, region, and
              language.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              No scrolling through profiles. No cold DMs into the void. Just
              high-signal matches for the work you actually want to ship.
            </p>

            <ul className="flex flex-col gap-2 mt-auto">
              {[
                "Algorithmic matching by archetype and skill set",
                "Post a project or join one already forming",
                "Your on-chain credentials speak for you",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span style={{ color: "var(--primary)" }} className="mt-0.5 shrink-0">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Hacker Houses */}
          <div className="bg-card border border-border rounded-lg p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-2xl">🏠</span>
              <h3 className="font-display font-bold text-foreground text-2xl">
                Hacker Houses
              </h3>
              <p className="text-muted-foreground font-medium">
                Live with your team. Show up IRL.
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              When your team is ready to meet in person, spin up a Hacker House.
              Co-living with builders in event cities — coordinated, filtered, and
              builder-optimized.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Not Airbnb. Not a hostel. A protocol for building together in the
              same room.
            </p>

            <ul className="flex flex-col gap-2 mt-auto">
              {[
                "Spaces in key cities and event hubs",
                "Builder-filtered — no randoms",
                "Sponsored houses available from verified organizations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span style={{ color: "var(--primary)" }} className="mt-0.5 shrink-0">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
