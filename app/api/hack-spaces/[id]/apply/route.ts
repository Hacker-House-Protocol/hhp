import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { applyToHackSpaceSchema } from "@/lib/schemas/hack-space"

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

export async function POST(
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
    .select("id, creator_id, status")
    .eq("id", hackSpaceId)
    .single()

  if (!hackSpace) {
    return NextResponse.json({ message: "Hack Space not found" }, { status: 404 })
  }

  if (hackSpace.status !== "open") {
    return NextResponse.json({ message: "This Hack Space is closed" }, { status: 400 })
  }

  if (hackSpace.creator_id === user.id) {
    return NextResponse.json({ message: "You can't apply to your own Hack Space" }, { status: 400 })
  }

  const body: unknown = await req.json()
  const parsed = applyToHackSpaceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseServer
    .from("applications")
    .insert({
      hack_space_id: hackSpaceId,
      applicant_id: user.id,
      message: parsed.data.message ?? null,
      target_type: "hack_space",
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "You already applied to this Hack Space" }, { status: 409 })
    }
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ application: data }, { status: 201 })
}
