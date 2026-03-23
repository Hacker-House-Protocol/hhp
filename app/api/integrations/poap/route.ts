import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { serverEnv } from "@/env.server"
import type { POAP } from "@/lib/types"

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

interface PoapToken {
  tokenId: string
  event: {
    name: string
    image_url: string
    start_date: string
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
    return NextResponse.json({ poaps: [] })
  }

  try {
    const response = await fetch(
      `https://api.poap.tech/actions/scan/${user.wallet_address}`,
      {
        headers: {
          "x-api-key": serverEnv.POAP_APIKEY,
          "Accept": "application/json",
        },
      },
    )

    if (!response.ok) {
      return NextResponse.json({ poaps: [] })
    }

    const tokens = (await response.json()) as PoapToken[]

    const poaps: POAP[] = tokens.map((token) => ({
      id: token.tokenId,
      name: token.event.name,
      image_url: token.event.image_url,
      event_date: token.event.start_date,
    }))

    await supabaseServer
      .from("users")
      .update({ poaps: poaps, updated_at: new Date().toISOString() })
      .eq("privy_id", privyUserId)

    return NextResponse.json({ poaps })
  } catch {
    return NextResponse.json({ poaps: [] })
  }
}
