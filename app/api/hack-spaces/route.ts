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
      creator:users(id, handle, archetype)
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ hack_spaces: data })
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

  const { data, error } = await supabaseServer
    .from("hack_spaces")
    .insert({
      creator_id: user.id,
      ...parsed.data,
      skills_needed: parsed.data.skills_needed ?? [],
    })
    .select(`*, creator:users(id, handle, archetype)`)
    .single()

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ hack_space: data }, { status: 201 })
}
