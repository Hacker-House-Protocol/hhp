import "server-only"
import { supabaseServer } from "@/lib/supabase-server"

export async function geocode(
  city: string,
  country: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&limit=1`
    const res = await fetch(url, {
      headers: {
        "User-Agent": "HackerHouseProtocol/1.0",
        Accept: "application/json",
      },
    })
    if (!res.ok) return null
    const data: unknown = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null
    const first = data[0] as Record<string, unknown>
    const lat = parseFloat(String(first.lat))
    const lng = parseFloat(String(first.lon))
    if (isNaN(lat) || isNaN(lng)) return null
    return { lat, lng }
  } catch {
    return null
  }
}

export function geocodeAndUpdate(
  table: "hacker_houses" | "hack_spaces",
  id: string,
  city: string,
  country: string
): void {
  // Fire-and-forget — no await, never blocks the response
  geocode(city, country)
    .then((coords) => {
      if (coords) {
        supabaseServer
          .from(table)
          .update({ lat: coords.lat, lng: coords.lng })
          .eq("id", id)
          .then(() => {})
      }
    })
    .catch(() => {})
}
