"use client"

import { useState } from "react"
import { ARCHETYPES, SKILLS_BY_ARCHETYPE, ALL_SKILLS, type ArchetypeId } from "@/lib/onboarding"
import { Button, type buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

interface StepSkillsProps {
  archetype: ArchetypeId
  onNext: (skills: string[]) => void
  onBack: () => void
  loading: boolean
}

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]

// Maps archetype id → filled / outline Button variants
const ARCHETYPE_VARIANT: Record<ArchetypeId, { filled: ButtonVariant; outline: ButtonVariant }> = {
  visionary:  { filled: "visionary",  outline: "visionary-outline" },
  strategist: { filled: "strategist", outline: "strategist-outline" },
  builder:    { filled: "builder",    outline: "builder-outline" },
}

// Maps archetype id → Tailwind text class
const ARCHETYPE_TEXT: Record<ArchetypeId, string> = {
  visionary:  "text-visionary",
  strategist: "text-strategist",
  builder:    "text-builder-archetype",
}

export function StepSkills({ archetype, onNext, onBack, loading }: StepSkillsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const archetypeData = ARCHETYPES.find((a) => a.id === archetype)!
  const suggestedSkills = SKILLS_BY_ARCHETYPE[archetype]
  const otherSkills = ALL_SKILLS.filter((s) => !suggestedSkills.includes(s))
  const variants = ARCHETYPE_VARIANT[archetype]

  function toggle(skill: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(skill)) {
        next.delete(skill)
      } else {
        next.add(skill)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Step header */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
          02 — Skills
        </p>
        <h1 className="font-display font-bold text-foreground text-4xl leading-tight">
          What are your skills?
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-md">
          Select all that apply.{" "}
          <span className={cn("font-medium", ARCHETYPE_TEXT[archetype])}>
            {archetypeData.name}
          </span>{" "}
          skills are highlighted below.
        </p>
      </div>

      {/* Skills sections */}
      <div className="flex flex-col gap-8">
        {/* Suggested — archetype color */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em] shrink-0">
              Suggested
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill) => {
              const isSelected = selected.has(skill)
              return (
                <Button
                  key={skill}
                  type="button"
                  size="sm"
                  variant={isSelected ? variants.filled : variants.outline}
                  onClick={() => toggle(skill)}
                  className="rounded-md font-mono"
                >
                  {isSelected ? "✓ " : ""}{skill}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Other — primary color */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em] shrink-0">
              Other skills
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="flex flex-wrap gap-2">
            {otherSkills.map((skill) => {
              const isSelected = selected.has(skill)
              return (
                <Button
                  key={skill}
                  type="button"
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => toggle(skill)}
                  className="rounded-md font-mono"
                >
                  {isSelected ? "✓ " : ""}{skill}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" size="lg" onClick={onBack} disabled={loading} className="rounded-xl font-mono">
          ← Back
        </Button>
        <Button
          size="lg"
          onClick={() => onNext(Array.from(selected))}
          disabled={selected.size === 0 || loading}
          className="rounded-xl font-mono font-semibold px-6"
        >
          {loading ? <><Spinner className="mr-2" /> Saving...</> : "Continue →"}
        </Button>
      </div>
    </div>
  )
}
