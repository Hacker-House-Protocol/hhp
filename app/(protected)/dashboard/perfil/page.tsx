"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

export default function PerfilPage() {
  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <SidebarTrigger />
        <h1 className="font-display font-bold text-sm text-foreground">Mi Perfil</h1>
      </header>
      <main className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <p className="text-muted-foreground font-mono text-sm">Coming soon</p>
      </main>
    </>
  )
}
