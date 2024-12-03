import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value

  // Protect dashboard and profile routes
  if (request.nextUrl.pathname.startsWith("/dashboard") || 
      request.nextUrl.pathname.startsWith("/profile")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Check role-specific access
    const userData = user ? JSON.parse(user) : null
    if (request.nextUrl.pathname.startsWith("/dashboard") && 
        userData?.role?.name !== "Admin") {
      return NextResponse.redirect(new URL("/profile", request.url))
    }
  }

  // Redirect logged-in users from login page
  if (request.nextUrl.pathname === "/login" && user) {
    const userData = JSON.parse(user)
    if (userData.role.name === "Admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login"],
} 