"use client"

import { useState } from "react"
import Link from "next/link"
import { useHackSpaces } from "@/services/api/hack-spaces"
import { HackSpaceCard } from "../_components/hack-space-card"
import { useProfile } from "@/services/api/profile"
import { Button } from "@/components/ui/button"
import { PageContainer } from "../_components/page-container"
import { cn } from "@/lib/utils"
import type { HackSpaceTrack, HackSpaceStatus } from "@/lib/types"

const TRACKS = ["DeFi", "DAO tools", "AI", "Social", "Gaming", "NFTs", "Infrastructure", "Other"] as const
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

const STATUS_OPTIONS: { value: HackSpaceStatus; label: string; colorVar: string }[] = [
  { value: "open", label: "Open", colorVar: "--primary" },
  { value: "full", label: "Full", colorVar: "--builder-archetype" },
  { value: "in_progress", label: "In progress", colorVar: "--strategist" },
]

export default function HackSpacesPage() {
  const { data: hackSpaces = [], isLoading } = useHackSpaces()
  const { data: profile } = useProfile({ enabled: true })
  const [selectedTrack, setSelectedTrack] = useState<HackSpaceTrack | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<HackSpaceStatus | null>(null)

  const filtered = hackSpaces.filter((hs) => {
    if (selectedTrack && hs.track !== selectedTrack) return false
    if (selectedStatus && hs.status !== selectedStatus) return false
    return true
  })

  return (
    <PageContainer className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display font-bold text-foreground text-2xl">Hack Spaces</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${filtered.length} space${filtered.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
        <Link href="/dashboard/hack-spaces/create">
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5">
            + Create Space
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        {/* Track filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedTrack(null)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border font-mono transition-all cursor-pointer whitespace-nowrap shrink-0",
              selectedTrack === null
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            All tracks
          </button>
          {TRACKS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrack(selectedTrack === t ? null : t)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border font-mono transition-all cursor-pointer whitespace-nowrap shrink-0",
                selectedTrack === t
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {TRACK_EMOJIS[t]} {t}
            </button>
          ))}
        </div>

        {/* Status filters */}
        <div className="flex gap-2">
          {STATUS_OPTIONS.map(({ value, label, colorVar }) => (
            <button
              key={value}
              onClick={() => setSelectedStatus(selectedStatus === value ? null : value)}
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-mono transition-all cursor-pointer whitespace-nowrap",
                selectedStatus === value
                  ? "border-current"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
              )}
              style={
                selectedStatus === value
                  ? {
                      color: `var(${colorVar})`,
                      backgroundColor: `color-mix(in oklch, var(${colorVar}) 10%, transparent)`,
                    }
                  : undefined
              }
            >
              <span
                className="size-1.5 rounded-full shrink-0"
                style={{ background: `var(${colorVar})` }}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl h-56 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-16 flex flex-col items-center gap-4 text-center">
          <span className="text-4xl">🔗</span>
          <div className="flex flex-col gap-1">
            <p className="font-display font-semibold text-foreground">No Hack Spaces found.</p>
            <p className="text-muted-foreground text-sm">
              {selectedTrack || selectedStatus ? "Try clearing filters." : "Be the first to create one."}
            </p>
          </div>
          {!selectedTrack && !selectedStatus && (
            <Link href="/dashboard/hack-spaces/create">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5 mt-2">
                Create the first Space →
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((hs) => (
            <HackSpaceCard
              key={hs.id}
              hackSpace={hs}
              currentUserId={profile?.id ?? null}
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
