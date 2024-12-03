"use client"

import { LayoutDashboard, Users, ShieldCheck, Menu } from 'lucide-react'
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebarContext,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()
  const { isOpen, setIsOpen } = useSidebarContext()

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "User Management",
      icon: Users,
      href: "/users",
    },
    {
      title: "Role Management",
      icon: ShieldCheck,
      href: "/roles",
    },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <Sidebar 
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarHeader className="flex h-14 items-center border-b border-sidebar-border px-6">
          <h1 className="text-lg font-semibold">RBAC Dashboard</h1>
        </SidebarHeader>
        <SidebarContent className="py-4">
          <SidebarMenu className="space-y-1 px-3">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={item.href} className="flex items-center gap-4 px-3 py-2">
                    <item.icon className="h-5 w-5" />
                    <span className="text-base">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

