"use client"

import { useState, useMemo } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { renderToString } from "react-dom/server"
import { Building2, Code } from "lucide-react"
import { useMapMarkers } from "@/services/api/map"
import { Spinner } from "@/components/ui/spinner"
import { HousePopup } from "./house-popup"
import { SpacePopup } from "./space-popup"
import { cn } from "@/lib/utils"
import type { MapMarkerType } from "@/lib/types"
import "leaflet/dist/leaflet.css"

type FilterType = "all" | "hacker_house" | "hack_space"

const ICON_CONFIG: Record<
  MapMarkerType,
  Record<string, { bg: string; border: string }>
> = {
  hacker_house: {
    open: { bg: "var(--primary)", border: "var(--primary)" },
    full: { bg: "var(--builder-archetype)", border: "var(--builder-archetype)" },
    active: { bg: "var(--strategist)", border: "var(--strategist)" },
    finished: { bg: "var(--muted-foreground)", border: "var(--muted-foreground)" },
  },
  hack_space: {
    open: { bg: "var(--primary)", border: "var(--primary)" },
    full: { bg: "var(--builder-archetype)", border: "var(--builder-archetype)" },
    in_progress: { bg: "var(--strategist)", border: "var(--strategist)" },
    finished: { bg: "var(--muted-foreground)", border: "var(--muted-foreground)" },
  },
}

function createMarkerIcon(type: MapMarkerType, status: string): L.DivIcon {
  const cfg = ICON_CONFIG[type]?.[status] ?? { bg: "var(--primary)", border: "var(--primary)" }
  const IconComponent = type === "hacker_house" ? Building2 : Code
  const iconHtml = renderToString(
    <IconComponent style={{ width: 16, height: 16, color: "var(--foreground)" }} />
  )

  return L.divIcon({
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
    html: `<div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: color-mix(in oklch, ${cfg.bg} 80%, transparent);
      border: 2px solid ${cfg.border};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px color-mix(in oklch, var(--background) 60%, transparent);
    ">${iconHtml}</div>`,
  })
}

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hacker_house", label: "Hacker Houses" },
  { value: "hack_space", label: "Hack Spaces" },
]

export function MapView() {
  const { data: markers, isLoading } = useMapMarkers()
  const [filter, setFilter] = useState<FilterType>("all")

  const filteredMarkers = useMemo(() => {
    if (!markers) return []
    if (filter === "all") return markers
    return markers.filter((m) => m.type === filter)
  }, [markers, filter])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Filter pills */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-full px-3 py-1.5">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={cn(
              "text-xs px-3 py-1 rounded-full border font-mono transition-all cursor-pointer whitespace-nowrap",
              filter === opt.value
                ? "border-primary text-primary bg-primary/10"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Empty state overlay */}
      {!isLoading && filteredMarkers.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-card/90 backdrop-blur-sm border border-border rounded-xl px-6 py-4 text-center">
          <p className="font-display font-semibold text-foreground text-sm">
            No locations found
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            {filter !== "all"
              ? "Try selecting a different filter."
              : "Create a Hacker House or Hack Space with a location to see it here."}
          </p>
        </div>
      )}

      <MapContainer
        center={[20, 0]}
        zoom={2}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: "var(--background)" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {filteredMarkers.map((marker) => (
          <Marker
            key={`${marker.type}-${marker.id}`}
            position={[marker.lat, marker.lng]}
            icon={createMarkerIcon(marker.type, marker.status)}
          >
            <Popup
              closeButton={false}
              className="map-popup-dark"
            >
              {marker.type === "hacker_house" ? (
                <HousePopup marker={marker} />
              ) : (
                <SpacePopup marker={marker} />
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
