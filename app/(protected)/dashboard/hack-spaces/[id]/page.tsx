"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  useHackSpace,
  useApplyToHackSpace,
  useUpdateHackSpace,
} from "@/services/api/hack-spaces"
import { useProfile } from "@/services/api/profile"
import { PageContainer } from "../../_components/page-container"
import { ARCHETYPES } from "@/lib/onboarding"
import { ApplicationManager } from "./_components/application-manager"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"
import {
  PenLine,
  GitBranch,
  Users,
  Globe,
  Layers,
  Shield,
  CalendarDays,
  ExternalLink,
  Sparkles,
  MapPin,
} from "lucide-react"

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

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
  open: {
    label: "Looking for members",
    badgeCls: "border-primary text-primary bg-primary/10",
    textCls: "text-primary",
    dotCls: "bg-primary",
    iconBgCls: "bg-primary/10",
  },
  full: {
    label: "Team full",
    badgeCls:
      "border-builder-archetype text-builder-archetype bg-builder-archetype/10",
    textCls: "text-builder-archetype",
    dotCls: "bg-builder-archetype",
    iconBgCls: "bg-builder-archetype/10",
  },
  in_progress: {
    label: "In progress",
    badgeCls: "border-strategist text-strategist bg-strategist/10",
    textCls: "text-strategist",
    dotCls: "bg-strategist",
    iconBgCls: "bg-strategist/10",
  },
  finished: {
    label: "Finished",
    badgeCls: "border-muted-foreground text-muted-foreground bg-muted",
    textCls: "text-muted-foreground",
    dotCls: "bg-muted-foreground",
    iconBgCls: "bg-muted",
  },
} as const

const STAGE_LABELS: Record<string, string> = {
  idea: "Idea",
  prototype: "Prototype",
  in_development: "In Development",
}

const ARCHETYPE_BADGE_VARIANT: Record<string, BadgeVariant> = {
  visionary: "visionary-outline",
  strategist: "strategist-outline",
  builder: "builder-outline",
}

const ARCHETYPE_TEXT_CLS: Record<string, string> = {
  visionary: "text-visionary",
  strategist: "text-strategist",
  builder: "text-builder-archetype",
}

type HackSpaceStatus = keyof typeof STATUS_CONFIG

