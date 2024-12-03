"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Show success message
      toast({
        title: "Success",
        description: "Logged in successfully",
      })

      // Redirect to the appropriate page
      router.push(data.redirectUrl)
      router.refresh() // Refresh to update the UI with new session data
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-[900px] p-4 flex gap-4">
        {/* Login Form */}
        <Card className="flex-1">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Logging in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Test Credentials */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Test Credentials</CardTitle>
            <CardDescription>
              Use these credentials to test different user roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Admin Credentials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Admin User</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    uday.admin@example.com
                  </code>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium text-gray-600">Password:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    admin123
                  </code>
                </div>
              </div>
            </div>

            <Separator />

            {/* Regular User Credentials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Regular User</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    allen.user@example.com
                  </code>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium text-gray-600">Password:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    user123
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Note: This is for testing purposes as part of an internship assignment.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 