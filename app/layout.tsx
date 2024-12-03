import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RBAC Dashboard",
  description: "Role-Based Access Control Dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className={inter.className}>
            <div className="flex min-h-screen flex-col md:flex-row">
              <AppSidebar />
              <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                {children}
              </main>
            </div>
            <Toaster />
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}

