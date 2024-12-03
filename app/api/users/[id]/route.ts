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
    const { name, email, roleId, currentPassword, newPassword } = body

    // If password update is requested, verify current password
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(params.id) },
      })

      if (!user || user.password !== currentPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        )
      }
    }

    // Update user with or without password
    const user = await prisma.user.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name,
        email,
        roleId,
        ...(newPassword ? { password: newPassword } : {}),
      },
      include: {
        role: true,
      },
    })

    // Create sanitized version of user data (excluding password)
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json(sanitizedUser)
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

