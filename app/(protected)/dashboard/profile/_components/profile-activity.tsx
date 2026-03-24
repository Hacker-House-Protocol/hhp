"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useMyHackSpaces } from "@/services/api/hack-spaces"
import { HackSpaceCard } from "../../_components/hack-space-card"
import type { UserProfile } from "@/lib/types"

interface ProfileActivityProps {
  profile: UserProfile
  isOwner: boolean
}

export function ProfileActivity({ profile, isOwner }: ProfileActivityProps) {
  const { data: hackSpaces = [], isLoading } = useMyHackSpaces(profile.id)

  return (
    <div className="flex flex-col gap-6">
      {/* Hack Spaces */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
            Hack Spaces
          </p>
          {isOwner && (
            <Link href="/dashboard/hack-spaces/create">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="font-mono text-xs h-7 text-muted-foreground hover:text-foreground"
              >
                + Create
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg h-36 animate-pulse" />
            ))}
          </div>
        ) : hackSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hackSpaces.map((hs) => (
              <HackSpaceCard key={hs.id} hackSpace={hs} currentUserId={profile.id} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl border border-dashed p-8 flex flex-col items-center gap-3 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm text-muted-foreground">No active Hack Spaces.</p>
            {isOwner && (
              <Link href="/dashboard/hack-spaces/create">
                <Button type="button" size="sm" variant="outline" className="font-mono rounded-lg text-xs">
                  Create one →
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Hacker Houses — not yet implemented */}
      {/* TODO: add Hacker Houses activity section once the feature is built */}
    </div>
  )
}
