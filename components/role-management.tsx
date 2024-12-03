"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Search } from 'lucide-react'

type Permission = {
  id: string
  name: string
}

type Role = {
  id: number
  name: string
  permissions: string[]
}

type SortConfig = {
  key: keyof Role
  direction: 'ascending' | 'descending'
}

export default function RoleManagement() {
  const [data, setData] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [newRole, setNewRole] = useState<Omit<Role, "id">>({ name: "", permissions: [] })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'ascending' })
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [_error, setError] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    void fetchRoles()
    void fetchPermissions()
  }, [])

  const fetchRoles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/roles")
      if (!response.ok) throw new Error('Failed to fetch roles')
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

  const fetchPermissions = async () => {
    const response = await fetch("/api/permissions")
    const data = await response.json()
    setPermissions(data)
  }

  const handleAddRole = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRole),
      })
      if (!response.ok) throw new Error('Failed to add role')
      const data = await response.json()
      setData([...data, data])
      setNewRole({ name: "", permissions: [] })
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Role added successfully",
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

  const handleDeleteRole = async (id: number) => {
    await fetch(`/api/roles/${id}`, { method: "DELETE" })
    setData(data.filter(role => role.id !== id))
    toast({
      title: "Role Deleted",
      description: "The role has been successfully deleted.",
    })
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setNewRole({ ...newRole, permissions: [...newRole.permissions, permissionId] })
    } else {
      setNewRole({ ...newRole, permissions: newRole.permissions.filter(id => id !== permissionId) })
    }
  }

  const handleSort = (key: keyof Role) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }))
  }

  const handleEditRole = async () => {
    if (!editingRole) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/roles/${editingRole.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingRole.name,
          permissions: editingRole.permissions,
        }),
      })
      if (!response.ok) throw new Error('Failed to update role')
      const updatedRole = await response.json()
      
      setData(data.map(role => 
        role.id === updatedRole.id ? updatedRole : role
      ))
      setIsEditDialogOpen(false)
      setEditingRole(null)
      toast({
        title: "Success",
        description: "Role updated successfully",
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

  const filteredAndSortedRoles = useMemo(() => {
    return data
      .filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.permissions.some(permission => permission.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
  }, [data, searchTerm, sortConfig])

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">Role Management</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">Add Role</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Role</DialogTitle>
                <DialogDescription>
                  Enter the name for the new role and select the permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Permissions</Label>
                  <div className="col-span-3 space-y-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={newRole.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                        />
                        <Label htmlFor={permission.id}>{permission.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={handleAddRole}>Add Role</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mb-4 flex items-center">
        <Search className="w-5 h-5 mr-2 text-gray-500" />
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
              </TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.permissions.join(", ")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingRole(role)
                        setIsEditDialogOpen(true)
                      }}
                      disabled={isLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid gap-4 md:hidden">
        {filteredAndSortedRoles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle>{role.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Permissions:</strong> {role.permissions.join(", ")}</p>
              <div className="flex space-x-2 mt-4">
                <Button variant="destructive" onClick={() => handleDeleteRole(role.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Modify the role name and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editingRole?.name || ""}
                onChange={(e) => setEditingRole(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Permissions</Label>
              <div className="col-span-3 space-y-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${permission.id}`}
                      checked={editingRole?.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (!editingRole) return
                        const newPermissions = checked
                          ? [...editingRole.permissions, permission.id]
                          : editingRole.permissions.filter(id => id !== permission.id)
                        setEditingRole({ ...editingRole, permissions: newPermissions })
                      }}
                    />
                    <Label htmlFor={`edit-${permission.id}`}>{permission.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button onClick={handleEditRole} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

