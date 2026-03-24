"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useHackSpace, useApplyToHackSpace } from "@/services/api/hack-spaces"
import { useProfile } from "@/services/api/profile"
import { PageContainer } from "../../_components/page-container"
import { ARCHETYPES } from "@/lib/onboarding"
import { ApplicationManager } from "./_components/application-manager"
import { LoadingScreen } from "@/components/loading-screen"
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

const STAGE_LABELS: Record<string, string> = {
  idea: "Idea",
  prototype: "Prototype",
  in_development: "In Development",
}

export default function HackSpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: hackSpace, isLoading } = useHackSpace(id)
  const { data: profile } = useProfile({ enabled: true })
  const apply = useApplyToHackSpace(id)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [message, setMessage] = useState("")

  if (isLoading) {
    return <LoadingScreen message="Loading" />
  }

  if (!hackSpace) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-foreground font-display font-bold text-xl">Hack Space not found</p>
        <Link href="/dashboard/hack-spaces" className="text-primary font-mono text-sm hover:underline">
          ← Back to Hack Spaces
        </Link>

      </div>
    )
  }

  const isOwner = profile?.id === hackSpace.creator.id
  const creatorArchetype = ARCHETYPES.find((a) => a.id === hackSpace.creator.archetype)
  const statusCfg = STATUS_CONFIG[hackSpace.status] ?? STATUS_CONFIG.open
  const trackEmoji = TRACK_EMOJIS[hackSpace.track] ?? "🔗"

  const canApply = !isOwner && hackSpace.status === "open"

  return (
    <PageContainer className="py-10">
      <div className="mb-6">
        <Link
          href="/dashboard/hack-spaces"
          className="text-muted-foreground hover:text-foreground transition-colors font-mono text-sm"
        >
          ← Hack Spaces
        </Link>
      </div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* Main content */}
          <div className="flex flex-col gap-8">
            {/* Title block */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{trackEmoji}</span>
                  <h1 className="font-display font-bold text-foreground text-2xl leading-snug">
                    {hackSpace.title}
                  </h1>
                </div>
                <span
                  className="flex-shrink-0 text-xs px-2.5 py-1 rounded-sm border font-mono"
                  style={{
                    borderColor: `var(${statusCfg.colorVar})`,
                    color: `var(${statusCfg.colorVar})`,
                    backgroundColor: `color-mix(in oklch, var(${statusCfg.colorVar}) 10%, transparent)`,
                  }}
                >
                  {statusCfg.label}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-sm font-mono">
                <span className="text-muted-foreground">by</span>
                <span className="text-foreground font-medium">@{hackSpace.creator.handle ?? "anon"}</span>
                {creatorArchetype && (
                  <span style={{ color: `var(${creatorArchetype.colorVar})` }}>
                    · {creatorArchetype.name}
                  </span>
                )}
              </div>

              {hackSpace.event_name && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">📅</span>
                  <span className="text-sm font-mono text-primary">
                    Para {hackSpace.event_name}
                    {hackSpace.event_timing && ` · ${hackSpace.event_timing} the event`}
                  </span>
                  {hackSpace.event_url && (
                    <a
                      href={hackSpace.event_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary font-mono underline"
                    >
                      Link →
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Description</h2>
              <p className="text-foreground leading-relaxed">{hackSpace.description}</p>
            </div>

            {/* Skills */}
            {hackSpace.skills_needed.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Skills needed</h2>
                <div className="flex flex-wrap gap-2">
                  {hackSpace.skills_needed.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-sm border border-primary/40 text-primary font-mono bg-primary/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Archetypes */}
            {hackSpace.looking_for.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Looking for</h2>
                <div className="flex flex-wrap gap-2">
                  {hackSpace.looking_for.map((archetypeId) => {
                    const a = ARCHETYPES.find((x) => x.id === archetypeId)
                    if (!a) return null
                    return (
                      <span
                        key={archetypeId}
                        className="text-sm px-3 py-1 rounded-sm border font-mono"
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
              </div>
            )}

            {/* Apply section (non-owner) */}
            {canApply && (
              <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3">
                <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Apply to join</h2>
                {apply.isSuccess ? (
                  <p className="text-sm font-mono text-primary">✓ Application sent! The creator will review it.</p>
                ) : showApplyForm ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Why do you want to join? What can you bring? (optional)"
                      maxLength={300}
                      rows={3}
                      className="bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none w-full"
                    />
                    <p className="text-xs text-muted-foreground font-mono">{message.length}/300</p>
                    {apply.error && (
                      <p className="text-xs text-destructive">{apply.error.message}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setShowApplyForm(false)}
                        disabled={apply.isPending}
                        className="font-mono text-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() =>
                          apply.mutate(
                            { message: message || undefined },
                            { onSuccess: () => setShowApplyForm(false) }
                          )
                        }
                        disabled={apply.isPending}
                        className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
                      >
                        {apply.isPending ? "Sending..." : "Send application →"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowApplyForm(true)}
                    className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 w-fit"
                  >
                    Aplicar al Hack Space →
                  </Button>
                )}
              </div>
            )}

            {/* Applications manager (owner only) */}
            {isOwner && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest border-t border-border pt-4">
                  Applications
                </h2>
                <ApplicationManager hackSpaceId={id} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4">
              <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Details</h2>

              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">Track</span>
                  <span className="text-foreground font-mono">
                    {trackEmoji} {hackSpace.track}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">Stage</span>
                  <span className="text-foreground font-mono">{STAGE_LABELS[hackSpace.stage]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">Team</span>
                  <span
                    className="font-mono font-medium"
                    style={{ color: `var(${statusCfg.colorVar})` }}
                  >
                    {hackSpace.member_count ?? 0}/{hackSpace.max_team_size} members
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">Level</span>
                  <span className="text-foreground font-mono capitalize">{hackSpace.experience_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">Language</span>
                  <span className="text-foreground font-mono">{hackSpace.language}</span>
                </div>
                {hackSpace.timezone_region && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-mono">Region</span>
                    <span className="text-foreground font-mono">{hackSpace.timezone_region}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">Applications</span>
                  <span className="text-foreground font-mono capitalize">
                    {hackSpace.application_type.replace("_", " ")}
                  </span>
                </div>
                {hackSpace.application_deadline && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-mono">Deadline</span>
                    <span className="text-foreground font-mono">
                      {new Date(hackSpace.application_deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {hackSpace.repo_url && (
                <a
                  href={hackSpace.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-primary hover:underline"
                >
                  🔗 Repository →
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PageContainer>
  )
}
