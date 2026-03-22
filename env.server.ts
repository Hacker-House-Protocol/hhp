import "server-only"
import { z } from "zod"

// Server-only vars — never import this from client components
const serverEnvSchema = z.object({
  PRIVY_APP_SECRET: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

export const serverEnv = serverEnvSchema.parse({
  PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
})
