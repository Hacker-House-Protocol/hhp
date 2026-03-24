"use client"

import { useProfile } from "@/services/api/profile"
import { PageContainer } from "../_components/page-container"
import { ProfileView } from "./_components/profile-view"

function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {children}
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 items-start">
      {/* Left column skeleton */}
      <div className="flex flex-col gap-4">
        {/* Identity */}
        <div
          className="rounded-2xl border p-6 flex flex-col gap-6"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-start gap-5">
            <div className="w-28 h-28 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex flex-col gap-3 pt-1 flex-1">
              <div className="h-2.5 bg-muted rounded w-14 animate-pulse" />
              <div className="h-8 bg-muted rounded-lg w-36 animate-pulse" />
              <div className="h-5 bg-muted rounded w-20 animate-pulse" />
              <div className="h-3 bg-muted rounded w-28 animate-pulse" />
            </div>
          </div>
          <div
            className="border-t pt-4 flex flex-col gap-2"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="h-3.5 bg-muted rounded w-full animate-pulse" />
            <div className="h-3.5 bg-muted rounded w-3/4 animate-pulse" />
          </div>
        </div>

        {/* Location */}
        <SkeletonCard>
          <div className="h-2.5 bg-muted rounded w-20 animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
          <div className="flex gap-1.5">
            {[48, 56, 44].map((w, i) => (
              <div
                key={i}
                className="h-5 bg-muted rounded-md animate-pulse"
                style={{ width: w }}
              />
            ))}
          </div>
        </SkeletonCard>

        {/* Links */}
        <SkeletonCard>
          <div className="h-2.5 bg-muted rounded w-12 animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 bg-muted rounded w-full animate-pulse"
            />
          ))}
        </SkeletonCard>
      </div>

      {/* Right column skeleton */}
      <div className="flex flex-col gap-4">
        {/* Skills */}
        <SkeletonCard>
          <div className="h-2.5 bg-muted rounded w-12 animate-pulse" />
          <div className="flex gap-2 flex-wrap">
            {[80, 60, 110, 70, 55, 90].map((w, i) => (
              <div
                key={i}
                className="h-6 bg-muted rounded-md animate-pulse"
                style={{ width: w }}
              />
            ))}
          </div>
        </SkeletonCard>

        {/* On-chain */}
        <SkeletonCard>
          <div className="h-2.5 bg-muted rounded w-16 animate-pulse" />
          <div
            className="rounded-xl border p-5"
            style={{ background: "var(--muted)", borderColor: "var(--border)" }}
          >
            <div className="h-2.5 bg-muted/80 rounded w-40 animate-pulse mb-3" />
            <div className="h-20 bg-muted/80 rounded w-24 animate-pulse" />
          </div>
        </SkeletonCard>

        {/* Hack Spaces */}
        <SkeletonCard>
          <div className="h-2.5 bg-muted rounded w-24 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-muted border border-border rounded-lg h-32 animate-pulse"
              />
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  )
}

export default function PerfilPage() {
  const { data: profile, isLoading } = useProfile()

  return (
    <PageContainer>
      {isLoading ? (
        <ProfileSkeleton />
      ) : profile ? (
        <ProfileView profile={profile} isOwner={true} />
      ) : (
        <p className="text-muted-foreground font-mono text-sm">
          Profile not found.
        </p>
      )}
    </PageContainer>
  )
}
