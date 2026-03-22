"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface StepIdentityProps {
  onNext: (handle: string, bio: string) => void
  onBack: () => void
  loading: boolean
  error: string | null
}

export function StepIdentity({ onNext, onBack, loading, error }: StepIdentityProps) {
  const [handle, setHandle] = useState("")
  const [bio, setBio] = useState("")

  const handleError = (() => {
    if (!handle) return null
    if (!/^[a-z0-9_]{3,20}$/.test(handle)) {
      return "3–20 chars. Lowercase letters, numbers, and underscores only."
    }
    return null
  })()

  const canSubmit = handle.length >= 3 && !handleError && !loading

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display font-bold text-foreground text-3xl sm:text-4xl">
          Claim your identity.
        </h1>
        <p className="text-muted-foreground text-lg">
          Your handle is how the protocol knows you.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-md">
        {/* Handle */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Handle *
          </label>
          <div className="flex items-center border border-border rounded-md bg-card focus-within:border-primary transition-colors">
            <span className="pl-4 text-muted-foreground font-mono text-sm select-none">@</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="your_handle"
              maxLength={20}
              className="flex-1 bg-transparent px-2 py-3 text-foreground font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none"
            />
          </div>
          {handleError && (
            <p className="text-xs text-destructive">{handleError}</p>
          )}
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Bio <span className="normal-case">(optional)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="What are you building?"
            maxLength={160}
            rows={3}
            className="bg-card border border-border rounded-md px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">{bio.length}/160</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack} disabled={loading}>
          ← Back
        </Button>
        <Button
          onClick={() => onNext(handle, bio)}
          disabled={!canSubmit}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
        >
          {loading ? "Saving..." : "Enter the Protocol →"}
        </Button>
      </div>
    </div>
  )
}
