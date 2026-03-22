"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { env } from "@/env";

export function AppPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        loginMethods: ["wallet", "email"],
        appearance: {
          theme: "dark",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
