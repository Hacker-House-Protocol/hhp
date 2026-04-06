"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { Bell } from "lucide-react"
import { NotificationBadge } from "../_components/notification-badge"
import { useProfile, syncAndGetProfile } from "@/services/api/profile"
import { queryKeys } from "@/lib/query-keys"
import { LoadingScreen } from "@/components/loading-screen"
import { CypherIdentityCard } from "./_components/cypher-identity-card"
import { HackSpacesFeed } from "./_components/hack-spaces-feed"
import { PageContainer } from "./_components/page-container"

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
    <PageContainer>
      {/* Mobile-only top bar: logo centered, bell top-right */}
      <div className="md:hidden relative flex items-center justify-center mb-6 h-10">
        <img
          src="/assets/hacker-house-protocol-logo.svg"
          alt="Hacker House Protocol"
          className="h-8 w-8"
        />
        <Link
          href="/dashboard/notifications"
          aria-label="Notifications"
          className="absolute right-0 flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="relative">
            <Bell className="size-5" />
            <NotificationBadge variant="absolute" />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        <aside>
          <CypherIdentityCard profile={profile} />
        </aside>
        <section>
          <HackSpacesFeed currentUserId={profile.id} />
        </section>
      </div>
    </PageContainer>
  )
}
