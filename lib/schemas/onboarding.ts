import { z } from "zod"

// Handle-only schema used in StepIdentity
export const handleSchema = z.object({
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(20, "Handle must be at most 20 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
})

export type HandleInput = z.infer<typeof handleSchema>

// Context step schema (step 4)
export const contextSchema = z.object({
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
  languages: z.array(z.string()).optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string().optional(),
  github_url: z
    .string()
    .regex(/^[a-zA-Z0-9_-]*$/, "Invalid GitHub username")
    .optional(),
  twitter_url: z
    .string()
    .regex(/^[a-zA-Z0-9_]*$/, "Invalid Twitter/X username")
    .optional(),
  farcaster_url: z
    .string()
    .regex(/^[a-zA-Z0-9_.]*$/, "Invalid Farcaster username")
    .optional(),
})

export type ContextInput = z.infer<typeof contextSchema>

// Legacy — kept for any code that still references profileSchema
export const profileSchema = z.object({
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(20, "Handle must be at most 20 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
  languages: z.array(z.string()).optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string().optional(),
  github_url: z.string().optional(),
  twitter_url: z.string().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

// Legacy
export const identitySchema = z.object({
  handle: z
    .string()
    .min(3, "At least 3 characters")
    .max(20, "Max 20 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  bio: z.string().max(160, "Max 160 characters").optional(),
})

export type IdentityInput = z.infer<typeof identitySchema>
