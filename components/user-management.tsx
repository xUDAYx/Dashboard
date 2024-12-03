"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import { Skeleton } from "./ui/skeleton"

type User = {
  id: number
  name: string
  email: string
  roleId: number
  role: {
    id: number
    name: string
  }
}

type Role = {
  id: number
  name: string
}

type SortConfig = {
  key: keyof User | 'role.name'
  direction: 'ascending' | 'descending'
}

export default function UserManagement() {
  const [data, setData] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    roleId: 0,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [_error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'ascending'
  })

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    void fetchUsers()
    void fetchRoles()
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles")
      if (!response.ok) throw new Error('Failed to fetch roles')
      const data = await response.json()
      setRoles(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    }
  }

  const handleAddUser = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
      if (!response.ok) throw new Error('Failed to add user')
      const newUserData = await response.json()
      
      setData(prevData => [...prevData, newUserData])
      
      setNewUser({ name: "", email: "", roleId: 0 })
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "User added successfully",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error('Failed to delete user')
      setData(data.filter(user => user.id !== id))
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = async () => {
    if (!editingUser) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          roleId: editingUser.roleId,
        }),
      })
      if (!response.ok) throw new Error('Failed to update user')
      const updatedUser = await response.json()
      
      setData(data.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ))
      setIsEditDialogOpen(false)
      setEditingUser(null)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }))
  }

  const filteredAndSortedUsers = useMemo(() => {
    return data
      .filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = sortConfig.key === 'role.name' ? a.role.name : a[sortConfig.key as keyof User]
        const bValue = sortConfig.key === 'role.name' ? b.role.name : b[sortConfig.key as keyof User]

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
  }, [data, searchTerm, sortConfig])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select
                  value={newUser.roleId.toString()}
                  onValueChange={(value) => setNewUser({ ...newUser, roleId: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddUser} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-8"
        />
        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" />
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input
                id="edit-name"
                value={editingUser?.name || ""}
                onChange={(e) => setEditingUser(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editingUser?.email || ""}
                onChange={(e) => setEditingUser(prev => 
                  prev ? { ...prev, email: e.target.value } : null
                )}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">Role</Label>
              <Select
                value={editingUser?.roleId.toString()}
                onValueChange={(value) => setEditingUser(prev => 
                  prev ? { ...prev, roleId: parseInt(value) } : null
                )}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleEditUser} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update User"}
          </Button>
        </DialogContent>
      </Dialog>

      <div className="relative w-full overflow-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[200px] cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Name 
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="inline ml-2 h-4 w-4" /> : 
                      <ChevronDown className="inline ml-2 h-4 w-4" />
                  )}
                </TableHead>
                <TableHead 
                  className="min-w-[200px] cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  Email
                  {sortConfig.key === 'email' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="inline ml-2 h-4 w-4" /> : 
                      <ChevronDown className="inline ml-2 h-4 w-4" />
                  )}
                </TableHead>
                <TableHead 
                  className="w-[100px] cursor-pointer"
                  onClick={() => handleSort('role.name')}
                >
                  Role
                  {sortConfig.key === 'role.name' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="inline ml-2 h-4 w-4" /> : 
                      <ChevronDown className="inline ml-2 h-4 w-4" />
                  )}
                </TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-6 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-[60px]" />
                        <Skeleton className="h-8 w-[60px]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {user.email}
                    </TableCell>
                    <TableCell>{user.role.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

