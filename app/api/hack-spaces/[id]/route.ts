import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabaseServer
    .from("hack_spaces")
    .select(`
      *,
      creator:users(id, handle, archetype),
      member_count:applications(count)
    `)
    .eq("id", id)
    .single()

  if (error || !data) {
    return NextResponse.json({ message: "Hack Space not found" }, { status: 404 })
  }

  const hackSpace = {
    ...data,
    member_count: (data.member_count as unknown as { count: number }[])?.[0]?.count ?? 0,
  }

  return NextResponse.json({ hack_space: hackSpace })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const { data: user } = await supabaseServer
    .from("users")
    .select("id")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const { data: hackSpace } = await supabaseServer
    .from("hack_spaces")
    .select("id, creator_id")
    .eq("id", id)
    .single()

  if (!hackSpace) {
    return NextResponse.json({ message: "Hack Space not found" }, { status: 404 })
  }

  if (hackSpace.creator_id !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const body = await req.json() as { status?: string }
  const validStatuses = ["open", "full", "in_progress", "finished"]
  if (body.status && !validStatuses.includes(body.status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 })
  }

  const { data, error } = await supabaseServer
    .from("hack_spaces")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(`*, creator:users(id, handle, archetype)`)
    .single()

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ hack_space: data })
}
