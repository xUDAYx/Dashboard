"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useEffect, useState } from "react"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const isLoginPage = pathname === '/login'

  useEffect(() => {
    // Check if user is admin from cookie
    const checkUserRole = async () => {
      try {
        const response = await fetch('/api/users/profile')
        if (response.ok) {
          const userData = await response.json()
          setIsAdmin(userData.role.name === 'Admin')
        }
      } catch (error) {
        console.error('Error checking user role:', error)
      }
    }

    if (!isLoginPage) {
      void checkUserRole()
    }
  }, [isLoginPage])

  // Hide sidebar for login page and non-admin users on profile page
  const shouldHideSidebar = isLoginPage || (!isAdmin && pathname === '/profile')

  if (shouldHideSidebar) {
    return <main className="h-full">{children}</main>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-full flex-col md:flex-row">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-4 pt-16 md:p-6 md:pt-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
} 