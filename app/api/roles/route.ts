import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const roles = await prisma.role.findMany()
    return NextResponse.json(roles)
  } catch (err) {
    console.error('Failed to fetch roles:', err)
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const role = await prisma.role.create({
      data: {
        name: body.name,
        permissions: body.permissions,
      },
    })
    return NextResponse.json(role)
  } catch (err) {
    console.error('Failed to create role:', err)
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 })
  }
}

