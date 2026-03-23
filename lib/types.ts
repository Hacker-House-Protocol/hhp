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

export type HackSpaceStatus = "open" | "full" | "in_progress" | "finished"
export type HackSpaceTrack =
  | "DeFi"
  | "DAO tools"
  | "AI"
  | "Social"
  | "Gaming"
  | "NFTs"
  | "Infrastructure"
  | "Other"
export type ProjectStage = "idea" | "prototype" | "in_development"
export type ApplicationType = "open" | "invite_only" | "curated"
export type ExperienceLevel = "beginner" | "intermediate" | "advanced"

export interface HackSpace {
  id: string
  title: string
  description: string
  track: HackSpaceTrack
  stage: ProjectStage
  repo_url: string | null
  status: HackSpaceStatus
  looking_for: string[]
  skills_needed: string[]
  max_team_size: number
  experience_level: ExperienceLevel
  language: string
  timezone_region: string | null
  application_type: ApplicationType
  application_deadline: string | null
  // Event (optional)
  event_name: string | null
  event_url: string | null
  event_date: string | null
  event_timing: "before" | "during" | "after" | null
  created_at: string
  creator: {
    id: string
    handle: string | null
    archetype: string | null
  }
  member_count?: number
}

export interface Application {
  id: string
  hack_space_id: string
  applicant_id: string
  message: string | null
  status: "pending" | "accepted" | "rejected"
  created_at: string
}

export interface ApplicationWithApplicant extends Application {
  applicant: {
    id: string
    handle: string | null
    archetype: string | null
    skills: string[] | null
  }
}
