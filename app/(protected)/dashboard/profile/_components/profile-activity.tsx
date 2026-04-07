"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useMyHackSpaces } from "@/services/api/hack-spaces"
import { useMyHackerHouses } from "@/services/api/hacker-houses"
import { HackSpaceCard } from "../../_components/hack-space-card"
import { HackerHouseCard } from "../../_components/hacker-house-card"
import type { UserProfile } from "@/lib/types"

interface ProfileActivityProps {
  profile: UserProfile
  isOwner: boolean
}

export function ProfileActivity({ profile, isOwner }: ProfileActivityProps) {
  const { data: hackSpaces = [], isLoading } = useMyHackSpaces(profile.id)
  const { data: hackerHouses = [], isLoading: isLoadingHouses } = useMyHackerHouses(profile.id)

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
              <div key={i} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="size-11 rounded-lg" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
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

      {/* Hacker Houses */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
            Hacker Houses
          </p>
          {isOwner && (
            <Link href="/dashboard/hacker-houses/create">
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

        {isLoadingHouses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="size-11 rounded-lg" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : hackerHouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hackerHouses.map((hh) => (
              <HackerHouseCard key={hh.id} hackerHouse={hh} currentUserId={profile.id} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl border border-dashed p-8 flex flex-col items-center gap-3 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm text-muted-foreground">No active Hacker Houses.</p>
            {isOwner && (
              <Link href="/dashboard/hacker-houses/create">
                <Button type="button" size="sm" variant="outline" className="font-mono rounded-lg text-xs">
                  Create one →
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
