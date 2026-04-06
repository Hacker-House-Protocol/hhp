import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { updateFriendshipSchema } from "@/lib/schemas/friendships"

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { data: user } = await supabaseServer
    .from("users")
    .select("id, handle")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const body: unknown = await req.json()
  const parsed = updateFriendshipSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0].message },
      { status: 400 },
    )
  }

  // Re-fetch friendship to verify ownership
  const { data: friendship } = await supabaseServer
    .from("friendships")
    .select("id, requester_id, receiver_id, status")
    .eq("id", id)
    .single()

  if (!friendship) {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }

  // Only receiver can accept/reject
  if (friendship.receiver_id !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  if (friendship.status !== "pending") {
    return NextResponse.json(
      { message: "Friendship is not pending" },
      { status: 400 },
    )
  }

  const { data: updated, error } = await supabaseServer
    .from("friendships")
    .update({ status: parsed.data.status })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  // If accepted, notify the requester
  if (parsed.data.status === "accepted") {
    await supabaseServer.from("notifications").insert({
      user_id: friendship.requester_id,
      type: "friend_accepted",
      title: "Connection accepted",
      body: `${user.handle ?? "Someone"} accepted your connection request.`,
      link: "/dashboard/notifications",
    })
  }

  return NextResponse.json({ friendship: updated })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
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

  // Re-fetch friendship to verify participation
  const { data: friendship } = await supabaseServer
    .from("friendships")
    .select("id, requester_id, receiver_id")
    .eq("id", id)
    .single()

  if (!friendship) {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }

  if (friendship.requester_id !== user.id && friendship.receiver_id !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const { error } = await supabaseServer
    .from("friendships")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ message: "Friendship removed" })
}
