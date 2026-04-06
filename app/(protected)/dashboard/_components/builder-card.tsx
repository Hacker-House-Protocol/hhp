"use client"

import Link from "next/link"
import { ARCHETYPES } from "@/lib/onboarding"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import { ConnectButton } from "./connect-button"
import type { UserProfile, SuggestedBuilder } from "@/lib/types"
import type { VariantProps } from "class-variance-authority"

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

const ARCHETYPE_BADGE_VARIANT: Record<string, BadgeVariant> = {
  visionary: "visionary-outline",
  strategist: "strategist-outline",
  builder: "builder-outline",
}

function isSuggestedBuilder(
  builder: UserProfile | SuggestedBuilder,
): builder is SuggestedBuilder {
  return "match_score" in builder
}

interface BuilderCardProps {
  builder: UserProfile | SuggestedBuilder
  currentUserId?: string
  showMatchInfo?: boolean
}

export function BuilderCard({
  builder,
  currentUserId,
  showMatchInfo = false,
}: BuilderCardProps) {
  const archetype = ARCHETYPES.find((a) => a.id === builder.archetype)
  const skills = builder.skills ?? []
  const visibleSkills = skills.slice(0, 3)
  const extraSkills = skills.length - 3
  const talentTags = builder.talent_tags ?? []
  const visibleTags = talentTags.slice(0, 2)

  const displayName = builder.handle
    ? `@${builder.handle}`
    : builder.wallet_address
      ? `${builder.wallet_address.slice(0, 6)}...${builder.wallet_address.slice(-4)}`
      : "Anonymous Builder"

  const href = builder.handle
    ? `/dashboard/builders/${builder.handle}`
    : undefined

  const isOwnCard = currentUserId === builder.id

  const cardContent = (
    <div className="flex flex-col items-center gap-3 p-5 flex-1">
      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-full overflow-hidden border-2 shrink-0"
        style={{
          borderColor: archetype
            ? `var(${archetype.colorVar})`
            : "var(--border)",
        }}
      >
        {builder.avatar_url ? (
          <img
            src={builder.avatar_url}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: archetype
                ? `color-mix(in oklch, var(${archetype.colorVar}) 20%, transparent)`
                : "var(--muted)",
            }}
          />
        )}
      </div>

      {/* Handle */}
      <p className="font-mono text-sm text-foreground truncate max-w-full">
        {displayName}
      </p>

      {/* Archetype badge */}
      {archetype && (
        <Badge
          variant={ARCHETYPE_BADGE_VARIANT[archetype.id] ?? "outline"}
          className="font-mono rounded-sm text-[10px]"
        >
          {archetype.label}
        </Badge>
      )}

      {/* Bio */}
      {builder.bio && (
        <p className="text-xs text-muted-foreground text-center line-clamp-2 leading-relaxed">
          {builder.bio}
        </p>
      )}

      {/* Skills */}
      {visibleSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {visibleSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="font-mono text-[10px] rounded-sm"
            >
              {skill}
            </Badge>
          ))}
          {extraSkills > 0 && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] rounded-sm text-muted-foreground"
            >
              +{extraSkills}
            </Badge>
          )}
        </div>
      )}

      {/* Talent Tags */}
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {visibleTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="font-mono text-[10px] rounded-sm text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Match info for suggested builders */}
      {showMatchInfo && isSuggestedBuilder(builder) && (
        <div className="flex flex-col items-center gap-1 mt-auto pt-2">
          <span className="text-[10px] font-mono text-primary">
            {Math.round(builder.match_score)}% match
          </span>
          {builder.match_reasons.length > 0 && (
            <p className="text-[10px] text-muted-foreground text-center line-clamp-1">
              {builder.match_reasons[0]}
            </p>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-primary/30 transition-all duration-200">
      {href ? (
        <Link href={href} className="flex flex-col flex-1">
          {cardContent}
        </Link>
      ) : (
        <div className="flex flex-col flex-1">{cardContent}</div>
      )}

      {/* Connect button outside the link to prevent navigation */}
      {!isOwnCard && (
        <div className="px-5 pb-4 flex justify-center border-t border-border pt-3">
          <ConnectButton targetUserId={builder.id} />
        </div>
      )}
    </div>
  )
}
