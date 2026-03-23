"use client"

import { useState } from "react"
import { ARCHETYPES, SKILLS_BY_ARCHETYPE, ALL_SKILLS, type ArchetypeId } from "@/lib/onboarding"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepSkillsProps {
  archetype: ArchetypeId
  onNext: (skills: string[]) => void
  onBack: () => void
  loading: boolean
}

export function StepSkills({ archetype, onNext, onBack, loading }: StepSkillsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const archetypeData = ARCHETYPES.find((a) => a.id === archetype)!
  const suggestedSkills = SKILLS_BY_ARCHETYPE[archetype]
  const otherSkills = ALL_SKILLS.filter((s) => !suggestedSkills.includes(s))

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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display font-bold text-foreground text-3xl sm:text-4xl">
          What are your skills?
        </h1>
        <p className="text-muted-foreground text-lg">
          Select all that apply. Your{" "}
          <span style={{ color: `var(${archetypeData.colorVar})` }}>
            {archetypeData.name}
          </span>{" "}
          skills are highlighted.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Suggested skills */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Suggested for {archetypeData.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill) => (
              <SkillPill
                key={skill}
                skill={skill}
                selected={selected.has(skill)}
                colorVar={archetypeData.colorVar}
                onToggle={toggle}
              />
            ))}
          </div>
        </div>

        {/* Other skills */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Other skills
          </p>
          <div className="flex flex-wrap gap-2">
            {otherSkills.map((skill) => (
              <SkillPill
                key={skill}
                skill={skill}
                selected={selected.has(skill)}
                colorVar="--muted-foreground"
                onToggle={toggle}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack} disabled={loading}>
          ← Back
        </Button>
        <Button
          onClick={() => onNext(Array.from(selected))}
          disabled={selected.size === 0 || loading}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
        >
          {loading ? "Saving..." : "Continue →"}
        </Button>
      </div>
    </div>
  )
}

interface SkillPillProps {
  skill: string
  selected: boolean
  colorVar: string
  onToggle: (skill: string) => void
}

function SkillPill({ skill, selected, colorVar, onToggle }: SkillPillProps) {
  return (
    <button
      onClick={() => onToggle(skill)}
      className={cn(
        "text-sm px-3 py-1.5 rounded-sm border font-mono transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      )}
      style={
        selected
          ? {
              borderColor: `var(${colorVar})`,
              color: `var(${colorVar})`,
              backgroundColor: `color-mix(in oklch, var(${colorVar}) 15%, transparent)`,
            }
          : {
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
              backgroundColor: "transparent",
            }
      }
    >
      {selected ? "✓ " : ""}{skill}
    </button>
  )
}
