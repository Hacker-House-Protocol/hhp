import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import type { MapMarkerData } from "@/lib/types"

export async function GET() {
  // Fetch hacker houses with coordinates
  const { data: houses } = await supabaseServer
    .from("hacker_houses")
    .select(
      "id, name, city, country, lat, lng, status, capacity, event_name, event_start_date, event_end_date, images"
    )
    .not("lat", "is", null)
    .not("lng", "is", null)
    .in("status", ["open", "full", "active"])

  // Fetch hack spaces with coordinates AND linked to an event
  const { data: spaces } = await supabaseServer
    .from("hack_spaces")
    .select(
      "id, title, city, country, lat, lng, status, max_team_size, track, event_name, event_start_date, event_end_date, image_url"
    )
    .not("lat", "is", null)
    .not("lng", "is", null)
    .not("event_name", "is", null)
    .in("status", ["open", "full", "in_progress"])

  // Get participant counts for houses
  const houseIds = (houses ?? []).map((h) => h.id)
  const houseCountMap: Record<string, number> = {}
  if (houseIds.length > 0) {
    const { data: houseApps } = await supabaseServer
      .from("applications")
      .select("hacker_house_id")
      .in("hacker_house_id", houseIds)
      .eq("status", "accepted")
      .eq("target_type", "hacker_house")
    for (const app of houseApps ?? []) {
      const hid = app.hacker_house_id as string
      houseCountMap[hid] = (houseCountMap[hid] ?? 0) + 1
    }
  }

  // Get member counts for spaces
  const spaceIds = (spaces ?? []).map((s) => s.id)
  const spaceCountMap: Record<string, number> = {}
  if (spaceIds.length > 0) {
    const { data: spaceApps } = await supabaseServer
      .from("applications")
      .select("hack_space_id")
      .in("hack_space_id", spaceIds)
      .eq("status", "accepted")
      .eq("target_type", "hack_space")
    for (const app of spaceApps ?? []) {
      const sid = app.hack_space_id as string
      spaceCountMap[sid] = (spaceCountMap[sid] ?? 0) + 1
    }
  }

  const markers: MapMarkerData[] = [
    ...(houses ?? []).map((h) => ({
      id: h.id as string,
      type: "hacker_house" as const,
      name: h.name as string,
      city: h.city as string | null,
      country: h.country as string | null,
      lat: h.lat as number,
      lng: h.lng as number,
      status: h.status as string,
      event_name: h.event_name as string | null,
      event_start_date: h.event_start_date as string | null,
      event_end_date: h.event_end_date as string | null,
      capacity: h.capacity as number | null,
      participants_count: ((houseCountMap[h.id] ?? 0) + 1) as number,
      max_team_size: null,
      member_count: null,
      track: null,
      image_url: (Array.isArray(h.images) ? (h.images as string[])[0] : null) ?? null,
    })),
    ...(spaces ?? []).map((s) => ({
      id: s.id as string,
      type: "hack_space" as const,
      name: s.title as string,
      city: s.city as string | null,
      country: s.country as string | null,
      lat: s.lat as number,
      lng: s.lng as number,
      status: s.status as string,
      event_name: s.event_name as string | null,
      event_start_date: s.event_start_date as string | null,
      event_end_date: s.event_end_date as string | null,
      capacity: null,
      participants_count: null,
      max_team_size: s.max_team_size as number | null,
      member_count: ((spaceCountMap[s.id] ?? 0) + 1) as number,
      track: s.track as string | null,
      image_url: s.image_url as string | null,
    })),
  ]

  return NextResponse.json({ markers })
}
