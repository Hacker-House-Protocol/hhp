import { NextRequest, NextResponse } from "next/server"
import { privy } from "@/lib/privy"
import { supabaseServer } from "@/lib/supabase-server"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

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

export async function POST(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: "Invalid file type. Use JPEG, PNG, WebP or GIF" },
      { status: 400 },
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "File too large. Maximum 5MB" },
      { status: 400 },
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.type.split("/")[1]
  const path = `${privyUserId}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabaseServer.storage
    .from("hack-space-images")
    .upload(path, buffer, { contentType: file.type })

  if (error) {
    return NextResponse.json({ message: "Upload failed" }, { status: 500 })
  }

  const { data } = supabaseServer.storage
    .from("hack-space-images")
    .getPublicUrl(path)

  return NextResponse.json({ image_url: data.publicUrl })
}
