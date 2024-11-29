import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  const [userCount, roleCount, permissionCount] = await Promise.all([
    prisma.user.count(),
    prisma.role.count(),
    prisma.permission.count()
  ])

  return {
    totalUsers: userCount,
    totalRoles: roleCount,
    totalPermissions: permissionCount
  }
}
