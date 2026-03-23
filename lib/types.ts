export interface UserProfile {
  id: string
  privy_id: string
  handle: string | null
  bio: string | null
  archetype: string | null
  skills: string[] | null
  wallet_address: string | null
  email: string | null
  onboarding_step: string | null
  created_at: string
  updated_at: string
}

export interface HackSpace {
  id: string
  title: string
  description: string
  looking_for: string[]
  skills_needed: string[]
  status: "open" | "closed"
  created_at: string
  creator: {
    id: string
    handle: string | null
    archetype: string | null
  }
}

export interface Application {
  id: string
  hack_space_id: string
  applicant_id: string
  message: string | null
  status: "pending" | "accepted" | "rejected"
  created_at: string
}
