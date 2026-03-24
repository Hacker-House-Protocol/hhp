"use client"

import Link from "next/link"
import { useFilteredHackSpaces } from "@/services/api/hack-spaces"
import { HackSpaceCard } from "./hack-space-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const PREVIEW_LIMIT = 3

interface HackSpacesFeedProps {
  currentUserId: string | null
}

export function HackSpacesFeed({ currentUserId }: HackSpacesFeedProps) {
  const { data, isLoading } = useFilteredHackSpaces({})
  const hackSpaces = data?.pages.flatMap((p) => p.hack_spaces) ?? []
  const total = data?.pages[0]?.total ?? 0
  const preview = hackSpaces.slice(0, PREVIEW_LIMIT)
  const hasMore = total > PREVIEW_LIMIT

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-foreground text-lg">Hack Spaces</h2>
          {!isLoading && total > 0 && (
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
              {total}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hackSpaces.length > 0 && (
            <Link
              href="/dashboard/hack-spaces"
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              View all →
            </Link>
          )}
          <Link href="/dashboard/hack-spaces/create">
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
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
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
      ) : hackSpaces.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-lg p-12 flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col gap-1">
            <p className="font-display font-semibold text-foreground">No Hack Spaces yet.</p>
            <p className="text-muted-foreground text-sm">
              Be the first to post a project and find your builders.
            </p>
          </div>
          <Link href="/dashboard/hack-spaces/create">
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5 mt-2"
            >
              Create the first Space →
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {preview.map((hs) => (
              <HackSpaceCard key={hs.id} hackSpace={hs} currentUserId={currentUserId} />
            ))}
          </div>

          {/* View all CTA */}
          {hasMore && (
            <Link href="/dashboard/hack-spaces">
              <div className="border border-dashed border-border rounded-lg px-5 py-4 flex items-center justify-between hover:border-primary/40 hover:bg-accent/30 transition-all group">
                <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                  +{total - PREVIEW_LIMIT} more Hack Spaces
                </span>
                <span className="text-xs font-mono text-primary">
                  Browse all →
                </span>
              </div>
            </Link>
          )}

          {!hasMore && (
            <Link href="/dashboard/hack-spaces">
              <div className="border border-dashed border-border rounded-lg px-5 py-3 flex items-center justify-center hover:border-primary/40 hover:bg-accent/30 transition-all">
                <span className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
                  Browse all Hack Spaces →
                </span>
              </div>
            </Link>
          )}
        </>
      )}
    </div>
  )
}
