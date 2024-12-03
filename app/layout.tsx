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
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <SidebarProvider>
          <div className="flex min-h-full flex-col md:flex-row">
            <AppSidebar />
            <main className="flex-1 overflow-auto p-4 pt-16 md:p-6 md:pt-6 lg:p-8">
              {children}
            </main>
          </div>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}

