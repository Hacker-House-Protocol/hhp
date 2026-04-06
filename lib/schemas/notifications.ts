import { z } from "zod"

export const markNotificationReadSchema = z.object({
  read: z.literal(true),
})

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>
