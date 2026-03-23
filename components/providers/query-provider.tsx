"use client"

import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { usePrivy } from "@privy-io/react-auth"
import { setTokenGetter } from "@/lib/api-client"

function ApiAuthSetup() {
  const { getAccessToken } = usePrivy()
  useEffect(() => {
    setTokenGetter(getAccessToken)
  }, [getAccessToken])
  return null
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 30_000,
          },
        },
      }),
  )
  return (
    <QueryClientProvider client={queryClient}>
      <ApiAuthSetup />
      {children}
    </QueryClientProvider>
  )
}
