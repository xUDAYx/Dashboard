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
import { PermissionForm } from "@/components/permission-form"
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Permission {
  id: number
  name: string
  description: string
}

interface Role {
  id: number
  name: string
}

// Mock data
const initialPermissions: Permission[] = [
  { id: 1, name: "Create User", description: "Ability to create new users" },
  { id: 2, name: "Edit User", description: "Ability to edit existing users" },
  { id: 3, name: "Delete User", description: "Ability to delete users" },
  { id: 4, name: "View Reports", description: "Ability to view system reports" },
]

const initialRoles: Role[] = [
  { id: 1, name: "Admin" },
  { id: 2, name: "User" },
  { id: 3, name: "Manager" },
]

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState(initialPermissions)
  const [roles] = useState(initialRoles)
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)

  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPermission = (newPermission: Omit<Permission, 'id'>) => {
    setPermissions([...permissions, { id: permissions.length + 1, ...newPermission }])
    setOpen(false)
  }

  const handleEditPermission = (editedPermission: Permission) => {
    setPermissions(permissions.map((permission) => (permission.id === editedPermission.id ? editedPermission : permission)))
  }

  const handleDeletePermission = (permissionId: number) => {
    setPermissions(permissions.filter((permission) => permission.id !== permissionId))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Permissions</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Permission</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Permission</DialogTitle>
            </DialogHeader>
            <PermissionForm onSubmit={handleAddPermission} />
          </DialogContent>
        </Dialog>
      </div>
      <Input
        placeholder="Search permissions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              {roles.map((role) => (
                <TableHead key={role.id}>{role.name}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                {roles.map((role) => (
                  <TableCell key={role.id} className="text-center">
                    <div className="flex justify-center">
                      <Checkbox />
                    </div>
                  </TableCell>
                ))}
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
                          <DialogTitle>Edit Permission</DialogTitle>
                        </DialogHeader>
                        <PermissionForm permission={permission} onSubmit={(data) => handleEditPermission({ ...data, id: permission.id })} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeletePermission(permission.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden">
        <Accordion type="single" collapsible className="w-full">
          {filteredPermissions.map((permission) => (
            <AccordionItem value={`permission-${permission.id}`} key={permission.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <span>{permission.name}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{permission.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox id={`${permission.id}-${role.id}`} />
                        <label htmlFor={`${permission.id}-${role.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {role.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Permission</DialogTitle>
                        </DialogHeader>
                        <PermissionForm permission={permission} onSubmit={(data) => handleEditPermission({ ...data, id: permission.id })} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePermission(permission.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
