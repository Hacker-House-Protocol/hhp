"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  useHackerHouse,
  useApplyToHackerHouse,
  useUpdateHackerHouse,
} from "@/services/api/hacker-houses"
import { useProfile } from "@/services/api/profile"
import { PageContainer } from "../../_components/page-container"
import { ARCHETYPES } from "@/lib/onboarding"
import { HackerHouseApplicationManager } from "./_components/hacker-house-application-manager"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  PenLine,
  Users,
  Globe,
  CalendarDays,
  ExternalLink,
  MapPin,
  Sparkles,
  Home,
} from "lucide-react"

const STATUS_CONFIG = {
  open: {
    label: "Open",
    badgeCls: "border-primary text-primary bg-primary/10",
    textCls: "text-primary",
    dotCls: "bg-primary",
    colorVar: "--primary",
  },
  full: {
    label: "Full",
    badgeCls: "border-builder-archetype text-builder-archetype bg-builder-archetype/10",
    textCls: "text-builder-archetype",
    dotCls: "bg-builder-archetype",
    colorVar: "--builder-archetype",
  },
  active: {
    label: "Active",
    badgeCls: "border-strategist text-strategist bg-strategist/10",
    textCls: "text-strategist",
    dotCls: "bg-strategist",
    colorVar: "--strategist",
  },
  finished: {
    label: "Finished",
    badgeCls: "border-muted-foreground text-muted-foreground bg-muted",
    textCls: "text-muted-foreground",
    dotCls: "bg-muted-foreground",
    colorVar: "--muted-foreground",
  },
} as const

type HouseStatus = keyof typeof STATUS_CONFIG

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-xs font-mono text-muted-foreground uppercase tracking-widest", className)}>
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

