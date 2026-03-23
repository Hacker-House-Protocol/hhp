"use client"

import { useState } from "react"
import { CYPHER_KITTENS } from "@/lib/onboarding"
import { usePatchProfile } from "@/services/api/profile"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface StepAvatarProps {
  onBack: () => void
}

export function StepAvatar({ onBack }: StepAvatarProps) {
  const patchProfile = usePatchProfile()
  const [selected, setSelected] = useState<string | null>(null)

  async function handleContinue() {
    if (!selected) return
    await patchProfile.mutateAsync({ avatar_url: selected, onboarding_step: "profile" })
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Step header */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
          03 — Avatar
        </p>
        <h1 className="font-display font-bold text-foreground text-4xl leading-tight">
          Choose your Cypher Kitten
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-md">
          This is your avatar on the protocol. It travels with you everywhere — choose wisely.
        </p>
      </div>

      {/* Kitten grid */}
      <div className="grid grid-cols-2 gap-6">
        {CYPHER_KITTENS.map((kitten) => {
          const isSelected = selected === kitten.src

          return (
            <button
              key={kitten.id}
              type="button"
              onClick={() => setSelected(kitten.src)}
              disabled={patchProfile.isPending}
              className={cn(
                "group relative flex flex-col items-center gap-4 rounded-2xl border-2 p-6",
                "transition-all duration-200 cursor-pointer",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              style={{
                borderColor: isSelected ? "var(--primary)" : "var(--border)",
                background: isSelected
                  ? "color-mix(in oklch, var(--primary) 8%, var(--card))"
                  : "var(--card)",
                boxShadow: isSelected
                  ? "0 0 32px color-mix(in oklch, var(--primary) 25%, transparent)"
                  : "none",
              }}
            >
              {/* Selected badge */}
              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  ✓
                </div>
              )}

              {/* GIF */}
              <div className="relative w-40 h-40 rounded-xl overflow-hidden">
                <img
                  src={kitten.src}
                  alt={kitten.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {patchProfile.isPending && isSelected && (
                  <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                    <Spinner className="size-6 text-primary" />
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className="text-sm font-mono font-medium transition-colors"
                style={{ color: isSelected ? "var(--primary)" : "var(--muted-foreground)" }}
              >
                {kitten.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="lg" onClick={onBack} disabled={patchProfile.isPending} className="rounded-xl font-mono">
          ← Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!selected || patchProfile.isPending}
          className="rounded-xl font-mono font-semibold px-6"
        >
          {patchProfile.isPending ? <><Spinner className="mr-2" /> Saving...</> : "Continue →"}
        </Button>
      </div>
    </div>
  )
}
