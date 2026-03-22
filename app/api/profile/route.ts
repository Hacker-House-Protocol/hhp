import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { patchProfileSchema } from "@/lib/schemas/profile"
import type { ArchetypeId, OnboardingStep } from "@/lib/onboarding"

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

export async function GET(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("privy_id", privyUserId)
    .single()

  if (error) {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ user: data })
}

export async function PATCH(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body: unknown = await req.json()
  const parsed = patchProfileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0].message },
      { status: 400 },
    )
  }

  const updates: Record<
    string,
    ArchetypeId | string | string[] | OnboardingStep
  > = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  }

  if (parsed.data.handle) {
    const { data: existing } = await supabaseServer
      .from("users")
      .select("privy_id")
      .eq("handle", parsed.data.handle)
      .single()

    if (existing && existing.privy_id !== privyUserId) {
      return NextResponse.json(
        { message: "Handle already taken" },
        { status: 409 },
      )
    }
  }

  const { data, error } = await supabaseServer
    .from("users")
    .update(updates)
    .eq("privy_id", privyUserId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ message: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ user: data })
}
