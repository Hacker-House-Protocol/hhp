import { z } from "zod"
import { ARCHETYPE_IDS } from "@/lib/onboarding"

export const patchProfileSchema = z.object({
  archetype: z.enum(ARCHETYPE_IDS).optional(),
  skills: z.array(z.string()).optional(),
  handle: z
    .string()
    .regex(
      /^[a-z0-9_]{3,20}$/,
      "Handle must be 3–20 lowercase chars, numbers, or underscores",
    )
    .optional(),
  bio: z.string().max(160).optional(),
  onboarding_step: z
    .enum(["archetype", "skills", "identity", "complete"])
    .optional(),
})

export type PatchProfileInput = z.infer<typeof patchProfileSchema>
