"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useImportTalentScore, useImportPoaps } from "@/services/api/integrations"
import { PoapCard } from "./poap-card"
import { ProfileTags } from "./profile-tags"
import type { UserProfile } from "@/lib/types"

interface ProfileOnchainProps {
  profile: UserProfile
}

export function ProfileOnchain({ profile }: ProfileOnchainProps) {
  const [isImporting, setIsImporting] = useState(false)
  const importTalentScore = useImportTalentScore()
  const importPoaps = useImportPoaps()

  async function handleReimport() {
    setIsImporting(true)
    await Promise.allSettled([
      importTalentScore.mutateAsync(undefined),
      importPoaps.mutateAsync(undefined),
    ])
    setIsImporting(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
          On-chain
        </p>
        {profile.wallet_address && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReimport}
            disabled={isImporting}
            className="rounded-lg font-mono text-xs h-7"
          >
            {isImporting ? (
              <>
                <Spinner className="mr-1.5 size-3" /> Importing...
              </>
            ) : (
              "Sync"
            )}
          </Button>
        )}
      </div>

      {/* Builder Score */}
      <div
        className="rounded-xl border p-5 relative overflow-hidden"
        style={{ background: "var(--muted)", borderColor: "var(--border)" }}
      >
        {/* Subtle background glow behind score */}
        <div
          className="absolute -top-6 -left-6 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none"
          style={{ background: "var(--primary)" }}
        />

        <div className="relative flex flex-col gap-1">
          <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.18em]">
            Builder Score · Talent Protocol
          </p>
          {profile.talent_protocol_score !== null ? (
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className="font-display font-bold leading-none"
                style={{ fontSize: "clamp(3.5rem, 10vw, 5.5rem)", color: "var(--primary)" }}
              >
                {profile.talent_protocol_score}
              </span>
              <span className="text-xs font-mono text-muted-foreground/40 mb-1">pts</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/50 italic mt-1">
              {profile.wallet_address
                ? "No score found."
                : "Connect a wallet to import your Builder Score."}
            </p>
          )}
          <p className="text-xs text-muted-foreground/60 font-mono">Used for team matching</p>
        </div>
      </div>

      {/* Verified Tags */}
      <ProfileTags tags={profile.talent_tags} />

      {/* POAP Gallery */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
          POAPs — Achievement Wall
        </p>
        {profile.poaps && profile.poaps.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {profile.poaps.map((poap) => (
              <PoapCard key={poap.id} poap={poap} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/40 italic">
            {profile.wallet_address
              ? "No POAPs found on this wallet."
              : "Connect a wallet to see your POAP collection."}
          </p>
        )}
      </div>
    </div>
  )
}
