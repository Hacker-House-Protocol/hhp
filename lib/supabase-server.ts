import "server-only"
import { createClient } from "@supabase/supabase-js"
import { env } from "@/env"
import { serverEnv } from "@/env.server"

// Service role client — bypasses RLS. Only use in server-side API routes.
export const supabaseServer = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  serverEnv.SUPABASE_SERVICE_ROLE_KEY,
)
