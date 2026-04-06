"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Bell, Building2, Home, Map, Users, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import { SidebarUserCard } from "./sidebar-user-card"
import { NotificationBadge } from "./notification-badge"

const NAV_MAIN: {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
}[] = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/dashboard/hack-spaces", label: "Hack Spaces", icon: Zap },
  { href: "/dashboard/hacker-houses", label: "Hacker Houses", icon: Building2 },
  { href: "/dashboard/builders", label: "Builders", icon: Users },
  { href: "/dashboard/map", label: "Map", icon: Map },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
]

export function AppSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton
              size="lg"
              asChild
              className="w-fit rounded-full size-32 hover:bg-transparent active:bg-transparent"
            >
              <Link href="/dashboard">
                <img
                  src="/assets/hacker-house-protocol-logo.svg"
                  alt="HHP"
                  className="shrink-0 w-full h-full animate-float"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV_MAIN.map(({ href, label, icon: Icon, exact }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={isActive(href, exact)}
                    tooltip={label}
                    className="h-12 text-base font-medium [&_svg]:size-5 px-6"
                  >
                    <Link href={href}>
                      <span className="relative">
                        <Icon />
                        {label === "Notifications" && (
                          <NotificationBadge variant="absolute" />
                        )}
                      </span>
                      <span className="ml-2">{label}</span>
                      {label === "Notifications" && (
                        <NotificationBadge variant="inline" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserCard />
      </SidebarFooter>
    </Sidebar>
  )
}
