import { NextRequest, NextResponse } from "next/server";
import { privy } from "@/lib/privy";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const claims = await privy.utils().auth().verifyAccessToken(token);
    const privyUser = await privy.users()._get(claims.user_id);

    const wallet = privyUser.linked_accounts?.find(
      (a) => a.type === "wallet"
    ) as { type: "wallet"; address: string } | undefined;

    const email = privyUser.linked_accounts?.find(
      (a) => a.type === "email"
    ) as { type: "email"; address: string } | undefined;

    const { data, error } = await supabaseServer
      .from("users")
      .upsert(
        {
          privy_id: privyUser.id,
          wallet_address: wallet?.address ?? null,
          email: email?.address ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "privy_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Auth sync error:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
