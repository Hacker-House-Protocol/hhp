export interface POAP {
  id: string
  name: string
  image_url: string
  event_date: string
}

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
  avatar_url: string | null
  languages: string[] | null
  timezone: string | null
  region: string | null
  country: string | null
  city: string | null
  github_url: string | null
  twitter_url: string | null
  farcaster_url: string | null
  website_url: string | null
  is_verified: boolean
  talent_protocol_score: number | null
  poaps: POAP[]
  onchain_since: string | null
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

export interface HackSpaceParticipant {
  id: string
  handle: string | null
  archetype: string | null
  avatar_url: string | null
}

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
  region: string | null
  country: string | null
  city: string | null
  image_url: string | null
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
  participants?: HackSpaceParticipant[]
}

export interface HackSpaceListParams {
  track?: HackSpaceTrack
  status?: HackSpaceStatus
  looking_for?: string
  q?: string
  limit?: number
  offset?: number
}

export interface HackSpaceListResponse {
  hack_spaces: HackSpace[]
  total: number
  offset: number
  limit: number
}

export interface Application {
  id: string
  hack_space_id: string | null
  hacker_house_id: string | null
  target_type: "hack_space" | "hacker_house"
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
    avatar_url: string | null
  }
}

// Hacker Houses
export type HouseModality = "free" | "paid" | "staking"
export type HouseStatus = "open" | "full" | "active" | "finished"

export interface HackerHouseParticipant {
  id: string
  handle: string | null
  archetype: string | null
  avatar_url: string | null
}

export interface HackerHouse {
  id: string
  name: string
  city: string
  country: string
  neighborhood: string | null
  start_date: string
  end_date: string
  capacity: number
  modality: HouseModality
  images: string[]
  includes_private_room: boolean
  includes_shared_room: boolean
  includes_meals: boolean
  includes_workspace: boolean
  includes_internet: boolean
  profile_sought: string[]
  language: string
  house_rules: string | null
  status: HouseStatus
  application_type: ApplicationType
  application_deadline: string | null
  event_name: string | null
  event_url: string | null
  event_date: string | null
  event_timing: "before" | "during" | "after" | null
  created_at: string
  creator: HackerHouseParticipant
  participants: HackerHouseParticipant[]
  participants_count: number
}

export interface HackerHouseListParams {
  status?: HouseStatus
  profile_sought?: string
  q?: string
  limit?: number
  offset?: number
}

export interface HackerHouseListResponse {
  hacker_houses: HackerHouse[]
  total: number
  offset: number
  limit: number
}
