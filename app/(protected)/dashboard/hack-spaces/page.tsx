"use client"

import { useState } from "react"
import Link from "next/link"
import { useHackSpaces } from "@/services/api/hack-spaces"
import { HackSpaceCard } from "../_components/hack-space-card"
import { useProfile } from "@/services/api/profile"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
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
    <>
      <header className="flex h-14 items-center gap-3 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <SidebarTrigger />
        <h1 className="font-display font-bold text-sm text-foreground">Hack Spaces</h1>
        <div className="ml-auto">
          <Link href="/dashboard/hack-spaces/create">
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 text-xs"
            >
              + Create Space
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTrack(null)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-sm border font-mono transition-all cursor-pointer",
                selectedTrack === null
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              All tracks
            </button>
            {TRACKS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTrack(selectedTrack === t ? null : t)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-sm border font-mono transition-all cursor-pointer",
                  selectedTrack === t
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {TRACK_EMOJIS[t]} {t}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {(["open", "full", "in_progress"] as HackSpaceStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(selectedStatus === s ? null : s)}
                className={cn(
                  "text-xs px-3 py-1 rounded-sm border font-mono transition-all cursor-pointer",
                  selectedStatus === s
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 h-48 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-lg p-16 flex flex-col items-center gap-4 text-center">
            <span className="text-4xl">🔗</span>
            <div className="flex flex-col gap-1">
              <p className="font-display font-semibold text-foreground">No Hack Spaces found.</p>
              <p className="text-muted-foreground text-sm">
                {selectedTrack || selectedStatus ? "Try clearing filters." : "Be the first to create one."}
              </p>
            </div>
            {!selectedTrack && !selectedStatus && (
              <Link href="/dashboard/hack-spaces/create">
                <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5 mt-2">
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
      </main>
    </>
  )
}
