import { PrivyClient } from "@privy-io/node";
import { env } from "@/env";
import { serverEnv } from "@/env.server";

export const privy = new PrivyClient({
  appId: env.NEXT_PUBLIC_PRIVY_APP_ID,
  appSecret: serverEnv.PRIVY_APP_SECRET,
});