export default function HackSpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: hackSpace, isLoading } = useHackSpace(id)
  const { data: profile } = useProfile({ enabled: true })
  const apply = useApplyToHackSpace(id)
  const updateHackSpace = useUpdateHackSpace(id)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [message, setMessage] = useState("")

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="h-4 w-28 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-7 w-64" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-28" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-sm" />
                ))}
              </div>
            </div>
          </div>
          <aside>
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
              <Skeleton className="h-3 w-16" />
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>
    )
  }

  if (!hackSpace) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-foreground font-display font-bold text-xl">
          Hack Space not found
        </p>
        <Link
          href="/dashboard/hack-spaces"
          className="text-primary font-mono text-sm hover:underline"
        >
          ← Back to Hack Spaces
        </Link>
      </div>
    )
  }

  const isOwner = profile?.id === hackSpace.creator.id
  const creatorArchetype = ARCHETYPES.find(
    (a) => a.id === hackSpace.creator.archetype,
  )
  const statusCfg = STATUS_CONFIG[hackSpace.status] ?? STATUS_CONFIG.open
  const trackEmoji = TRACK_EMOJIS[hackSpace.track] ?? "🔗"
  const canApply = !isOwner && hackSpace.status === "open"

  const memberCount = hackSpace.member_count ?? 0
  const slots = Array.from({ length: Math.min(hackSpace.max_team_size, 8) })

  function handleStatusChange(newStatus: HackSpaceStatus) {
    updateHackSpace.mutate({ status: newStatus })
  }

  return (
    <PageContainer>
      {/* Navigation */}
      <div className="mb-6">
        <Link
          href="/dashboard/hack-spaces"
          className="text-muted-foreground hover:text-foreground transition-colors font-mono text-sm"
        >
          ← Hack Spaces
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* ── Main content ── */}
        <div className="flex flex-col gap-6">
          {/* Hero header */}
          <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col gap-0">
            <div className="relative h-60 w-full overflow-hidden">
              {hackSpace.image_url ? (
                <img
                  src={hackSpace.image_url}
                  alt={hackSpace.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/20 via-muted to-card" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-card to-transparent" />
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="font-display font-bold text-foreground text-2xl leading-snug">
                      {hackSpace.title}
                    </h1>
                    <span
                      className={cn(
                        "shrink-0 text-xs px-2.5 py-1 rounded-sm border font-mono whitespace-nowrap mt-1",
                        statusCfg.badgeCls,
                      )}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-sm font-mono mt-1.5">
                    <span className="text-muted-foreground">by</span>
                    <Link
                      href={`/dashboard/builders/${hackSpace.creator.handle}`}
                      className="text-foreground font-medium hover:text-primary transition-colors"
                    >
                      @{hackSpace.creator.handle ?? "anon"}
                    </Link>
                    {creatorArchetype && (
                      <span
                        className={
                          ARCHETYPE_TEXT_CLS[creatorArchetype.id] ??
                          "text-muted-foreground"
                        }
                      >
                        · {creatorArchetype.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Event badge */}
              {hackSpace.event_name && (
                <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                  <CalendarDays className="size-4 text-primary shrink-0" />
                  <span className="text-sm font-mono text-primary">
                    For {hackSpace.event_name}
                    {hackSpace.event_timing &&
                      ` · ${hackSpace.event_timing} the event`}
                  </span>
                  {hackSpace.event_url && (
                    <a
                      href={hackSpace.event_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Owner actions */}
              {isOwner && (
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Link href={`/dashboard/hack-spaces/${id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs gap-1.5"
                    >
                      <PenLine className="size-3.5" />
                      Edit
                    </Button>
                  </Link>
                  {hackSpace.status === "open" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs gap-1.5"
                      onClick={() => handleStatusChange("in_progress")}
                      disabled={updateHackSpace.isPending}
                    >
                      <Sparkles className="size-3.5" />
                      Start building
                    </Button>
                  )}
                  {hackSpace.status === "in_progress" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs gap-1.5"
                      onClick={() => handleStatusChange("finished")}
                      disabled={updateHackSpace.isPending}
                    >
                      Mark as finished
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <section className="flex flex-col gap-2">
            <SectionLabel>Description</SectionLabel>
            <p className="text-foreground leading-relaxed">
              {hackSpace.description}
            </p>
          </section>

          {/* Skills */}
          {hackSpace.skills_needed.length > 0 && (
            <section className="flex flex-col gap-2">
              <SectionLabel>Skills needed</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {hackSpace.skills_needed.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-primary/30 text-primary bg-primary/5 font-mono rounded-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Archetypes */}
          {hackSpace.looking_for.length > 0 && (
            <section className="flex flex-col gap-2">
              <SectionLabel>Looking for</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {hackSpace.looking_for.map((archetypeId) => {
                  const a = ARCHETYPES.find((x) => x.id === archetypeId)
                  if (!a) return null
                  return (
                    <Badge
                      key={archetypeId}
                      variant={
                        ARCHETYPE_BADGE_VARIANT[archetypeId] ?? "outline"
                      }
                      className="font-mono rounded-sm text-sm px-3 py-1"
                    >
                      {a.label}
                    </Badge>
                  )
                })}
              </div>
            </section>
          )}

          {/* Apply section (non-owner) */}
          {canApply && (
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
              <SectionLabel>Apply to join</SectionLabel>
              {apply.isSuccess ? (
                <p className="text-sm font-mono text-primary">
                  ✓ Application sent! The creator will review it.
                </p>
              ) : showApplyForm ? (
                <div className="flex flex-col gap-3">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Why do you want to join? What can you bring? (optional)"
                    maxLength={300}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground font-mono">
                    {message.length}/300
                  </p>
                  {apply.error && (
                    <p className="text-xs text-destructive">
                      {apply.error.message}
                    </p>
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
                          { onSuccess: () => setShowApplyForm(false) },
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
                  Apply to Hack Space →
                </Button>
              )}
            </div>
          )}

          {/* Applications manager (owner only) */}
          {isOwner && (
            <section className="flex flex-col gap-4 pt-2">
              <SectionLabel className="border-t border-border pt-4">
                Applications
              </SectionLabel>
              <ApplicationManager hackSpaceId={id} />
            </section>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="flex flex-col gap-4">
          {/* Details card */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <SectionLabel>Details</SectionLabel>
            </div>
            <div className="p-5 flex flex-col gap-3 text-sm">
              <DetailRow icon={<Layers className="size-3.5" />} label="Track">
                {trackEmoji} {hackSpace.track}
              </DetailRow>
              <DetailRow
                icon={<GitBranch className="size-3.5" />}
                label="Stage"
              >
                {STAGE_LABELS[hackSpace.stage]}
              </DetailRow>
              <DetailRow icon={<Shield className="size-3.5" />} label="Level">
                <span className="capitalize">{hackSpace.experience_level}</span>
              </DetailRow>
              <DetailRow icon={<Globe className="size-3.5" />} label="Language">
                {hackSpace.language}
              </DetailRow>
              {(hackSpace.city || hackSpace.country || hackSpace.region) && (
                <DetailRow
                  icon={<MapPin className="size-3.5" />}
                  label="Location"
                >
                  {[hackSpace.city, hackSpace.country, hackSpace.region]
                    .filter(Boolean)
                    .join(", ")}
                </DetailRow>
              )}
              <DetailRow icon={<Shield className="size-3.5" />} label="Access">
                <span className="capitalize">
                  {hackSpace.application_type.replace("_", " ")}
                </span>
              </DetailRow>
              {hackSpace.application_deadline && (
                <DetailRow
                  icon={<CalendarDays className="size-3.5" />}
                  label="Deadline"
                >
                  {new Date(
                    hackSpace.application_deadline,
                  ).toLocaleDateString()}
                </DetailRow>
              )}
            </div>
          </div>

          {/* Team card */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <SectionLabel>Team</SectionLabel>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <span
                  className={cn(
                    "font-mono text-sm font-medium",
                    statusCfg.textCls,
                  )}
                >
                  {memberCount}/{hackSpace.max_team_size} members
                </span>
              </div>
              {/* Member dots */}
              <div className="flex items-center gap-1.5">
                {slots.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "size-3 rounded-full transition-colors",
                      i < memberCount ? statusCfg.dotCls : "bg-border",
                    )}
                  />
                ))}
                {hackSpace.max_team_size > 8 && (
                  <span className="text-[10px] font-mono text-muted-foreground ml-1">
                    +{hackSpace.max_team_size - 8}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Repo link */}
          {hackSpace.repo_url && (
            <a
              href={hackSpace.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-card border border-border rounded-xl px-5 py-3 text-sm font-mono text-primary hover:border-primary/30 transition-colors"
            >
              <GitBranch className="size-4" />
              Repository
              <ExternalLink className="size-3 ml-auto text-muted-foreground" />
            </a>
          )}
        </aside>
      </div>
    </PageContainer>
  )
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "text-xs font-mono text-muted-foreground uppercase tracking-widest",
        className,
      )}
    >
      {children}
    </h2>
  )
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-muted-foreground font-mono">
        {icon}
        {label}
      </span>
      <span className="text-foreground font-mono text-right">{children}</span>
    </div>
  )
}
