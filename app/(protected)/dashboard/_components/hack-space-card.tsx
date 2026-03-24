"use client"

import { useState } from "react"
import Link from "next/link"
import { useApplyToHackSpace } from "@/services/api/hack-spaces"
import { ARCHETYPES } from "@/lib/onboarding"
import type { HackSpace } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import type { VariantProps } from "class-variance-authority"

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

const ARCHETYPE_BADGE_VARIANT: Record<string, BadgeVariant> = {
  visionary: "visionary-outline",
  strategist: "strategist-outline",
  builder: "builder-outline",
}

const TRACK_EMOJIS: Record<string, string> = {
  DeFi: "💰",
  "DAO tools": "🏛️",
  AI: "🤖",
  Social: "🌐",
  Gaming: "🎮",
  NFTs: "🖼️",
  Infrastructure: "⚙️",
  Other: "🔗",
}

const STATUS_CONFIG = {
  open: { label: "Looking for members", colorVar: "--primary" },
  full: { label: "Team full", colorVar: "--builder-archetype" },
  in_progress: { label: "In progress", colorVar: "--strategist" },
  finished: { label: "Finished", colorVar: "--muted-foreground" },
} as const

interface HackSpaceCardProps {
  hackSpace: HackSpace
  currentUserId: string | null
}

export function HackSpaceCard({
  hackSpace,
  currentUserId,
}: HackSpaceCardProps) {
  const apply = useApplyToHackSpace(hackSpace.id)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [message, setMessage] = useState("")

  const isOwner = currentUserId === hackSpace.creator.id
  const creatorArchetype = ARCHETYPES.find(
    (a) => a.id === hackSpace.creator.archetype,
  )
  const statusCfg = STATUS_CONFIG[hackSpace.status] ?? STATUS_CONFIG.open
  const trackEmoji = TRACK_EMOJIS[hackSpace.track] ?? "🔗"

  const visibleSkills = hackSpace.skills_needed.slice(0, 3)
  const extraSkills = hackSpace.skills_needed.length - 3

  function handleApply() {
    apply.mutate(
      { message: message || undefined },
      { onSuccess: () => setShowApplyForm(false) },
    )
  }

  const memberCount = hackSpace.member_count ?? 0
  const slots = Array.from({ length: Math.min(hackSpace.max_team_size, 6) })

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-primary/30 transition-all duration-200">
      {/* Status accent stripe */}
      <div
        className="h-0.75 w-full shrink-0"
        style={{ background: `var(${statusCfg.colorVar})` }}
      />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Track icon box */}
          <div
            className="size-11 rounded-lg flex items-center justify-center text-xl shrink-0"
            style={{
              background: `color-mix(in oklch, var(${statusCfg.colorVar}) 12%, var(--muted))`,
            }}
          >
            {trackEmoji}
          </div>

          {/* Title + status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-bold text-foreground text-base leading-snug line-clamp-1 flex-1">
                {hackSpace.title}
              </h3>
              <span
                className="shrink-0 text-[10px] px-2 py-0.5 rounded-sm border font-mono whitespace-nowrap"
                style={{
                  borderColor: `var(${statusCfg.colorVar})`,
                  color: `var(${statusCfg.colorVar})`,
                  backgroundColor: `color-mix(in oklch, var(${statusCfg.colorVar}) 10%, transparent)`,
                }}
              >
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              by{" "}
              <Link
                href={`/dashboard/builders/${hackSpace.creator.handle}`}
                className="text-foreground hover:text-primary transition-colors"
              >
                @{hackSpace.creator.handle ?? "anon"}
              </Link>
              {creatorArchetype && (
                <span style={{ color: `var(${creatorArchetype.colorVar})` }}>
                  {" "}
                  · {creatorArchetype.name}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {hackSpace.description}
        </p>

        {/* Pills: skills + archetypes */}
        {(hackSpace.skills_needed.length > 0 ||
          hackSpace.looking_for.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {visibleSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="border-primary/30 text-primary bg-primary/5 font-mono rounded-sm"
              >
                {skill}
              </Badge>
            ))}
            {extraSkills > 0 && (
              <Badge variant="outline" className="font-mono rounded-sm text-muted-foreground">
                +{extraSkills}
              </Badge>
            )}
            {hackSpace.looking_for.map((archetypeId) => {
              const a = ARCHETYPES.find((x) => x.id === archetypeId)
              if (!a) return null
              return (
                <Badge
                  key={archetypeId}
                  variant={ARCHETYPE_BADGE_VARIANT[archetypeId] ?? "outline"}
                  className="font-mono rounded-sm"
                >
                  {a.name}
                </Badge>
              )
            })}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
          {/* Left: member dots + metadata */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1">
              {slots.map((_, i) => (
                <div
                  key={i}
                  className={i < memberCount ? "size-2 rounded-full transition-colors" : "size-2 rounded-full transition-colors bg-border"}
                  style={i < memberCount ? { background: `var(${statusCfg.colorVar})` } : undefined}
                />
              ))}
              {hackSpace.max_team_size > 6 && (
                <span className="text-[10px] font-mono text-muted-foreground ml-1">
                  +{hackSpace.max_team_size - 6}
                </span>
              )}
              <span className="text-[10px] font-mono text-muted-foreground ml-1">
                {memberCount}/{hackSpace.max_team_size}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
              <span>{hackSpace.language}</span>
              {hackSpace.event_name && (
                <>
                  <span>·</span>
                  <span className="text-primary truncate">
                    📅 {hackSpace.event_name}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: CTA */}
          {isOwner ? (
            <Link href={`/dashboard/hack-spaces/${hackSpace.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="text-xs font-mono rounded-lg shrink-0"
              >
                Manage →
              </Button>
            </Link>
          ) : hackSpace.status === "full" || hackSpace.status === "finished" ? (
            <Link href={`/dashboard/hack-spaces/${hackSpace.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="text-xs font-mono rounded-lg shrink-0"
              >
                View →
              </Button>
            </Link>
          ) : apply.isSuccess ? (
            <span className="text-xs font-mono text-primary shrink-0">
              ✓ Applied
            </span>
          ) : showApplyForm ? (
            <span className="text-xs font-mono text-muted-foreground shrink-0">
              Applying...
            </span>
          ) : (
            <Button
              size="sm"
              onClick={() => setShowApplyForm(true)}
              className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs shrink-0"
            >
              Apply →
            </Button>
          )}
        </div>

        {/* Inline apply form */}
        {showApplyForm && !apply.isSuccess && (
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why do you want to join? (optional)"
              maxLength={300}
              rows={2}
              className="resize-none"
            />
            {apply.error && (
              <p className="text-xs text-destructive">{apply.error.message}</p>
            )}
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowApplyForm(false)}
                disabled={apply.isPending}
                className="text-xs font-mono"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={apply.isPending}
                className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs"
              >
                {apply.isPending ? "Sending..." : "Send →"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
