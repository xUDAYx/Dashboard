import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      roles: {
        select: {
          name: true
        }
      },
      createdAt: true
    }
  })
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roles: {
          create: {
            name: data.role,
          }
        }
      },
      include: {
        roles: true
      }
    })
    
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
    
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}