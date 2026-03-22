"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { AuthButton } from "@/components/auth/auth-button"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/hacker-house-protocol-logo.svg"
            alt="Hacker House Protocol"
            width={36}
            height={34}
            className="shrink-0"
          />
          <span className="font-display font-bold text-foreground text-sm tracking-tight hidden sm:block">
            Hacker House Protocol
          </span>
        </div>

        <AuthButton />
      </nav>
    </header>
  )
}
