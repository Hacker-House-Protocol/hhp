"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { NotificationBadge } from "../_components/notification-badge"
import { useProfile } from "@/services/api/profile"
import { LoadingScreen } from "@/components/loading-screen"
import { CypherIdentityCard } from "./_components/cypher-identity-card"
import { HackSpacesFeed } from "./_components/hack-spaces-feed"
import { PageContainer } from "./_components/page-container"

export default function DashboardPage() {
  const { data: profile } = useProfile()

  if (!profile) {
    return <LoadingScreen message="Loading" />
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
