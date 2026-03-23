"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth/auth-button"
import { useAuth } from "@/hooks/use-auth"

export function HeroCta() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (isAuthenticated) {
    return (
      <Button
        asChild
        className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 px-8 text-base w-fit"
      >
        <Link href="/dashboard">Go to Dashboard →</Link>
      </Button>
    )
  }

  return (
    <AuthButton className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 px-8 text-base w-fit" />
  )
}
