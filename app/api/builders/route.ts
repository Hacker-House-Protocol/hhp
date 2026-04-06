import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const archetype = searchParams.get("archetype")
  const q = searchParams.get("q")
  const excludeId = searchParams.get("exclude_id")
  const limit = parseInt(searchParams.get("limit") ?? "12", 10)
  const offset = parseInt(searchParams.get("offset") ?? "0", 10)

  let query = supabaseServer
    .from("users")
    .select("*", { count: "exact" })
    .eq("onboarding_step", "complete")
    .order("created_at", { ascending: false })

  if (archetype) {
    query = query.eq("archetype", archetype)
  }

  if (q) {
    const sanitized = q.replace(/[%_,()]/g, "")
    if (sanitized) {
      query = query.or(`handle.ilike.%${sanitized}%,bio.ilike.%${sanitized}%`)
    }
  }

  if (excludeId) {
    query = query.neq("id", excludeId)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  // Strip private fields from each result
  const builders = (data ?? []).map((user) => {
    const { email: _email, privy_id: _privyId, ...publicProfile } = user
    return publicProfile
  })

  return NextResponse.json({ builders, total: count ?? 0, offset, limit })
}
