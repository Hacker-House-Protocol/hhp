"use client"

import Link from "next/link"
import { useSuggestedBuilders } from "@/services/api/profile"
import { useProfile } from "@/services/api/profile"
import { BuilderCard } from "./builder-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const PREVIEW_LIMIT = 6

export function SuggestedBuildersFeed() {
  const { data: profile } = useProfile()
  const { data: builders, isLoading } = useSuggestedBuilders()
  const unique = (builders ?? []).filter(
    (b, i, arr) => arr.findIndex((x) => x.id === b.id) === i,
  )
  const preview = unique.slice(0, PREVIEW_LIMIT)

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-foreground text-lg">Suggested Builders</h2>
        {unique.length > 0 && (
          <Link
            href="/dashboard/builders"
            className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            View all →
          </Link>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <ScrollArea>
          <div className="flex gap-3 pb-3 w-max">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[70vw] sm:w-[35vw] lg:w-[22vw] shrink-0">
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-3 h-[240px]">
                  <Skeleton className="size-16 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16 rounded-sm" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : preview.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-lg p-8 flex items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">
            Complete your profile to get builder suggestions
          </p>
        </div>
      ) : (
        <ScrollArea>
          <div className="flex gap-3 pb-3 w-max">
            {preview.map((builder) => (
              <div key={builder.id} className="w-[70vw] sm:w-[35vw] lg:w-[22vw] shrink-0">
                <BuilderCard builder={builder} currentUserId={profile?.id} showMatchInfo />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  )
}
