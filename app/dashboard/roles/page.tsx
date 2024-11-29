"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RoleForm } from "@/components/role-form"
import { Pencil, Trash2 } from 'lucide-react'

interface Role {
  id: number
  name: string
  description: string
}

// Mock data
const initialRoles: Role[] = [
  { id: 1, name: "Admin", description: "Full access to all features" },
  { id: 2, name: "User", description: "Limited access to features" },
  { id: 3, name: "Manager", description: "Access to management features" },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddRole = (newRole: Omit<Role, 'id'>) => {
    setRoles([...roles, { id: roles.length + 1, ...newRole }])
  }

  const handleEditRole = (editedRole: Role) => {
    setRoles(roles.map((role) => (role.id === editedRole.id ? editedRole : role)))
  }

  const handleDeleteRole = (roleId: number) => {
    setRoles(roles.filter((role) => role.id !== roleId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Role</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <RoleForm onSubmit={handleAddRole} />
          </DialogContent>
        </Dialog>
      </div>
      <Input
        placeholder="Search roles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                      </DialogHeader>
                      <RoleForm role={role} onSubmit={(data) => handleEditRole({ ...data, id: role.id })} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}        </TableBody>
      </Table>
    </div>
  )
}