export default function HackerHouseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: hackerHouse, isLoading } = useHackerHouse(id)
  const { data: profile } = useProfile({ enabled: true })
  const apply = useApplyToHackerHouse(id)
  const updateHackerHouse = useUpdateHackerHouse(id)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [message, setMessage] = useState("")

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="h-4 w-28 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="flex flex-col gap-8">
            <Skeleton className="h-60 rounded-xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <aside>
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
              <Skeleton className="h-3 w-16" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </PageContainer>
    )
  }

  if (!hackerHouse) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-foreground font-display font-bold text-xl">Hacker House not found</p>
        <Link
          href="/dashboard/hacker-houses"
          className="text-primary font-mono text-sm hover:underline"
        >
          ← Back to Hacker Houses
        </Link>
      </div>
    )
  }

  const isOwner = profile?.id === hackerHouse.creator.id
  const creatorArchetype = ARCHETYPES.find((a) => a.id === hackerHouse.creator.archetype)
  const statusCfg = STATUS_CONFIG[hackerHouse.status as HouseStatus] ?? STATUS_CONFIG.open
  const canApply = !isOwner && hackerHouse.status === "open"

  const slots = Array.from({ length: Math.min(hackerHouse.capacity, 10) })
  const filledCount = hackerHouse.participants_count

  // Participants for display: creator first + accepted
  const allParticipants = [hackerHouse.creator, ...(hackerHouse.participants ?? [])]

  function handleStatusChange(newStatus: HouseStatus) {
    updateHackerHouse.mutate({ status: newStatus })
  }

  return (
    <PageContainer>
      {/* Navigation */}
      <div className="mb-6">
        <Link
          href="/dashboard/hacker-houses"
          className="text-muted-foreground hover:text-foreground transition-colors font-mono text-sm"
        >
          ← Hacker Houses
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* ── Main content ── */}
        <div className="flex flex-col gap-6">
          {/* Hero card */}
          <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col gap-0">
            <div className="relative h-60 w-full overflow-hidden">
              {hackerHouse.images[0] ? (
                <img
                  src={hackerHouse.images[0]}
                  alt={hackerHouse.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/20 via-muted to-card" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-card to-transparent" />
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="font-display font-bold text-foreground text-2xl leading-snug">
                      {hackerHouse.name}
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
                    <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">
                      {hackerHouse.city}, {hackerHouse.country}
                    </span>
                    {hackerHouse.neighborhood && (
                      <span className="text-muted-foreground">· {hackerHouse.neighborhood}</span>
                    )}
                    <span className="text-muted-foreground">· by</span>
                    <Link
                      href={`/dashboard/builders/${hackerHouse.creator.handle}`}
                      className="text-foreground font-medium hover:text-primary transition-colors"
                    >
                      @{hackerHouse.creator.handle ?? "anon"}
                    </Link>
                    {creatorArchetype && (
                      <span style={{ color: `var(${creatorArchetype.colorVar})` }}>
                        · {creatorArchetype.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Event badge */}
              {hackerHouse.event_name && (
                <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                  <CalendarDays className="size-4 text-primary shrink-0" />
                  <span className="text-sm font-mono text-primary">
                    For {hackerHouse.event_name}
                    {hackerHouse.event_timing && hackerHouse.event_timing.length > 0 &&
                      ` · ${hackerHouse.event_timing.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" · ")} the event`}
                    {hackerHouse.event_start_date && (
                      <>
                        {" · "}
                        {hackerHouse.event_end_date
                          ? `${new Date(hackerHouse.event_start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${new Date(hackerHouse.event_end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                          : new Date(hackerHouse.event_start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </>
                    )}
                  </span>
                  {hackerHouse.event_url && (
                    <a
                      href={hackerHouse.event_url}
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
                  <Link href={`/dashboard/hacker-houses/${id}/edit`}>
                    <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5">
                      <PenLine className="size-3.5" />
                      Edit
                    </Button>
                  </Link>
                  {hackerHouse.status === "open" || hackerHouse.status === "full" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs gap-1.5"
                      onClick={() => handleStatusChange("active")}
                      disabled={updateHackerHouse.isPending}
                    >
                      <Sparkles className="size-3.5" />
                      Mark as active
                    </Button>
                  ) : null}
                  {hackerHouse.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs gap-1.5"
                      onClick={() => handleStatusChange("finished")}
                      disabled={updateHackerHouse.isPending}
                    >
                      Mark as finished
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Image gallery strip */}
          {hackerHouse.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {hackerHouse.images.slice(1).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Photo ${i + 2}`}
                  className="h-16 w-24 object-cover rounded-lg shrink-0 border border-border"
                />
              ))}
            </div>
          )}

          {/* House rules */}
          {hackerHouse.house_rules && (
            <section className="flex flex-col gap-2">
              <SectionLabel>House rules</SectionLabel>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm">
                {hackerHouse.house_rules}
              </p>
            </section>
          )}

          {/* Amenities */}
          {(hackerHouse.includes_private_room ||
            hackerHouse.includes_shared_room ||
            hackerHouse.includes_meals ||
            hackerHouse.includes_workspace ||
            hackerHouse.includes_internet) && (
            <section className="flex flex-col gap-2">
              <SectionLabel>Includes</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {hackerHouse.includes_private_room && (
                  <span className="text-sm px-3 py-1.5 rounded-lg border border-border bg-muted text-foreground font-mono">
                    Private room
                  </span>
                )}
                {hackerHouse.includes_shared_room && (
                  <span className="text-sm px-3 py-1.5 rounded-lg border border-border bg-muted text-foreground font-mono">
                    Shared room
                  </span>
                )}
                {hackerHouse.includes_meals && (
                  <span className="text-sm px-3 py-1.5 rounded-lg border border-border bg-muted text-foreground font-mono">
                    Meals
                  </span>
                )}
                {hackerHouse.includes_workspace && (
                  <span className="text-sm px-3 py-1.5 rounded-lg border border-border bg-muted text-foreground font-mono">
                    Workspace
                  </span>
                )}
                {hackerHouse.includes_internet && (
                  <span className="text-sm px-3 py-1.5 rounded-lg border border-border bg-muted text-foreground font-mono">
                    Internet
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Participants section */}
          {allParticipants.length > 0 && (
            <section className="flex flex-col gap-3">
              <SectionLabel>
                Participants ({hackerHouse.participants_count}/{hackerHouse.capacity})
              </SectionLabel>
              <div className="flex flex-wrap gap-3">
                {allParticipants.map((p, i) => {
                  const archetype = ARCHETYPES.find((a) => a.id === p.archetype)
                  const isCreator = p.id === hackerHouse.creator.id
                  return (
                    <div key={p.id ?? i} className="flex flex-col items-center gap-1.5">
                      <div
                        className="size-12 rounded-full overflow-hidden border-2 bg-muted flex items-center justify-center"
                        style={
                          archetype
                            ? { borderColor: `var(${archetype.colorVar})` }
                            : { borderColor: "var(--border)" }
                        }
                      >
                        {p.avatar_url ? (
                          <img
                            src={p.avatar_url}
                            alt={p.handle ?? "participant"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-mono text-muted-foreground">
                            {p.handle?.charAt(0)?.toUpperCase() ?? "?"}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground text-center max-w-15 truncate">
                        {isCreator ? "Host" : `@${p.handle ?? "anon"}`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Apply section (non-owner, status=open) */}
          {canApply && (
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
              <SectionLabel>Apply to join</SectionLabel>
              {apply.isSuccess ? (
                <p className="text-sm font-mono text-primary">
                  Application sent! The host will review it.
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
                  Apply to join →
                </Button>
              )}
            </div>
          )}

          {/* Applications manager (owner only) */}
          {isOwner && (
            <section className="flex flex-col gap-4 pt-2">
              <SectionLabel className="border-t border-border pt-4">Applications</SectionLabel>
              <HackerHouseApplicationManager hackerHouseId={id} />
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
              <DetailRow icon={<CalendarDays className="size-3.5" />} label="Dates">
                {formatDateRange(hackerHouse.start_date, hackerHouse.end_date)}
              </DetailRow>
              <DetailRow icon={<Globe className="size-3.5" />} label="Language">
                {hackerHouse.language.join(", ")}
              </DetailRow>
              {hackerHouse.neighborhood && (
                <DetailRow icon={<MapPin className="size-3.5" />} label="Zone">
                  {hackerHouse.neighborhood}
                </DetailRow>
              )}
              <DetailRow icon={<Home className="size-3.5" />} label="Access">
                <span className="capitalize">
                  {hackerHouse.application_type.replace("_", " ")}
                </span>
              </DetailRow>
              {hackerHouse.application_deadline && (
                <DetailRow icon={<CalendarDays className="size-3.5" />} label="Deadline">
                  {new Date(hackerHouse.application_deadline).toLocaleDateString()}
                </DetailRow>
              )}
            </div>
          </div>

          {/* Capacity card */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <SectionLabel>Capacity</SectionLabel>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <span className={cn("font-mono text-sm font-medium", statusCfg.textCls)}>
                  {filledCount}/{hackerHouse.capacity} spots
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {slots.map((_, i) => (
                  <div
                    key={i}
                    className={cn("size-3 rounded-full transition-colors", i < filledCount ? statusCfg.dotCls : "bg-border")}
                  />
                ))}
                {hackerHouse.capacity > 10 && (
                  <span className="text-[10px] font-mono text-muted-foreground ml-1">
                    +{hackerHouse.capacity - 10}
                  </span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PageContainer>
  )
}
