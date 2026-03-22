"use client"

import { ARCHETYPES } from "@/lib/onboarding"

interface UserProfile {
  handle: string | null
  bio: string | null
  archetype: string | null
  skills: string[] | null
  wallet_address: string | null
  email: string | null
}

interface CypherIdentityCardProps {
  profile: UserProfile
}

export function CypherIdentityCard({ profile }: CypherIdentityCardProps) {
  const archetypeData = ARCHETYPES.find((a) => a.id === profile.archetype)

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Cypher Identity
          </p>
          <h2 className="font-display font-bold text-foreground text-xl">
            @{profile.handle ?? "—"}
          </h2>
        </div>
        {archetypeData && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-mono"
            style={{
              borderColor: `var(${archetypeData.colorVar})`,
              color: `var(${archetypeData.colorVar})`,
              backgroundColor: `color-mix(in oklch, var(${archetypeData.colorVar}) 10%, transparent)`,
            }}
          >
            <span>{archetypeData.emoji}</span>
            <span>{archetypeData.name}</span>
          </div>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {profile.bio}
        </p>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-2.5 py-1 rounded-sm border border-border text-muted-foreground font-mono"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Credentials */}
      <div className="flex flex-col gap-2 pt-1 border-t border-border">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Credentials
        </p>
        <div className="flex flex-col gap-1">
          {profile.wallet_address && (
            <p className="text-xs font-mono text-muted-foreground">
              <span className="text-foreground">wallet</span>{" "}
              {profile.wallet_address.slice(0, 6)}…{profile.wallet_address.slice(-4)}
            </p>
          )}
          {profile.email && (
            <p className="text-xs font-mono text-muted-foreground">
              <span className="text-foreground">email</span>{" "}
              {profile.email}
            </p>
          )}
        </div>
      </div>

      {/* On-chain — placeholder */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-sm border border-dashed border-border text-xs font-mono text-muted-foreground/50"
      >
        <span>⛓</span>
        <span>On-chain credentials — coming soon</span>
      </div>
    </div>
  )
}
