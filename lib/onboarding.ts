// Single source of truth for archetype IDs — import this in Zod schemas
export const ARCHETYPE_IDS = ["visionary", "strategist", "builder"] as const

export const ARCHETYPES = [
  {
    id: "visionary" as const,
    name: "The Visionary",
    label: "Visionary",
    tagline: "You have the idea. The vision is clear — the team isn't.",
    body: "You define direction, generate narrative, and attract talent. You need builders who can execute on what you see.",
    colorVar: "--visionary",
  },
  {
    id: "strategist" as const,
    name: "The Strategist",
    label: "Strategist",
    tagline: "You see the whole board. You connect the pieces.",
    body: "GTM, ops, partnerships, execution. You turn chaos into roadmap. You need a Visionary's idea and a Builder's hands.",
    colorVar: "--strategist",
  },
  {
    id: "builder" as const,
    name: "The Builder",
    label: "Builder",
    tagline: "You ship. That's it. That's the whole bio.",
    body: "Frontend, backend, smart contracts, design — you make the thing real. The most wanted archetype on the protocol.",
    colorVar: "--builder-archetype",
  },
] as const

export type ArchetypeId = (typeof ARCHETYPES)[number]["id"]

export const SKILLS_BY_ARCHETYPE: Record<ArchetypeId, string[]> = {
  visionary: [
    "Product Strategy",
    "Fundraising",
    "Storytelling",
    "Token Design",
    "Community",
    "Vision & Narrative",
  ],
  strategist: [
    "Go-to-Market",
    "Operations",
    "Partnerships & BD",
    "Marketing",
    "Legal & Compliance",
    "Finance",
  ],
  builder: [
    "Frontend",
    "Backend",
    "Smart Contracts",
    "Protocol Design",
    "DevOps",
    "UI / UX Design",
    "AI / ML",
    "Mobile",
    "Security / Auditing",
  ],
}

export const ALL_SKILLS = Object.values(SKILLS_BY_ARCHETYPE).flat()

export const CYPHER_KITTENS = [
  { id: "cat-red", src: "/cypher-kitten/cat-red.gif", label: "Red Kitten" },
  { id: "cat-yellow", src: "/cypher-kitten/cat-yellow.gif", label: "Yellow Kitten" },
] as const

// Re-exported from constants for backward compat
export { LANGUAGES } from "@/lib/constants/languages"
export { REGIONS } from "@/lib/constants/location"
export { TIMEZONES } from "@/lib/constants/timezones"

export type OnboardingStep =
  | "archetype"
  | "identity"
  | "skills"
  | "context"
  | "complete"

export const STEP_ORDER: OnboardingStep[] = [
  "archetype",
  "identity",
  "skills",
  "context",
  "complete",
]

// Visible steps (excluding "complete" which is not a real step)
export const VISIBLE_STEPS = STEP_ORDER.filter((s) => s !== "complete")

export function getStepIndex(step: OnboardingStep | null): number {
  if (!step) return 0
  const idx = STEP_ORDER.indexOf(step)
  return idx === -1 ? 0 : idx
}
