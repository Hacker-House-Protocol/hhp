"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

function RefreshContent() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  useEffect(() => {
    if (!ready) return;

    if (authenticated) {
      router.replace(redirect);
    } else {
      router.replace("/");
    }
  }, [ready, authenticated, redirect, router]);

  return null;
}

export default function RefreshPage() {
  return (
    <Suspense>
      <RefreshContent />
    </Suspense>
  );
}
