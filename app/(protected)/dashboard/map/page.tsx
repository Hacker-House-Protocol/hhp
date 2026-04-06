"use client"

import dynamic from "next/dynamic"
import { Spinner } from "@/components/ui/spinner"

const MapView = dynamic(
  () => import("./_components/map-view").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    ),
  }
)

export default function MapPage() {
  return (
    <div className="h-[calc(100dvh-3.5rem)] w-full">
      <MapView />
    </div>
  )
}
