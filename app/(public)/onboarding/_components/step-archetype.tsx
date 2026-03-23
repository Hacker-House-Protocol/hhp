"use client"

import { useState } from "react"
import { ARCHETYPES, type ArchetypeId } from "@/lib/onboarding"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface StepArchetypeProps {
  onSelect: (archetype: ArchetypeId) => void
  loading: boolean
}

// Maps archetype id → Tailwind color classes (bg + text)
const ARCHETYPE_COLOR: Record<ArchetypeId, { text: string; bg: string }> = {
  visionary:  { text: "text-visionary",        bg: "bg-visionary" },
  strategist: { text: "text-strategist",       bg: "bg-strategist" },
  builder:    { text: "text-builder-archetype", bg: "bg-builder-archetype" },
}

export function StepArchetype({ onSelect, loading }: StepArchetypeProps) {
  const [pendingId, setPendingId] = useState<ArchetypeId | null>(null)

  async function handleSelect(id: ArchetypeId) {
    setPendingId(id)
    await onSelect(id)
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Step header */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
          01 — Archetype
        </p>
        <h1 className="font-display font-bold text-foreground text-4xl leading-tight">
          What&apos;s your role?
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-md">
          Choose the archetype that best defines how you build. This shapes your matches.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ARCHETYPES.map((archetype) => {
          const isPending = pendingId === archetype.id && loading
          const colors = ARCHETYPE_COLOR[archetype.id]

          return (
            <button
              key={archetype.id}
              type="button"
              onClick={() => handleSelect(archetype.id)}
              disabled={loading}
              className={cn(
                "group relative text-left flex flex-col gap-5 rounded-2xl border border-border bg-card p-7",
                "transition-all duration-200 cursor-pointer",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              onMouseEnter={(e) => {
                // Dynamic hover — color depends on which archetype card, must stay inline
                e.currentTarget.style.borderColor = `var(${archetype.colorVar})`
                e.currentTarget.style.boxShadow = `0 0 24px color-mix(in oklch, var(${archetype.colorVar}) 20%, transparent)`
              }}
              onMouseLeave={(e) => {
                if (pendingId !== archetype.id) {
                  e.currentTarget.style.borderColor = ""
                  e.currentTarget.style.boxShadow = ""
                }
              }}
            >
              {/* Top accent line — static per card, uses bg class */}
              <div
                className={cn(
                  "absolute top-0 left-6 right-6 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  colors.bg,
                )}
              />

              <div className="flex flex-col gap-2">
                <h3 className={cn("font-display font-bold text-xl leading-tight", colors.text)}>
                  {archetype.name}
                </h3>
                <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                  {archetype.tagline}
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {archetype.body}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    colors.text,
                  )}
                >
                  → This is me
                </span>
                {isPending && <Spinner className={cn("size-4", colors.text)} />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
