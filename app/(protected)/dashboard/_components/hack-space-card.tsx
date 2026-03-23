"use client"

import { useState } from "react"
import Link from "next/link"
import { useApplyToHackSpace } from "@/services/api/hack-spaces"
import { ARCHETYPES } from "@/lib/onboarding"
import type { HackSpace } from "@/lib/types"
import { Button } from "@/components/ui/button"

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
  open: { label: "Buscando miembros", colorVar: "--primary" },
  full: { label: "Equipo completo", colorVar: "--builder-archetype" },
  in_progress: { label: "En progreso", colorVar: "--strategist" },
  finished: { label: "Finalizado", colorVar: "--muted-foreground" },
} as const

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
  const statusCfg = STATUS_CONFIG[hackSpace.status] ?? STATUS_CONFIG.open
  const trackEmoji = TRACK_EMOJIS[hackSpace.track] ?? "🔗"

  const visibleSkills = hackSpace.skills_needed.slice(0, 4)
  const extraSkills = hackSpace.skills_needed.length - 4

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
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{trackEmoji}</span>
            <h3 className="font-display font-bold text-foreground text-base leading-snug truncate">
              {hackSpace.title}
            </h3>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            by{" "}
            <span className="text-foreground">@{hackSpace.creator.handle ?? "anon"}</span>
            {creatorArchetype && (
              <span style={{ color: `var(${creatorArchetype.colorVar})` }}>
                {" "}· {creatorArchetype.name}
              </span>
            )}
          </p>
        </div>
        {/* Status badge */}
        <span
          className="flex-shrink-0 text-xs px-2 py-0.5 rounded-sm border font-mono whitespace-nowrap"
          style={{
            borderColor: `var(${statusCfg.colorVar})`,
            color: `var(${statusCfg.colorVar})`,
            backgroundColor: `color-mix(in oklch, var(${statusCfg.colorVar}) 10%, transparent)`,
          }}
        >
          {statusCfg.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
        {hackSpace.description}
      </p>

      {/* Skills */}
      {hackSpace.skills_needed.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Skills needed</p>
          <div className="flex flex-wrap gap-1.5">
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-2 py-0.5 rounded-sm border border-primary/40 text-primary font-mono bg-primary/5"
              >
                {skill}
              </span>
            ))}
            {extraSkills > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-sm border border-border text-muted-foreground font-mono">
                +{extraSkills} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Archetypes looking for */}
      {hackSpace.looking_for.length > 0 && (
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
                {a.name}
              </span>
            )
          })}
        </div>
      )}

      {/* Metadata row */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-muted-foreground">
        <span>{hackSpace.language}</span>
        {hackSpace.timezone_region && <span>· {hackSpace.timezone_region}</span>}
        <span>· {hackSpace.stage.replace("_", " ")}</span>
        <span className="font-medium" style={{ color: `var(${statusCfg.colorVar})` }}>
          · {hackSpace.member_count ?? 0}/{hackSpace.max_team_size} members
        </span>
      </div>

      {/* Event badge */}
      {hackSpace.event_name && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs">📅</span>
          <span className="text-xs font-mono text-primary">For {hackSpace.event_name}</span>
        </div>
      )}

      {/* CTA */}
      <div className="pt-1 border-t border-border">
        {isOwner ? (
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-muted-foreground">Your space</p>
            <Link
              href={`/dashboard/hack-spaces/${hackSpace.id}`}
              className="text-xs font-mono text-primary hover:underline"
            >
              Manage →
            </Link>
          </div>
        ) : hackSpace.status === "full" || hackSpace.status === "finished" ? (
          <Link href={`/dashboard/hack-spaces/${hackSpace.id}`}>
            <Button size="sm" variant="outline" className="text-xs font-mono">
              Ver equipo →
            </Button>
          </Link>
        ) : apply.isSuccess ? (
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
            Aplicar →
          </Button>
        )}
      </div>
    </div>
  )
}
