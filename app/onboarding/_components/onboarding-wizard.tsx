"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useAuthFetch } from "@/hooks/use-auth-fetch"
import { StepArchetype } from "./step-archetype"
import { StepSkills } from "./step-skills"
import { StepIdentity } from "./step-identity"
import type { ArchetypeId, OnboardingStep } from "@/lib/onboarding"

const STEPS = ["archetype", "skills", "identity"] as const
type WizardStep = (typeof STEPS)[number]

function stepToIndex(step: WizardStep): number {
  return STEPS.indexOf(step)
}

interface ProfileData {
  onboarding_step: OnboardingStep | null
  archetype: ArchetypeId | null
}

export function OnboardingWizard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { authFetch } = useAuthFetch()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<WizardStep>("archetype")
  const [archetype, setArchetype] = useState<ArchetypeId | null>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [identityError, setIdentityError] = useState<string | null>(null)

  // On mount: check auth + load current step from profile
  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || !user) {
      router.replace("/")
      return
    }

    authFetch("/api/profile")
      .then((res) => res.json())
      .then((data: { user?: ProfileData }) => {
        const profile = data.user
        if (!profile) return

        if (profile.onboarding_step === "complete") {
          router.replace("/dashboard")
          return
        }

        if (profile.archetype) setArchetype(profile.archetype)

        if (profile.onboarding_step === "skills") setCurrentStep("skills")
        else if (profile.onboarding_step === "identity") setCurrentStep("identity")
        else setCurrentStep("archetype")

        setReady(true)
      })
      .catch(() => setReady(true))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated])

  const currentIndex = stepToIndex(currentStep)

  async function patch(payload: Record<string, unknown>) {
    const res = await authFetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json() as { message: string }
      throw new Error(data.message ?? "Something went wrong")
    }
    return res.json()
  }

  async function handleArchetypeSelect(selected: ArchetypeId) {
    setLoading(true)
    try {
      await patch({ archetype: selected, onboarding_step: "archetype" satisfies OnboardingStep })
      setArchetype(selected)
      setCurrentStep("skills")
    } finally {
      setLoading(false)
    }
  }

  async function handleSkillsNext(skills: string[]) {
    setLoading(true)
    try {
      await patch({ skills, onboarding_step: "skills" satisfies OnboardingStep })
      setCurrentStep("identity")
    } finally {
      setLoading(false)
    }
  }

  async function handleIdentityNext(handle: string, bio: string) {
    setIdentityError(null)
    setLoading(true)
    try {
      await patch({
        handle,
        bio: bio || undefined,
        onboarding_step: "complete" satisfies OnboardingStep,
      })
      router.replace("/dashboard")
    } catch (err) {
      setIdentityError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !ready) {
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
            <StepArchetype onSelect={handleArchetypeSelect} loading={loading} />
          )}
          {currentStep === "skills" && archetype && (
            <StepSkills
              archetype={archetype}
              onNext={handleSkillsNext}
              onBack={() => setCurrentStep("archetype")}
              loading={loading}
            />
          )}
          {currentStep === "identity" && (
            <StepIdentity
              onNext={handleIdentityNext}
              onBack={() => setCurrentStep("skills")}
              loading={loading}
              error={identityError}
            />
          )}
        </div>
      </div>
    </div>
  )
}
