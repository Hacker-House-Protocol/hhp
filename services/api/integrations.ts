"use client"

import { useQueryClient } from "@tanstack/react-query"
import { genericAuthRequest } from "@/lib/api-client"
import { useAppMutation } from "@/lib/query-hooks"
import { queryKeys } from "@/lib/query-keys"
import type { POAP } from "@/lib/types"

export const useImportTalentScore = () => {
  const queryClient = useQueryClient()
  return useAppMutation<undefined, { talent_protocol_score: number | null }>({
    fetcher: async () => {
      return await genericAuthRequest<{ talent_protocol_score: number | null }>(
        "post",
        "/api/integrations/talent-protocol",
      )
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.profile] })
      },
    },
  })
}

export const useImportPoaps = () => {
  const queryClient = useQueryClient()
  return useAppMutation<undefined, { poaps: POAP[] }>({
    fetcher: async () => {
      return await genericAuthRequest<{ poaps: POAP[] }>(
        "post",
        "/api/integrations/poap",
      )
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.profile] })
      },
    },
  })
}
