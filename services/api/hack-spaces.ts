"use client"

import { useQueryClient } from "@tanstack/react-query"
import { genericAuthRequest } from "@/lib/api-client"
import { useAppQuery, useAppMutation } from "@/lib/query-hooks"
import { queryKeys } from "@/lib/query-keys"
import type { HackSpace, Application } from "@/lib/types"
import type { CreateHackSpaceInput, ApplyToHackSpaceInput } from "@/lib/schemas/hack-space"

export const useHackSpaces = () => {
  return useAppQuery<HackSpace[]>({
    fetcher: async () => {
      const { hack_spaces } = await genericAuthRequest<{ hack_spaces: HackSpace[] }>(
        "get",
        "/api/hack-spaces",
      )
      return hack_spaces ?? []
    },
    queryKey: [queryKeys.hackSpaces],
  })
}

export const useCreateHackSpace = () => {
  const queryClient = useQueryClient()
  return useAppMutation<CreateHackSpaceInput, HackSpace>({
    fetcher: async (input) => {
      const { hack_space } = await genericAuthRequest<{ hack_space: HackSpace }>(
        "post",
        "/api/hack-spaces",
        input,
      )
      return hack_space
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.hackSpaces] })
      },
    },
  })
}

export const useApplyToHackSpace = (hackSpaceId: string) => {
  return useAppMutation<ApplyToHackSpaceInput, Application>({
    fetcher: async (input) => {
      const { application } = await genericAuthRequest<{ application: Application }>(
        "post",
        `/api/hack-spaces/${hackSpaceId}/apply`,
        input,
      )
      return application
    },
  })
}
