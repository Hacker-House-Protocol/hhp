import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params

  const { data, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("handle", username)
    .single()

  if (error || !data) {
    return NextResponse.json({ message: "Builder not found" }, { status: 404 })
  }

  // Strip private fields before returning public profile
  const { email: _email, privy_id: _privyId, ...publicProfile } = data

  return NextResponse.json({ user: publicProfile })
}
