"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/use-auth"
import { useProfile, syncAndGetProfile } from "@/services/api/profile"
import { queryKeys } from "@/lib/query-keys"
import { DashboardNavbar } from "./_components/dashboard-navbar"
import { CypherIdentityCard } from "./_components/cypher-identity-card"
import { HackSpacesFeed } from "./_components/hack-spaces-feed"

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.replace("/")
      return
    }
    syncAndGetProfile()
      .then((data) => {
        queryClient.setQueryData([queryKeys.profile], data)
        setSynced(true)
      })
      .catch(console.error)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated])

  const { data: profile } = useProfile({ enabled: synced })

  useEffect(() => {
    if (!synced || !profile) return
    if (profile.onboarding_step !== "complete") router.replace("/onboarding")
  }, [synced, profile, router])

  if (isLoading || !synced || !profile || profile.onboarding_step !== "complete") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm animate-pulse">
          Loading...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          <aside>
            <CypherIdentityCard profile={profile} />
          </aside>
          <section>
            <HackSpacesFeed currentUserId={profile.id} />
          </section>
        </div>
      </main>
    </div>
  )
}
