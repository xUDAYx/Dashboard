"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Copy, Check } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [copiedField, setCopiedField] = useState<string>("")

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

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(""), 2000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[900px] flex flex-col md:flex-row gap-4">
        {/* Login Form */}
        <Card className="flex-1 w-full">
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
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Test Credentials</CardTitle>
            <CardDescription className="hidden md:block">
              Use these credentials to test different user roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Admin Credentials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Admin User</h3>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-2 rounded gap-1">
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 text-center sm:text-left">
                      uday.admin@example.com
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleCopy("uday.admin@example.com", "adminEmail")}
                    >
                      {copiedField === "adminEmail" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-2 rounded gap-1">
                  <span className="text-sm font-medium text-gray-600">Password:</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 text-center sm:text-left">
                      admin123
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleCopy("admin123", "adminPass")}
                    >
                      {copiedField === "adminPass" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Regular User Credentials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Regular User</h3>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-2 rounded gap-1">
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 text-center sm:text-left">
                      allen.user@example.com
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleCopy("allen.user@example.com", "userEmail")}
                    >
                      {copiedField === "userEmail" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-2 rounded gap-1">
                  <span className="text-sm font-medium text-gray-600">Password:</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 text-center sm:text-left">
                      user123
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleCopy("user123", "userPass")}
                    >
                      {copiedField === "userPass" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500 text-center w-full">
              Note: This is for testing purposes as part of an internship assignment.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 