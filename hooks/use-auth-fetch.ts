"use client"

import { usePrivy } from "@privy-io/react-auth"

export function useAuthFetch() {
  const { getAccessToken } = usePrivy()

  async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const token = await getAccessToken()
    return fetch(input, {
      ...init,
      headers: {
        ...init.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    })
  }

  return { authFetch }
}
