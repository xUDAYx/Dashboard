import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // First, create some roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      permissions: ['CREATE_USER', 'READ_USER', 'UPDATE_USER', 'DELETE_USER', 'MANAGE_ROLES']
    },
  })

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: {
      name: 'Manager',
      permissions: ['READ_USER', 'UPDATE_USER']
    },
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      permissions: ['READ_USER']
    },
  })

  // Then create users
  const users = [
    {
      name: 'John Admin',
      email: 'john.admin@example.com',
      password: 'admin123',
      roleId: adminRole.id,
    },
    {
      name: 'Sarah Manager',
      email: 'sarah.manager@example.com',
      password: 'manager123',
      roleId: managerRole.id,
    },
    {
      name: 'Mike User',
      email: 'mike.user@example.com',
      password: 'user123',
      roleId: userRole.id,
    },
    {
      name: 'Emily Developer',
      email: 'emily.dev@example.com',
      password: 'developer123',
      roleId: managerRole.id,
    },
    {
      name: 'Alex Support',
      email: 'alex.support@example.com',
      password: 'support123',
      roleId: userRole.id,
    },
    {
      name: 'Lisa Admin',
      email: 'lisa.admin@example.com',
      password: 'admin123',
      roleId: adminRole.id,
    },
    {
      name: 'David Manager',
      email: 'david.manager@example.com',
      password: 'manager123',
      roleId: managerRole.id,
    },
    {
      name: 'Anna User',
      email: 'anna.user@example.com',
      password: 'user123',
      roleId: userRole.id,
    },
    {
      name: 'Tom Analyst',
      email: 'tom.analyst@example.com',
      password: 'analyst123',
      roleId: managerRole.id,
    },
    {
      name: 'Rachel Support',
      email: 'rachel.support@example.com',
      password: 'support123',
      roleId: userRole.id,
    }
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 