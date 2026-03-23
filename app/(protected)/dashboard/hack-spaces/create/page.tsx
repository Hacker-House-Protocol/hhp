"use client"

import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CreateHackSpaceForm } from "./_components/create-hack-space-form"

export default function CreateHackSpacePage() {
  const router = useRouter()

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <SidebarTrigger />
        <button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground transition-colors font-mono text-sm"
        >
          ← Back
        </button>
        <span className="text-border">|</span>
        <h1 className="font-display font-bold text-foreground text-sm">Create Hack Space</h1>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <CreateHackSpaceForm />
      </main>
    </>
  )
}
