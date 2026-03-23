"use client"

import { ARCHETYPES, type ArchetypeId } from "@/lib/onboarding"
import { cn } from "@/lib/utils"

interface StepArchetypeProps {
  onSelect: (archetype: ArchetypeId) => void
  loading: boolean
}

export function StepArchetype({ onSelect, loading }: StepArchetypeProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display font-bold text-foreground text-3xl sm:text-4xl">
          What&apos;s your role?
        </h1>
        <p className="text-muted-foreground text-lg">
          Choose the archetype that best defines how you build.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ARCHETYPES.map((archetype) => (
          <button
            key={archetype.id}
            onClick={() => onSelect(archetype.id)}
            disabled={loading}
            className={cn(
              "group text-left bg-card border border-border rounded-lg p-7 flex flex-col gap-4",
              "hover:border-[var(--primary)] hover:bg-card/80 transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "cursor-pointer"
            )}
            style={
              {
                "--hover-color": `var(${archetype.colorVar})`,
              } as React.CSSProperties
            }
          >
            <div className="flex flex-col gap-2">
              <h3
                className="font-display font-bold text-foreground text-xl group-hover:transition-colors"
                style={{ color: `var(${archetype.colorVar})` }}
              >
                {archetype.name}
              </h3>
              <p className="text-muted-foreground text-sm font-medium leading-snug">
                {archetype.tagline}
              </p>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed flex-1">
              {archetype.body}
            </p>
            <span
              className="text-sm font-medium font-mono opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: `var(${archetype.colorVar})` }}
            >
              → This is me
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
