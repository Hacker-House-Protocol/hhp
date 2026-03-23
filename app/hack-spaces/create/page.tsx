"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { CreateHackSpaceForm } from "./_components/create-hack-space-form"

export default function CreateHackSpacePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/")
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm animate-pulse">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground transition-colors font-mono text-sm"
          >
            ← Back
          </button>
          <span className="text-border">|</span>
          <h1 className="font-display font-bold text-foreground">Create Hack Space</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <CreateHackSpaceForm />
      </main>
    </div>
  )
}
