import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    })
    return NextResponse.json(users)
  } catch (err) {
    console.error('Failed to fetch users:', err)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        roleId: body.roleId,
      },
      include: {
        role: true,
      },
    })

    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json(sanitizedUser)
  } catch (err) {
    console.error('Failed to create user:', err)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

