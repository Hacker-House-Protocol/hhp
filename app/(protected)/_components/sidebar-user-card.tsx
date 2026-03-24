"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/services/api/profile"
import { ARCHETYPES } from "@/lib/onboarding"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function SidebarUserCard() {
  const { user, logout } = useAuth()
  const { data: profile } = useProfile()
  const router = useRouter()
  const { isMobile } = useSidebar()

  async function handleLogout() {
    await logout()
    router.replace("/")
  }

  const email = user?.linkedAccounts?.find((a) => a.type === "email") as
    | { type: "email"; address: string }
    | undefined
  const wallet = user?.linkedAccounts?.find((a) => a.type === "wallet") as
    | { type: "wallet"; address: string }
    | undefined

  const sublabel = wallet
    ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}`
    : (email?.address ?? "")

  const archetype = ARCHETYPES.find((a) => a.id === profile?.archetype)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-14 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              tooltip={profile?.handle ? `@${profile.handle}` : "Account"}
            >
              {/* Avatar */}
              <div
                className="size-9 rounded-full overflow-hidden border-2 shrink-0"
                style={{
                  borderColor: archetype
                    ? `var(${archetype.colorVar})`
                    : "var(--border)",
                }}
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-0.5 text-left min-w-0 flex-1">
                <span className="font-medium text-sm leading-none truncate">
                  {profile?.handle ? `@${profile.handle}` : "My Account"}
                </span>
                {sublabel && (
                  <span className="text-xs text-muted-foreground font-mono truncate leading-none mt-0.5">
                    {sublabel}
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-52 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2"
              >
                <User className="size-4" />
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
