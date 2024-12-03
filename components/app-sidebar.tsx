"use client"

import { Users, ShieldCheck } from 'lucide-react'
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "User Management",
      icon: Users,
      href: "/",
    },
    {
      title: "Role Management",
      icon: ShieldCheck,
      href: "/roles",
    },
  ]

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4">
        <h1 className="text-xl font-bold">RBAC Dashboard</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
              >
                <Link href={item.href} className="flex items-center gap-2 px-4 py-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

