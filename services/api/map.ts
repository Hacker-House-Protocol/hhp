"use client"

import { genericAuthRequest } from "@/lib/api-client"
import { useAppQuery } from "@/lib/query-hooks"
import { queryKeys } from "@/lib/query-keys"
import type { MapMarkersResponse, MapMarkerData } from "@/lib/types"

export function useMapMarkers() {
  return useAppQuery<MapMarkerData[]>({
    fetcher: async () => {
      const { markers } = await genericAuthRequest<MapMarkersResponse>(
        "get",
        "/api/map/markers"
      )
      return markers
    },
    queryKey: [queryKeys.mapMarkers],
  })
}
