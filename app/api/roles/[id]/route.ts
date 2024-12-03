import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.role.delete({
      where: {
        id: parseInt(params.id),
      },
    })
    return NextResponse.json({ message: 'Role deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const role = await prisma.role.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name: body.name,
        permissions: body.permissions,
      },
    })
    return NextResponse.json(role)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }
}

