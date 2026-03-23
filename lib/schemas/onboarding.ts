import { z } from "zod"

const urlField = z
  .string()
  .refine(
    (val) => val === "" || /^https?:\/\/.+/.test(val),
    "Must be a valid URL starting with http:// or https://",
  )
  .optional()

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
  github_url: urlField,
  twitter_url: urlField,
})

export type ProfileInput = z.infer<typeof profileSchema>

// Legacy exports — kept for any code that still references them
export const identitySchema = z.object({
  handle: z
    .string()
    .min(3, "At least 3 characters")
    .max(20, "Max 20 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  bio: z.string().max(160, "Max 160 characters").optional(),
})

export type IdentityInput = z.infer<typeof identitySchema>

export const contextSchema = z.object({
  languages: z.array(z.string()).optional(),
  region: z.string().optional(),
  timezone: z.string().optional(),
  github_url: urlField,
  twitter_url: urlField,
  farcaster_url: urlField,
  website_url: urlField,
})

export type ContextInput = z.infer<typeof contextSchema>
