"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useProfile, usePatchProfile } from "@/services/api/profile"
import { useImportTalentScore, useImportPoaps } from "@/services/api/integrations"
import { StepArchetype } from "./step-archetype"
import { StepSkills } from "./step-skills"
import { StepAvatar } from "./step-avatar"
import { StepProfile, type ProfileExtras } from "./step-profile"
import { VISIBLE_STEPS } from "@/lib/onboarding"
import type { ArchetypeId, OnboardingStep } from "@/lib/onboarding"
import { useState } from "react"

type WizardStep = Exclude<OnboardingStep, "complete">

function resolveStep(step: string | null): WizardStep {
  const valid: WizardStep[] = ["archetype", "skills", "avatar", "profile"]
  return valid.includes(step as WizardStep) ? (step as WizardStep) : "archetype"
}

export function OnboardingWizard() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const { data: profile, isLoading: profileLoading } = useProfile({
    enabled: isAuthenticated && !isLoading,
  })

  const patchProfile = usePatchProfile()
  const importTalentScore = useImportTalentScore()
  const importPoaps = useImportPoaps()
  const [profileError, setProfileError] = useState<string | null>(null)

  // Auto-import integrations once when wallet is available
  const importedRef = useRef(false)
  useEffect(() => {
    if (importedRef.current) return
    if (!profile?.wallet_address) return
    if (profile.talent_protocol_score !== null && (profile.poaps?.length ?? 0) > 0) return

    importedRef.current = true
    importTalentScore.mutate(undefined)
    importPoaps.mutate(undefined)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.wallet_address])

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) router.replace("/")
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (profile?.onboarding_step === "complete") router.replace("/dashboard")
  }, [profile, router])

  const currentStep = resolveStep(profile?.onboarding_step ?? null)
  const archetype = (profile?.archetype ?? null) as ArchetypeId | null
  const currentIndex = VISIBLE_STEPS.indexOf(currentStep)

  async function handleArchetypeSelect(selected: ArchetypeId) {
    await patchProfile.mutateAsync({ archetype: selected, onboarding_step: "skills" })
  }

  async function handleSkillsNext(skills: string[]) {
    await patchProfile.mutateAsync({ skills, onboarding_step: "avatar" })
  }

  async function handleProfileNext(handle: string, bio: string, extras: ProfileExtras) {
    setProfileError(null)
    try {
      await patchProfile.mutateAsync({
        handle,
        bio: bio || undefined,
        languages: extras.languages.length > 0 ? extras.languages : undefined,
        region: extras.region || undefined,
        country: extras.country || undefined,
        city: extras.city || undefined,
        timezone: extras.timezone || undefined,
        github_url: extras.github_url || undefined,
        twitter_url: extras.twitter_url || undefined,
        onboarding_step: "complete",
      })
      router.push("/home")
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  if (isLoading || profileLoading || !profile || profile.onboarding_step === "complete") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm animate-pulse">
          Loading...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / VISIBLE_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="pt-8 pb-2 px-6 max-w-5xl mx-auto w-full">
        <p className="text-xs font-mono text-muted-foreground">
          Step {currentIndex + 1} / {VISIBLE_STEPS.length}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-5xl">
          {currentStep === "archetype" && (
            <StepArchetype
              onSelect={handleArchetypeSelect}
              loading={patchProfile.isPending}
            />
          )}
          {currentStep === "skills" && archetype && (
            <StepSkills
              archetype={archetype}
              onNext={handleSkillsNext}
              onBack={() => patchProfile.mutate({ onboarding_step: "archetype" })}
              loading={patchProfile.isPending}
            />
          )}
          {currentStep === "avatar" && (
            <StepAvatar
              onBack={() => patchProfile.mutate({ onboarding_step: "skills" })}
            />
          )}
          {currentStep === "profile" && (
            <StepProfile
              onNext={handleProfileNext}
              onBack={() => patchProfile.mutate({ onboarding_step: "avatar" })}
              loading={patchProfile.isPending}
              error={profileError}
            />
          )}
        </div>
      </div>
    </div>
  )
}
