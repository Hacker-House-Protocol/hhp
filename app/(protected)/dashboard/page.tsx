"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useProfile, syncAndGetProfile } from "@/services/api/profile"
import { queryKeys } from "@/lib/query-keys"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LoadingScreen } from "@/components/loading-screen"
import { CypherIdentityCard } from "./_components/cypher-identity-card"
import { HackSpacesFeed } from "./_components/hack-spaces-feed"

export default function DashboardPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    syncAndGetProfile()
      .then((data) => {
        queryClient.setQueryData([queryKeys.profile], data)
        setSynced(true)
      })
      .catch(console.error)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data: profile } = useProfile({ enabled: synced })

  useEffect(() => {
    if (!synced || !profile) return
    if (profile.onboarding_step !== "complete") router.replace("/onboarding")
  }, [synced, profile, router])

  if (!synced || !profile || profile.onboarding_step !== "complete") {
    return <LoadingScreen message="Syncing" />
  }

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <SidebarTrigger />
        <span className="font-display font-bold text-sm text-foreground">Dashboard</span>
      </header>
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
    </>
  )
}
