"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthButtonProps {
  className?: string;
}

export function AuthButton({ className }: AuthButtonProps) {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  if (isLoading) {
    return <Button size="sm" disabled className={className}>Loading...</Button>;
  }

  if (!isAuthenticated) {
    return (
      <Button
        size="sm"
        onClick={login}
        className={className ?? "rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5"}
      >
        Connect
      </Button>
    );
  }

  const wallet = user?.linkedAccounts?.find((a) => a.type === "wallet") as
    | { type: "wallet"; address: string }
    | undefined;
  const email = user?.linkedAccounts?.find((a) => a.type === "email") as
    | { type: "email"; address: string }
    | undefined;

  const label = wallet
    ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}`
    : email?.address ?? "Connected";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className={className}>{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLogout}>Disconnect</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
