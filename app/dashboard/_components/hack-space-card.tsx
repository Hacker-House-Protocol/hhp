"use client"

import { useState } from "react"
import { useApplyToHackSpace } from "@/services/api/hack-spaces"
import { ARCHETYPES } from "@/lib/onboarding"
import type { HackSpace } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface HackSpaceCardProps {
  hackSpace: HackSpace
  currentUserId: string | null
}

export function HackSpaceCard({ hackSpace, currentUserId }: HackSpaceCardProps) {
  const apply = useApplyToHackSpace(hackSpace.id)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [message, setMessage] = useState("")

  const isOwner = currentUserId === hackSpace.creator.id
  const creatorArchetype = ARCHETYPES.find((a) => a.id === hackSpace.creator.archetype)

  function handleApply() {
    apply.mutate(
      { message: message || undefined },
      { onSuccess: () => setShowApplyForm(false) },
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4 hover:border-primary/40 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-display font-bold text-foreground text-base leading-snug">
            {hackSpace.title}
          </h3>
          <p className="text-xs font-mono text-muted-foreground">
            by{" "}
            <span className="text-foreground">@{hackSpace.creator.handle ?? "anon"}</span>
            {creatorArchetype && (
              <span style={{ color: `var(${creatorArchetype.colorVar})` }}>
                {" "}· {creatorArchetype.emoji} {creatorArchetype.name}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
        {hackSpace.description}
      </p>

      {/* Looking for */}
      {hackSpace.looking_for.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Looking for</p>
          <div className="flex flex-wrap gap-1.5">
            {hackSpace.looking_for.map((archetypeId) => {
              const a = ARCHETYPES.find((x) => x.id === archetypeId)
              if (!a) return null
              return (
                <span
                  key={archetypeId}
                  className="text-xs px-2 py-0.5 rounded-sm border font-mono"
                  style={{
                    borderColor: `var(${a.colorVar})`,
                    color: `var(${a.colorVar})`,
                    backgroundColor: `color-mix(in oklch, var(${a.colorVar}) 10%, transparent)`,
                  }}
                >
                  {a.emoji} {a.name}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Skills */}
      {hackSpace.skills_needed.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {hackSpace.skills_needed.map((skill) => (
            <span key={skill} className="text-xs px-2 py-0.5 rounded-sm border border-border text-muted-foreground font-mono">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Apply section */}
      {!isOwner && (
        <div className="pt-1 border-t border-border">
          {apply.isSuccess ? (
            <p className="text-xs font-mono text-primary">✓ Applied</p>
          ) : showApplyForm ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message (optional)"
                maxLength={300}
                rows={2}
                className="bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
              {apply.error && (
                <p className="text-xs text-destructive">{apply.error.message}</p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowApplyForm(false)}
                  disabled={apply.isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleApply}
                  disabled={apply.isPending}
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  {apply.isPending ? "Sending..." : "Send →"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowApplyForm(true)}
              className="text-xs font-mono"
            >
              Apply to join →
            </Button>
          )}
        </div>
      )}

      {isOwner && (
        <div className="pt-1 border-t border-border">
          <p className="text-xs font-mono text-muted-foreground">Your space</p>
        </div>
      )}
    </div>
  )
}
