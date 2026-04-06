"use client"

import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { genericAuthRequest } from "@/lib/api-client"
import { useAppQuery, useAppMutation } from "@/lib/query-hooks"
import { queryKeys } from "@/lib/query-keys"
import type { Notification } from "@/lib/types"

const PAGE_SIZE = 20

interface NotificationsResponse {
  notifications: Notification[]
  total: number
  offset: number
  limit: number
}

export const useNotifications = () => {
  return useInfiniteQuery<NotificationsResponse, Error>({
    queryKey: [queryKeys.notifications],
    queryFn: async ({ pageParam }) => {
      const offset = typeof pageParam === "number" ? pageParam : 0
      return genericAuthRequest<NotificationsResponse>("get", "/api/notifications", {
        limit: PAGE_SIZE,
        offset,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const fetched = lastPage.offset + lastPage.notifications.length
      return fetched < lastPage.total ? fetched : undefined
    },
  })
}

export const useUnreadNotificationCount = () =>
  useAppQuery<number>({
    fetcher: async () => {
      const { count } = await genericAuthRequest<{ count: number }>(
        "get",
        "/api/notifications/unread-count",
      )
      return count
    },
    queryKey: [queryKeys.unreadNotificationCount],
  })

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()
  return useAppMutation<string, { notification: Notification }>({
    fetcher: async (notificationId) => {
      return await genericAuthRequest<{ notification: Notification }>(
        "patch",
        `/api/notifications/${notificationId}`,
        { read: true },
      )
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.notifications] })
        queryClient.invalidateQueries({
          queryKey: [queryKeys.unreadNotificationCount],
        })
      },
    },
  })
}

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()
  return useAppMutation<undefined, { message: string }>({
    fetcher: async () => {
      return await genericAuthRequest<{ message: string }>(
        "patch",
        "/api/notifications/read-all",
      )
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.notifications] })
        queryClient.invalidateQueries({
          queryKey: [queryKeys.unreadNotificationCount],
        })
      },
    },
  })
}
