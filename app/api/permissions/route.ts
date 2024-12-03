import { NextResponse } from 'next/server'

const permissions = [
  { id: "read", name: "Read" },
  { id: "write", name: "Write" },
  { id: "delete", name: "Delete" },
]

export async function GET() {
  return NextResponse.json(permissions)
}

