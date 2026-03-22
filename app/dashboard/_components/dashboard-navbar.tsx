"use client"

import Image from "next/image"
import { AuthButton } from "@/components/auth/auth-button"

export function DashboardNavbar() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/hacker-house-protocol-logo.svg"
            alt="Hacker House Protocol"
            width={28}
            height={26}
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
