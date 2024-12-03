"use client"

import { LayoutDashboard, Users, ShieldCheck, Menu, LogOut } from 'lucide-react'
import { usePathname, useRouter } from "next/navigation"
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
import { useToast } from "@/hooks/use-toast"

export function AppSidebar() {
  const pathname = usePathname()
  const { isOpen, setIsOpen } = useSidebarContext()
  const router = useRouter()
  const { toast } = useToast()

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout",
      })
    }
  }

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
        <div className="flex h-full flex-col">
          <SidebarHeader className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-6">
            <h1 className="text-lg font-semibold">RBAC Dashboard</h1>
          </SidebarHeader>

          <div className="flex min-h-0 flex-1 flex-col justify-between">
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

            {/* Logout Button */}
            <div className="shrink-0 border-t border-sidebar-border p-3">
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="text-base">Logout</span>
              </Button>
            </div>
          </div>
        </div>
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

