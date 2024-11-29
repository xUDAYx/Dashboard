"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Role {
  name: string
  description: string
}

interface RoleFormProps {
  role?: Role
  onSubmit: (data: Role) => void
}

export function RoleForm({ role, onSubmit }: RoleFormProps) {
  const [formData, setFormData] = useState<Role>(
    role || {
      name: "",
      description: "",
    }
  )
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
    toast({
      title: role ? "Role Updated" : "Role Added",
      description: `${formData.name} has been ${role ? "updated" : "added"} successfully.`,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="Role Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Textarea
        name="description"
        placeholder="Role Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <Button type="submit">{role ? "Update Role" : "Add Role"}</Button>
    </form>
  )
}
