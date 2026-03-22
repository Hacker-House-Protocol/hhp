"use client";

import { usePrivy } from "@privy-io/react-auth";

export function useAuth() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  return {
    user,
    isAuthenticated: authenticated,
    isLoading: !ready,
    login,
    logout,
  };
}
