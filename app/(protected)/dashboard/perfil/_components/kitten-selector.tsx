"use client"

import { CYPHER_KITTENS } from "@/lib/onboarding"
import { cn } from "@/lib/utils"

interface KittenSelectorProps {
  value: string | null
  onChange: (src: string) => void
}

export function KittenSelector({ value, onChange }: KittenSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {CYPHER_KITTENS.map((kitten) => {
        const isSelected = value === kitten.src
        return (
          <button
            key={kitten.id}
            type="button"
            onClick={() => onChange(kitten.src)}
            className={cn(
              "relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5",
              "transition-all duration-200 cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
            style={{
              borderColor: isSelected ? "var(--primary)" : "var(--border)",
              background: isSelected
                ? "color-mix(in oklch, var(--primary) 8%, var(--card))"
                : "var(--card)",
              boxShadow: isSelected
                ? "0 0 24px color-mix(in oklch, var(--primary) 20%, transparent)"
                : "none",
            }}
          >
            {isSelected && (
              <div
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                ✓
              </div>
            )}
            <img
              src={kitten.src}
              alt={kitten.label}
              className="w-32 h-32 rounded-xl object-cover"
            />
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
  )
}
