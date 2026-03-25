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

// GET /api/hacker-houses/[id]/applications — creator only
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: hackerHouseId } = await params

  const { data: user } = await supabaseServer
    .from("users")
    .select("id")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const { data: hackerHouse } = await supabaseServer
    .from("hacker_houses")
    .select("creator_id")
    .eq("id", hackerHouseId)
    .single()

  if (!hackerHouse) {
    return NextResponse.json({ message: "Hacker House not found" }, { status: 404 })
  }

  if (hackerHouse.creator_id !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const { data, error } = await supabaseServer
    .from("applications")
    .select(`
      *,
      applicant:users!applicant_id(id, handle, archetype, skills, avatar_url)
    `)
    .eq("hacker_house_id", hackerHouseId)
    .eq("target_type", "hacker_house")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[GET /api/hacker-houses/:id/applications]", error)
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ applications: data })
}
