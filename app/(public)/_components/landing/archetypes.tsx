const archetypes = [
  {
    name: "The Visionary",
    tagline: "You have the idea. The vision is clear — the team isn't.",
    body: "You define direction, generate narrative, and attract talent. You need builders who can execute on what you see.",
    skills: ["Founder", "Product", "Vision"],
    colorVar: "--visionary",
  },
  {
    name: "The Strategist",
    tagline: "You see the whole board. You connect the pieces.",
    body: "GTM, ops, partnerships, execution. You turn chaos into roadmap. You need a Visionary's idea and a Builder's hands.",
    skills: ["GTM", "Operations", "Partnerships"],
    colorVar: "--strategist",
  },
  {
    name: "The Builder",
    tagline: "You ship. That's it. That's the whole bio.",
    body: "Frontend, backend, smart contracts, design — you make the thing real. The most wanted archetype on the protocol.",
    skills: ["Frontend", "Backend", "Smart Contracts", "Design"],
    colorVar: "--builder-archetype",
  },
]

export function Archetypes() {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col gap-3">
          <h2 className="font-display font-bold text-foreground text-3xl sm:text-4xl">
            Every builder has a role.
          </h2>
          <p className="text-muted-foreground text-lg">
            The protocol matches you based on yours.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {archetypes.map((archetype) => (
            <div
              key={archetype.name}
              className="bg-card border border-border rounded-lg p-8 flex flex-col gap-5"
              style={{
                borderTopColor: `var(${archetype.colorVar})`,
                borderTopWidth: "3px",
              }}
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-display font-bold text-foreground text-xl">
                  {archetype.name}
                </h3>
                <p
                  className="text-sm font-medium leading-snug"
                  style={{ color: `var(${archetype.colorVar})` }}
                >
                  {archetype.tagline}
                </p>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                {archetype.body}
              </p>

              {/* Skill pills */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {archetype.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-sm border font-mono"
                    style={{
                      borderColor: `var(${archetype.colorVar})`,
                      color: `var(${archetype.colorVar})`,
                      backgroundColor: `color-mix(in oklch, var(${archetype.colorVar}) 10%, transparent)`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer line */}
        <p className="text-center text-muted-foreground mt-12 text-base">
          Choose your archetype. The algorithm does the rest.
        </p>
      </div>
    </section>
  )
}
