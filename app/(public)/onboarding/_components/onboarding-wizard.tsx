"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useProfile, usePatchProfile } from "@/services/api/profile"
import { StepArchetype } from "./step-archetype"
import { StepSkills } from "./step-skills"
import { StepIdentity } from "./step-identity"
import type { ArchetypeId } from "@/lib/onboarding"

const STEPS = ["archetype", "skills", "identity"] as const
type WizardStep = (typeof STEPS)[number]

export function OnboardingWizard() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const { data: profile, isLoading: profileLoading } = useProfile({
    enabled: isAuthenticated && !isLoading,
  })

  const patchProfile = usePatchProfile()
  const [identityError, setIdentityError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) router.replace("/")
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (profile?.onboarding_step === "complete") router.replace("/dashboard")
  }, [profile, router])

  // Derived — no setState needed
  const currentStep: WizardStep =
    profile?.onboarding_step === "identity"
      ? "identity"
      : profile?.onboarding_step === "skills"
        ? "skills"
        : "archetype"

  const archetype = (profile?.archetype ?? null) as ArchetypeId | null
  const currentIndex = STEPS.indexOf(currentStep)

  async function handleArchetypeSelect(selected: ArchetypeId) {
    await patchProfile.mutateAsync({ archetype: selected, onboarding_step: "skills" })
  }

  async function handleSkillsNext(skills: string[]) {
    await patchProfile.mutateAsync({ skills, onboarding_step: "identity" })
  }

  async function handleIdentityNext(handle: string, bio: string) {
    setIdentityError(null)
    try {
      await patchProfile.mutateAsync({
        handle,
        bio: bio || undefined,
        onboarding_step: "complete",
      })
      router.replace("/dashboard")
    } catch (err) {
      setIdentityError(err instanceof Error ? err.message : "Something went wrong")
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
          style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="pt-8 pb-2 px-6 max-w-5xl mx-auto w-full">
        <p className="text-xs font-mono text-muted-foreground">
          Step {currentIndex + 1} / {STEPS.length}
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
          {currentStep === "identity" && (
            <StepIdentity
              onNext={handleIdentityNext}
              onBack={() => patchProfile.mutate({ onboarding_step: "skills" })}
              loading={patchProfile.isPending}
              error={identityError}
            />
          )}
        </div>
      </div>
    </div>
  )
}
