"use client"
  import { useState, useEffect } from "react"
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
  import { Users, ShieldCheck, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
  import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
  import { Skeleton } from "@/components/ui/skeleton"

  type DashboardStats = {
    totalUsers: number
    totalRoles: number
    usersPerRole: {
      name: string
      users: number
    }[]
    userGrowth: number // Percentage change
    roleGrowth: number // Percentage change
  }

  export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
      totalUsers: 0,
      totalRoles: 0,
      usersPerRole: [],
      userGrowth: 0,
      roleGrowth: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const fetchStats = async () => {
        try {
          setIsLoading(true)
          // Fetch users
          const usersResponse = await fetch("/api/users")
          const users = await usersResponse.json()
        
          // Fetch roles
          const rolesResponse = await fetch("/api/roles")
          const roles = await rolesResponse.json()

          // Calculate users per role
          const usersPerRole = roles.map((role: any) => ({
            name: role.name,
            users: users.filter((user: any) => user.roleId === role.id).length
          }))

          // Mock growth data (you can replace with real data)
          const userGrowth = 12.5  // Example: 12.5% growth
          const roleGrowth = 8.3   // Example: 8.3% growth

          setStats({
            totalUsers: users.length,
            totalRoles: roles.length,
            usersPerRole,
            userGrowth,
            roleGrowth
          })
        } catch (error) {
          console.error("Failed to fetch dashboard stats:", error)
        } finally {
          setIsLoading(false)
        }
      }

      void fetchStats()
    }, [])
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your system's users and roles.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {isLoading ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-8 w-[100px] mb-1" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                    <Skeleton className="h-4 w-[50px]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-8 w-[100px] mb-1" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                    <Skeleton className="h-4 w-[50px]" />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">
                        Registered users
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.userGrowth >= 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                      {Math.abs(stats.userGrowth)}%
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{stats.totalRoles}</div>
                      <p className="text-xs text-muted-foreground">
                        Active roles
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${stats.roleGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.roleGrowth >= 0 ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                      {Math.abs(stats.roleGrowth)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users per Role</CardTitle>
            <CardDescription>
              Distribution of users across different roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-[250px] w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.usersPerRole}>
                    <XAxis 
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar 
                      dataKey="users" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
