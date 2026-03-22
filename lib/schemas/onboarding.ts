import { z } from "zod"

export const identitySchema = z.object({
  handle: z
    .string()
    .min(3, "At least 3 characters")
    .max(20, "Max 20 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  bio: z.string().max(160, "Max 160 characters").optional(),
})

export type IdentityInput = z.infer<typeof identitySchema>
