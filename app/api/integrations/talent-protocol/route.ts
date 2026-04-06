import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"
import { serverEnv } from "@/env.server"
import type { TalentCredential } from "@/lib/types"

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

interface TalentProfileResponse {
  profile?: {
    tags?: string[]
  }
}

interface TalentCredentialRaw {
  id?: string
  name?: string
  category?: string
  value?: string
  last_calculated_at?: string
}

interface TalentCredentialsResponse {
  credentials?: TalentCredentialRaw[]
}

const TP_BASE = "https://api.talentprotocol.com"

async function fetchTP<T>(endpoint: string, wallet: string): Promise<T | null> {
  try {
    const response = await fetch(
      `${TP_BASE}/${endpoint}?id=${wallet}&account_source=wallet`,
      {
        headers: {
          "X-API-KEY": serverEnv.TALENT_PROTOCOL_APIKEY,
          "Content-Type": "application/json",
        },
      },
    )
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { data: user } = await supabaseServer
    .from("users")
    .select("wallet_address")
    .eq("privy_id", privyUserId)
    .single()

  if (!user?.wallet_address) {
    return NextResponse.json({
      talent_protocol_score: null,
      talent_tags: [],
      talent_credentials: [],
    })
  }

  const wallet = user.wallet_address

  const [scoreResult, profileResult, credentialsResult] = await Promise.allSettled([
    fetchTP<TalentScoreResponse>("scores", wallet),
    fetchTP<TalentProfileResponse>("profile", wallet),
    fetchTP<TalentCredentialsResponse>("credentials", wallet),
  ])

  const score =
    scoreResult.status === "fulfilled"
      ? (scoreResult.value?.score?.points ?? null)
      : null

  const tags: string[] =
    profileResult.status === "fulfilled"
      ? (profileResult.value?.profile?.tags ?? [])
      : []

  const credentials: TalentCredential[] =
    credentialsResult.status === "fulfilled"
      ? (credentialsResult.value?.credentials ?? []).map((c) => ({
          id: c.id ?? "",
          name: c.name ?? "",
          category: c.category ?? "",
          value: c.value ?? "",
          last_calculated_at: c.last_calculated_at ?? "",
        }))
      : []

  await supabaseServer
    .from("users")
    .update({
      talent_protocol_score: score,
      talent_tags: tags,
      talent_credentials: credentials,
      updated_at: new Date().toISOString(),
    })
    .eq("privy_id", privyUserId)

  return NextResponse.json({
    talent_protocol_score: score,
    talent_tags: tags,
    talent_credentials: credentials,
  })
}
