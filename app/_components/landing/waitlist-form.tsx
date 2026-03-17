"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface WaitlistFormProps {
  className?: string
}

export function WaitlistForm({ className }: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Enter a valid email address.")
      setStatus("error")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    // TODO: wire up to Supabase waitlist table when credentials are available
    // await supabase.from('waitlist').insert({ email })
    await new Promise((r) => setTimeout(r, 800))

    setStatus("success")
  }

  if (status === "success") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <p className="text-foreground font-medium">
          You&apos;re in.
        </p>
        <p className="text-muted-foreground text-sm">
          We&apos;ll reach out when the protocol is ready to ship. No noise in between.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === "error") setStatus("idle")
          }}
          className="bg-card border-border text-foreground placeholder:text-muted-foreground rounded-lg flex-1 h-11"
          disabled={status === "loading"}
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 px-6 shrink-0"
        >
          {status === "loading" ? "Joining..." : "Join the Waitlist →"}
        </Button>
      </form>

      {status === "error" ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Free forever. No spam. Just early access.
        </p>
      )}
    </div>
  )
}
