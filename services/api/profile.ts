"use client"

import { useQueryClient } from "@tanstack/react-query"
import { genericAuthRequest } from "@/lib/api-client"
import { useAppQuery, useAppMutation } from "@/lib/query-hooks"
import { queryKeys } from "@/lib/query-keys"
import type { UserProfile } from "@/lib/types"
import type { PatchProfileInput } from "@/lib/schemas/profile"

export async function syncAndGetProfile(): Promise<UserProfile> {
  await genericAuthRequest("post", "/api/auth/sync")
  const { user } = await genericAuthRequest<{ user: UserProfile }>("get", "/api/profile")
  return user
}

export const useProfile = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useAppQuery<UserProfile>({
    fetcher: async () => {
      const { user } = await genericAuthRequest<{ user: UserProfile }>("get", "/api/profile")
      return user
    },
    queryKey: [queryKeys.profile],
    enabled,
  })
}

export const useBuilderProfile = (username: string) => {
  return useAppQuery<UserProfile>({
    fetcher: async () => {
      const { user } = await genericAuthRequest<{ user: UserProfile }>(
        "get",
        `/api/builders/${username}`,
      )
      return user
    },
    queryKey: [queryKeys.builderProfile, username],
    enabled: !!username,
  })
}

export const usePatchProfile = () => {
  const queryClient = useQueryClient()
  return useAppMutation<PatchProfileInput, UserProfile>({
    fetcher: async (input) => {
      const { user } = await genericAuthRequest<{ user: UserProfile }>(
        "patch",
        "/api/profile",
        input,
      )
      return user
    },
    options: {
      onSuccess: (updated) => {
        queryClient.setQueryData([queryKeys.profile], updated)
      },
    },
  })
}
