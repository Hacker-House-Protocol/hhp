"use client"

import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { genericAuthRequest } from "@/lib/api-client"
import { useAppQuery, useAppMutation } from "@/lib/query-hooks"
import { queryKeys } from "@/lib/query-keys"
import type {
  UserProfile,
  BuilderListParams,
  BuilderListResponse,
  SuggestedBuilder,
} from "@/lib/types"
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

const BUILDERS_PAGE_SIZE = 12

export const useFilteredBuilders = (filters: BuilderListParams) => {
  return useInfiniteQuery<BuilderListResponse, Error>({
    queryKey: [queryKeys.builders, "filtered", filters],
    queryFn: async ({ pageParam }) => {
      const offset = typeof pageParam === "number" ? pageParam : 0
      return genericAuthRequest<BuilderListResponse>("get", "/api/builders", {
        ...filters,
        limit: BUILDERS_PAGE_SIZE,
        offset,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const fetched = lastPage.offset + lastPage.builders.length
      return fetched < lastPage.total ? fetched : undefined
    },
  })
}

export const useSuggestedBuilders = () =>
  useAppQuery<SuggestedBuilder[]>({
    fetcher: async () => {
      const { suggestions } = await genericAuthRequest<{
        suggestions: SuggestedBuilder[]
      }>("get", "/api/builders/suggestions")
      return suggestions
    },
    queryKey: [queryKeys.builders, "suggestions"],
  })

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
