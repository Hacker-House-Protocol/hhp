import { z } from "zod"
import { ARCHETYPE_IDS } from "@/lib/onboarding"

export const createHackSpaceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(80),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  looking_for: z.array(z.enum(ARCHETYPE_IDS)).min(1, "Select at least one archetype"),
  skills_needed: z.array(z.string()).optional(),
})

export type CreateHackSpaceInput = z.infer<typeof createHackSpaceSchema>

export const applyToHackSpaceSchema = z.object({
  message: z.string().max(300).optional(),
})

export type ApplyToHackSpaceInput = z.infer<typeof applyToHackSpaceSchema>
