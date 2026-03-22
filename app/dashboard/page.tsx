"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useAuthFetch } from "@/hooks/use-auth-fetch"
import { DashboardNavbar } from "./_components/dashboard-navbar"
import { CypherIdentityCard } from "./_components/cypher-identity-card"
import { HackSpacesFeed } from "./_components/hack-spaces-feed"

interface UserProfile {
  id: string
  handle: string | null
  bio: string | null
  archetype: string | null
  skills: string[] | null
  wallet_address: string | null
  email: string | null
  onboarding_step: string | null
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { authFetch } = useAuthFetch()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || !user) {
      router.replace("/")
      return
    }

    authFetch("/api/auth/sync", { method: "POST" })
      .then(() => authFetch("/api/profile"))
      .then((res) => res.json())
      .then((data: { user?: UserProfile }) => {
        if (!data.user || data.user.onboarding_step !== "complete") {
          router.replace("/onboarding")
          return
        }
        setProfile(data.user)
      })
      .catch(console.error)
      .finally(() => setProfileLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated])

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm animate-pulse">
          Loading...
        </p>
      </div>
    )
  }

  if (!profile) return null

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
