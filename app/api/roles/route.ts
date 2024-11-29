import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const data = await request.json()
  
  const role = await prisma.role.create({
    data: {
      name: data.name,
      description: data.description
    }
  })
  
  return NextResponse.json(role)
}
