import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Find user with email and include role
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    })

    if (!user || user.password !== password) { // In production, use proper password hashing
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create a sanitized version of user data (excluding password)
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    // Set user data in cookies
    cookies().set({
      name: "user",
      value: JSON.stringify(sanitizedUser),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return NextResponse.json({ 
      user: sanitizedUser,
      redirectUrl: user.role.name === "Admin" ? "/dashboard" : "/profile"
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
} 