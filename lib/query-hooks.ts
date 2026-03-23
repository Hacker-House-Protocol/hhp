"use client"

import {
  useQuery,
  useMutation,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query"

interface AppQueryOptions<T> {
  fetcher: () => Promise<T>
  queryKey: QueryKey
  enabled?: boolean
}

export function useAppQuery<T>({ fetcher, queryKey, enabled = true }: AppQueryOptions<T>) {
  return useQuery<T>({
    queryFn: fetcher,
    queryKey,
    enabled,
  })
}

interface AppMutationOptions<TInput, TOutput> {
  fetcher: (input: TInput) => Promise<TOutput>
  options?: Omit<UseMutationOptions<TOutput, Error, TInput>, "mutationFn">
}

export function useAppMutation<TInput, TOutput>({
  fetcher,
  options,
}: AppMutationOptions<TInput, TOutput>) {
  return useMutation<TOutput, Error, TInput>({
    mutationFn: fetcher,
    ...options,
  })
}
