import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { serverEnv } from "@/env.server"

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

interface TalentScoreResponse {
  score?: {
    points?: number
  }
}

export async function POST(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // Get user's wallet address
  const { data: user } = await supabaseServer
    .from("users")
    .select("wallet_address")
    .eq("privy_id", privyUserId)
    .single()

  if (!user?.wallet_address) {
    return NextResponse.json({ talent_protocol_score: null })
  }

  try {
    const response = await fetch(
      `https://api.talentprotocol.com/scores?id=${user.wallet_address}&account_source=wallet`,
      {
        headers: {
          "X-API-KEY": serverEnv.TALENT_PROTOCOL_APIKEY,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      return NextResponse.json({ talent_protocol_score: null })
    }

    const data = (await response.json()) as TalentScoreResponse
    const score = data?.score?.points ?? null

    await supabaseServer
      .from("users")
      .update({ talent_protocol_score: score, updated_at: new Date().toISOString() })
      .eq("privy_id", privyUserId)

    return NextResponse.json({ talent_protocol_score: score })
  } catch {
    return NextResponse.json({ talent_protocol_score: null })
  }
}
