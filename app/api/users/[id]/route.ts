import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: {
        id: parseInt(params.id),
      },
    })
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const user = await prisma.user.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name: body.name,
        email: body.email,
        roleId: body.roleId,
      },
      include: {
        role: true,
      },
    })
    return NextResponse.json(user)
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

