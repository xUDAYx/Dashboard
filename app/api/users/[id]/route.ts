import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = await params.id
  const data = await request.json()
  
  const updatedUser = await prisma.user.update({
    where: {
      id: parseInt(id)
    },
    data: {
      name: data.name,
      email: data.email,
      roles: {
        deleteMany: {},
        create: {
          name: data.role
        }
      }
    },
    include: {
      roles: true
    }
  })

  return NextResponse.json(updatedUser)
}