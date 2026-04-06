import { z } from "zod"

export const sendFriendRequestSchema = z.object({
  receiver_id: z.string().uuid(),
})

export const updateFriendshipSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
})

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>
export type UpdateFriendshipInput = z.infer<typeof updateFriendshipSchema>
