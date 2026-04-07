"use client"

import Link from "next/link"
import { useFilteredHackerHouses } from "@/services/api/hacker-houses"
import { HackerHouseCard } from "./hacker-house-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const PREVIEW_LIMIT = 6

interface HackerHousesFeedProps {
  currentUserId: string | null
}

export function HackerHousesFeed({ currentUserId }: HackerHousesFeedProps) {
  const { data, isLoading } = useFilteredHackerHouses({})
  const hackerHouses = data?.pages.flatMap((p) => p.hacker_houses) ?? []
  const total = data?.pages[0]?.total ?? 0
  const preview = hackerHouses.slice(0, PREVIEW_LIMIT)

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-foreground text-lg">Hacker Houses</h2>
          {!isLoading && total > 0 && (
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
              {total}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hackerHouses.length > 0 && (
            <Link
              href="/dashboard/hacker-houses"
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              View all →
            </Link>
          )}
          <Link href="/dashboard/hacker-houses/create">
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 text-xs"
            >
              + Create
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <ScrollArea>
          <div className="flex gap-3 pb-3 w-max items-stretch">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[85vw] sm:w-[45vw] lg:w-[30vw] shrink-0">
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 h-[180px]">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : hackerHouses.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-lg p-12 flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col gap-1">
            <p className="font-display font-semibold text-foreground">No Hacker Houses yet.</p>
            <p className="text-muted-foreground text-sm">
              Be the first to host a Hacker House and bring builders together.
            </p>
          </div>
          <Link href="/dashboard/hacker-houses/create">
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5 mt-2"
            >
              Create the first House →
            </Button>
          </Link>
        </div>
      ) : (
        <ScrollArea>
          <div className="flex gap-3 pb-3 w-max items-stretch">
            {preview.map((hh) => (
              <div key={hh.id} className="w-[85vw] sm:w-[45vw] lg:w-[30vw] shrink-0">
                <HackerHouseCard hackerHouse={hh} currentUserId={currentUserId} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  )
}
