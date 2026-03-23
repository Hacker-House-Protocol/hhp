import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { createHackSpaceSchema } from "@/lib/schemas/hack-space"

async function getPrivyUserId(req: NextRequest): Promise<string | null> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  try {
    const claims = await privy.utils().auth().verifyAccessToken(token)
    return claims.user_id
  } catch {
    return null
  }
}

export async function GET() {
  const { data, error } = await supabaseServer
    .from("hack_spaces")
    .select(`
      *,
      creator:users(id, handle, archetype),
      member_count:applications(count)
    `)
    .in("status", ["open", "full", "in_progress"])
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  const hackSpaces = data.map((hs) => ({
    ...hs,
    member_count: (hs.member_count as unknown as { count: number }[])?.[0]?.count ?? 0,
  }))

  return NextResponse.json({ hack_spaces: hackSpaces })
}

export async function POST(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { data: user } = await supabaseServer
    .from("users")
    .select("id")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const body: unknown = await req.json()
  const parsed = createHackSpaceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { has_event, ...fields } = parsed.data

  const insertData = {
    creator_id: user.id,
    title: fields.title,
    description: fields.description,
    track: fields.track,
    stage: fields.stage,
    repo_url: fields.repo_url || null,
    looking_for: fields.looking_for,
    skills_needed: fields.skills_needed ?? [],
    max_team_size: fields.max_team_size,
    experience_level: fields.experience_level,
    language: fields.language,
    timezone_region: fields.timezone_region || null,
    application_type: fields.application_type,
    application_deadline: fields.application_deadline || null,
    event_name: has_event ? (fields.event_name || null) : null,
    event_url: has_event ? (fields.event_url || null) : null,
    event_date: has_event ? (fields.event_date || null) : null,
    event_timing: has_event ? (fields.event_timing ?? null) : null,
  }

  const { data, error } = await supabaseServer
    .from("hack_spaces")
    .insert(insertData)
    .select(`*, creator:users(id, handle, archetype)`)
    .single()

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ hack_space: data }, { status: 201 })
}
