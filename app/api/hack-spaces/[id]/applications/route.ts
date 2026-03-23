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

// GET /api/hack-spaces/[id]/applications — creator only
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: hackSpaceId } = await params

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
    .select("creator_id")
    .eq("id", hackSpaceId)
    .single()

  if (!hackSpace) {
    return NextResponse.json({ message: "Hack Space not found" }, { status: 404 })
  }

  if (hackSpace.creator_id !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const { data, error } = await supabaseServer
    .from("applications")
    .select(`
      *,
      applicant:users(id, handle, archetype, skills)
    `)
    .eq("hack_space_id", hackSpaceId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ applications: data })
}
