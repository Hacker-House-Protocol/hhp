import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { reviewHackerHouseApplicationSchema } from "@/lib/schemas/hacker-house"

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

// PATCH /api/hacker-houses/[id]/applications/[appId] — accept or reject
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; appId: string }> }
) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: hackerHouseId, appId } = await params

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
    .select("id, creator_id, capacity, status")
    .eq("id", hackerHouseId)
    .single()

  if (!hackerHouse) {
    return NextResponse.json({ message: "Hacker House not found" }, { status: 404 })
  }

  if (hackerHouse.creator_id !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const body: unknown = await req.json()
  const parsed = reviewHackerHouseApplicationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 })
  }

  const { data: application, error: appError } = await supabaseServer
    .from("applications")
    .update({ status: parsed.data.status })
    .eq("id", appId)
    .eq("hacker_house_id", hackerHouseId)
    .select()
    .single()

  if (appError || !application) {
    return NextResponse.json({ message: "Application not found" }, { status: 404 })
  }

  // If accepted, check if house is now full and auto-update status
  if (parsed.data.status === "accepted") {
    const { count } = await supabaseServer
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("hacker_house_id", hackerHouseId)
      .eq("status", "accepted")
      .eq("target_type", "hacker_house")

    // +1 for creator
    if (count !== null && count + 1 >= hackerHouse.capacity) {
      await supabaseServer
        .from("hacker_houses")
        .update({ status: "full", updated_at: new Date().toISOString() })
        .eq("id", hackerHouseId)
    }
  }

  return NextResponse.json({ application })
}
