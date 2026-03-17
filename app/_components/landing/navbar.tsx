"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })
  }

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

        <Button
          size="sm"
          onClick={scrollToWaitlist}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5"
        >
          Join the Waitlist
        </Button>
      </nav>
    </header>
  )
}
